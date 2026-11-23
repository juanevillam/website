import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STORE_PATH = fileURLToPath(
  new URL('../.astro/photos-store.json', import.meta.url),
);

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  '524645244113-p2agelg1r5javeg9mje2c6cmle86mqbg.apps.googleusercontent.com';
const DEV_SESSION_SECRET =
  process.env.PHOTOS_SESSION_SECRET || 'dev-local-photos-session-secret';
const SESSION_COOKIE = 'jv_photos_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const readStore = () => {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  } catch {
    return { visitors: [] };
  }
};

const writeStore = data => {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
};

const readBody = req =>
  new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 32_768) reject(new Error('Payload too large'));
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });

const b64urlToBytes = str => {
  const pad = '='.repeat((4 - (str.length % 4)) % 4);
  const b64 = (str + pad).replace(/-/g, '+').replace(/_/g, '/');
  return new Uint8Array(Buffer.from(b64, 'base64'));
};

const bytesToB64url = bytes =>
  Buffer.from(bytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

let cachedJwks = null;
const getGoogleJwks = async (forceRefresh = false) => {
  const now = Date.now();
  if (!forceRefresh && cachedJwks && cachedJwks.expiresAt > now) {
    return cachedJwks.keys;
  }
  const res = await fetch(JWKS_URL);
  if (!res.ok) throw new Error('jwks_fetch_failed');
  const data = await res.json();
  const keys = data.keys ?? [];
  cachedJwks = { keys, expiresAt: now + 3_600_000 };
  return keys;
};

const verifyGoogleIdToken = async token => {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('malformed_jwt');
  const [headerB64, payloadB64, sigB64] = parts;
  const header = JSON.parse(decoder.decode(b64urlToBytes(headerB64)));
  if (header.alg !== 'RS256' || !header.kid) throw new Error('invalid_alg');

  let keys = await getGoogleJwks(false);
  let jwk = keys.find(k => k.kid === header.kid);
  if (!jwk) {
    keys = await getGoogleJwks(true);
    jwk = keys.find(k => k.kid === header.kid);
  }
  if (!jwk) throw new Error('unknown_kid');

  const key = await crypto.webcrypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const ok = await crypto.webcrypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    b64urlToBytes(sigB64),
    encoder.encode(`${headerB64}.${payloadB64}`),
  );
  if (!ok) throw new Error('invalid_signature');

  const claims = JSON.parse(decoder.decode(b64urlToBytes(payloadB64)));
  const nowSec = Math.floor(Date.now() / 1000);
  if (claims.aud !== GOOGLE_CLIENT_ID) throw new Error('invalid_aud');
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

const signSession = payload => {
  const body = bytesToB64url(encoder.encode(JSON.stringify(payload)));
  const sig = crypto
    .createHmac('sha256', DEV_SESSION_SECRET)
    .update(body)
    .digest();
  return `${body}.${bytesToB64url(sig)}`;
};

const verifySession = val => {
  const parts = String(val || '').split('.');
  if (parts.length !== 2) return null;
  const [body, sigB64] = parts;
  const expected = crypto
    .createHmac('sha256', DEV_SESSION_SECRET)
    .update(body)
    .digest();
  const actual = Buffer.from(b64urlToBytes(sigB64));
  if (
    expected.length !== actual.length ||
    !crypto.timingSafeEqual(expected, actual)
  ) {
    return null;
  }
  try {
    const payload = JSON.parse(decoder.decode(b64urlToBytes(body)));
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

const parseCookie = (header, name) => {
  if (!header) return null;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) {
      try {
        return decodeURIComponent(part.slice(idx + 1).trim());
      } catch {
        return null;
      }
    }
  }
  return null;
};

/**
 * Dev-server middleware for `/api/photos` — mirrors Cloudflare Pages Function
 * with real Google JWKS RSA-256 verification and HttpOnly session cookie.
 */
export const photosApi = () => ({
  name: 'photos-api',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/api/photos', async (req, res, next) => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');

      if (req.method === 'GET') {
        const token = parseCookie(req.headers.cookie, SESSION_COOKIE);
        const session = token ? verifySession(token) : null;
        if (!session) {
          res.end(JSON.stringify({ ok: true, authenticated: false }));
          return;
        }
        res.end(
          JSON.stringify({
            ok: true,
            authenticated: true,
            user: { name: session.name },
          }),
        );
        return;
      }

      if (req.method !== 'POST') {
        next();
        return;
      }

      try {
        const body = await readBody(req);

        if (body.action === 'logout') {
          res.setHeader(
            'Set-Cookie',
            `${SESSION_COOKIE}=; Path=/api/photos; HttpOnly; SameSite=Lax; Max-Age=0`,
          );
          res.end(JSON.stringify({ ok: true, authenticated: false }));
          return;
        }

        if (body.action !== 'google' || typeof body.credential !== 'string') {
          res.statusCode = 400;
          res.end(JSON.stringify({ ok: false, error: 'invalid_request' }));
          return;
        }

        const claims = await verifyGoogleIdToken(body.credential);
        const email = claims.email.trim().toLowerCase();
        const name = (claims.name || email.split('@')[0]).trim().slice(0, 80);
        const now = new Date().toISOString();

        const store = readStore();
        store.visitors ??= [];
        const existing = store.visitors.find(v => v.email === email);
        if (existing) {
          existing.name = name;
          existing.lastSeenAt = now;
        } else {
          store.visitors.push({ name, email, createdAt: now, lastSeenAt: now });
        }
        writeStore(store);

        const sessionVal = signSession({
          sub: claims.sub,
          email,
          name,
          exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
        });

        res.setHeader(
          'Set-Cookie',
          `${SESSION_COOKIE}=${encodeURIComponent(sessionVal)}; Path=/api/photos; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`,
        );
        res.end(
          JSON.stringify({
            ok: true,
            authenticated: true,
            user: { name },
          }),
        );
      } catch (err) {
        res.statusCode = 401;
        res.end(
          JSON.stringify({
            ok: false,
            error: err instanceof Error ? err.message : 'auth_failed',
          }),
        );
      }
    });
  },
});
