/**
 * Cloudflare Pages Function (`/api/photos`) — Google Sign-In (GIS ID Token)
 * verification + HttpOnly HMAC-SHA256 session cookie + Cloudflare D1 audit log.
 *
 * Security:
 * - Verifies Google ID token RSA-256 signature against Google's live JWKS
 *   (`https://www.googleapis.com/oauth2/v3/certs`), strictly checking `aud`,
 *   `iss`, `exp`, and `email_verified === true`.
 * - Issues a signed `HttpOnly; Secure; SameSite=Lax; Path=/api/photos` session
 *   cookie — never readable by JS, no client-side localStorage bypass.
 * - Never exposes visitor emails in any response.
 */
type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  run: () => Promise<unknown>;
};
type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
};

type Env = {
  DB?: D1Database;
  GOOGLE_CLIENT_ID?: string;
  PHOTOS_SESSION_SECRET?: string;
};

const DEFAULT_GOOGLE_CLIENT_ID =
  '524645244113-p2agelg1r5javeg9mje2c6cmle86mqbg.apps.googleusercontent.com';
const SESSION_COOKIE = 'jv_photos_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const b64urlToBytes = (str: string): Uint8Array => {
  const pad = '='.repeat((4 - (str.length % 4)) % 4);
  const b64 = (str + pad).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

const bytesToB64url = (bytes: Uint8Array): string => {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

type Jwk = JsonWebKey & { kid?: string };
let cachedJwks: { keys: Jwk[]; expiresAt: number } | null = null;

const getGoogleJwks = async (forceRefresh = false): Promise<Jwk[]> => {
  const now = Date.now();
  if (!forceRefresh && cachedJwks && cachedJwks.expiresAt > now) {
    return cachedJwks.keys;
  }
  const res = await fetch(JWKS_URL);
  if (!res.ok) throw new Error('jwks_fetch_failed');
  const cc = res.headers.get('cache-control') ?? '';
  const maxAgeMatch = /max-age=(\d+)/.exec(cc);
  const ttlMs = maxAgeMatch ? Number(maxAgeMatch[1]) * 1000 : 3_600_000;
  const data = (await res.json()) as { keys?: Jwk[] };
  const keys = data.keys ?? [];
  cachedJwks = { keys, expiresAt: now + Math.max(60_000, ttlMs) };
  return keys;
};

type GoogleClaims = {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  aud: string;
  iss: string;
  exp: number;
};

const verifyGoogleIdToken = async (
  token: string,
  expectedAud: string,
): Promise<GoogleClaims> => {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('malformed_jwt');
  const [headerB64, payloadB64, sigB64] = parts;

  const header = JSON.parse(decoder.decode(b64urlToBytes(headerB64))) as {
    alg?: string;
    kid?: string;
  };
  if (header.alg !== 'RS256' || !header.kid) throw new Error('invalid_alg');

  let keys = await getGoogleJwks(false);
  let jwk = keys.find(k => k.kid === header.kid);
  if (!jwk) {
    keys = await getGoogleJwks(true);
    jwk = keys.find(k => k.kid === header.kid);
  }
  if (!jwk) throw new Error('unknown_kid');

  const cryptoKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  const sig = b64urlToBytes(sigB64);
  const data = encoder.encode(`${headerB64}.${payloadB64}`);
  const ok = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    sig,
    data,
  );
  if (!ok) throw new Error('invalid_signature');

  const claims = JSON.parse(
    decoder.decode(b64urlToBytes(payloadB64)),
  ) as GoogleClaims;
  const nowSec = Math.floor(Date.now() / 1000);
  if (claims.aud !== expectedAud) throw new Error('invalid_aud');
  if (
    claims.iss !== 'https://accounts.google.com' &&
    claims.iss !== 'accounts.google.com'
  ) {
    throw new Error('invalid_iss');
  }
  if (typeof claims.exp !== 'number' || claims.exp <= nowSec) {
    throw new Error('token_expired');
  }
  if (claims.email_verified !== true || !claims.email) {
    throw new Error('email_not_verified');
  }
  return claims;
};

type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  exp: number;
};

const importHmacKey = (secret: string) =>
  crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );

const signSession = async (
  payload: SessionPayload,
  secret: string,
): Promise<string> => {
  const body = bytesToB64url(encoder.encode(JSON.stringify(payload)));
  const key = await importHmacKey(secret);
  const sig = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, encoder.encode(body)),
  );
  return `${body}.${bytesToB64url(sig)}`;
};

const verifySession = async (
  cookieVal: string,
  secret: string,
): Promise<SessionPayload | null> => {
  const parts = cookieVal.split('.');
  if (parts.length !== 2) return null;
  const [body, sigB64] = parts;
  try {
    const key = await importHmacKey(secret);
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      b64urlToBytes(sigB64),
      encoder.encode(body),
    );
    if (!valid) return null;
    const payload = JSON.parse(
      decoder.decode(b64urlToBytes(body)),
    ) as SessionPayload;
    if (
      typeof payload.exp !== 'number' ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
};

const parseCookie = (header: string | null, name: string): string | null => {
  if (!header) return null;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    if (k === name) return decodeURIComponent(part.slice(idx + 1).trim());
  }
  return null;
};

const ensureSchema = async (db: D1Database) => {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS photos_visitors (
        email TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        last_seen_at TEXT NOT NULL
      )`,
    )
    .run();
};

export const onRequestGet = async ({
  request,
  env,
}: {
  request: Request;
  env: Env;
}) => {
  const secret = env.PHOTOS_SESSION_SECRET;
  if (!secret) {
    return new Response(
      JSON.stringify({ ok: true, authenticated: false }),
      { headers: JSON_HEADERS },
    );
  }
  const token = parseCookie(request.headers.get('cookie'), SESSION_COOKIE);
  const session = token ? await verifySession(token, secret) : null;
  if (!session) {
    return new Response(
      JSON.stringify({ ok: true, authenticated: false }),
      { headers: JSON_HEADERS },
    );
  }
  return new Response(
    JSON.stringify({
      ok: true,
      authenticated: true,
      user: { name: session.name },
    }),
    { headers: JSON_HEADERS },
  );
};

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request;
  env: Env;
}) => {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    if (body.action === 'logout') {
      return new Response(JSON.stringify({ ok: true, authenticated: false }), {
        headers: {
          ...JSON_HEADERS,
          'Set-Cookie': `${SESSION_COOKIE}=; Path=/api/photos; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
        },
      });
    }

    if (body.action !== 'google' || typeof body.credential !== 'string') {
      return new Response(
        JSON.stringify({ ok: false, error: 'invalid_request' }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    const secret = env.PHOTOS_SESSION_SECRET;
    if (!secret) {
      return new Response(
        JSON.stringify({ ok: false, error: 'server_not_configured' }),
        { status: 503, headers: JSON_HEADERS },
      );
    }

    const clientId = env.GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID;
    const claims = await verifyGoogleIdToken(body.credential, clientId);
    const email = claims.email.trim().toLowerCase();
    const name = (claims.name || email.split('@')[0]).trim().slice(0, 80);
    const now = new Date().toISOString();

    if (env.DB) {
      await ensureSchema(env.DB);
      await env.DB.prepare(
        `INSERT INTO photos_visitors (email, name, created_at, last_seen_at)
         VALUES (?1, ?2, ?3, ?3)
         ON CONFLICT(email) DO UPDATE SET name = excluded.name, last_seen_at = excluded.last_seen_at`,
      )
        .bind(email, name, now)
        .run();
    }

    const sessionVal = await signSession(
      {
        sub: claims.sub,
        email,
        name,
        exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
      },
      secret,
    );

    return new Response(
      JSON.stringify({
        ok: true,
        authenticated: true,
        user: { name },
      }),
      {
        headers: {
          ...JSON_HEADERS,
          'Set-Cookie': `${SESSION_COOKIE}=${encodeURIComponent(sessionVal)}; Path=/api/photos; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`,
        },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: err instanceof Error ? err.message : 'auth_failed',
      }),
      { status: 401, headers: JSON_HEADERS },
    );
  }
};
