/**
 * Cloudflare Pages Function (`/api/photos`) — stores visitor Name + Email,
 * post likes, and post comments in Cloudflare D1 (`env.DB`) with zero
 * client-side SDK weight.
 *
 * Privacy & security:
 * - Visitor emails are never returned by GET `/api/photos` (only per-post
 *   integer like counts and whether the caller's own email liked each post).
 * - Each comment stores a SHA-256 `owner_hash` of `email:token` so the visitor
 *   who wrote it can delete their own comment from their session/device
 *   without exposing anyone's email or secret in the open-source repository.
 */
type D1Result<T = Record<string, unknown>> = { results?: T[] };
type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  all: <T = Record<string, unknown>>() => Promise<D1Result<T>>;
  run: () => Promise<unknown>;
};
type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
  batch: (statements: D1PreparedStatement[]) => Promise<unknown>;
};

type Env = {
  DB?: D1Database;
  PHOTOS_OWNER_KEY?: string;
};

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

const isValidEmail = (email: unknown): email is string =>
  typeof email === 'string' &&
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) &&
  email.trim().length <= 160;

const sha256Hex = async (input: string) => {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

const ensureSchema = async (db: D1Database) => {
  await db.batch([
    db.prepare(
      `CREATE TABLE IF NOT EXISTS photos_visitors (
        email TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        last_seen_at TEXT NOT NULL
      )`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS photos_likes (
        post_id TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TEXT NOT NULL,
        PRIMARY KEY (post_id, email)
      )`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS photos_comments (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL,
        author TEXT NOT NULL,
        email TEXT NOT NULL,
        owner_hash TEXT NOT NULL DEFAULT '',
        text TEXT NOT NULL,
        created_at TEXT NOT NULL
      )`,
    ),
  ]);
};

export const onRequestGet = async ({
  request,
  env,
}: {
  request: Request;
  env: Env;
}) => {
  if (!env.DB) {
    return new Response(
      JSON.stringify({ ok: true, likeCounts: {}, likedByMe: {}, comments: {} }),
      { headers: JSON_HEADERS },
    );
  }
  try {
    await ensureSchema(env.DB);
    const url = new URL(request.url);
    const email = (url.searchParams.get('email') ?? '').trim().toLowerCase();
    const token = (url.searchParams.get('token') ?? '').trim();
    const callerHash =
      email && token ? await sha256Hex(`${email}:${token}`) : '';

    const likeRows = await env.DB.prepare(
      'SELECT post_id, email FROM photos_likes',
    ).all<{ post_id: string; email: string }>();
    const commentRows = await env.DB.prepare(
      'SELECT id, post_id, author, owner_hash, text, created_at FROM photos_comments ORDER BY created_at ASC',
    ).all<{
      id: string;
      post_id: string;
      author: string;
      owner_hash: string;
      text: string;
      created_at: string;
    }>();

    const likeCounts: Record<string, number> = {};
    const likedByMe: Record<string, boolean> = {};
    for (const r of likeRows.results ?? []) {
      likeCounts[r.post_id] = (likeCounts[r.post_id] ?? 0) + 1;
      if (email && r.email === email) likedByMe[r.post_id] = true;
    }

    const comments: Record<
      string,
      {
        id: string;
        author: string;
        text: string;
        createdAt: string;
        canDelete: boolean;
      }[]
    > = {};
    for (const r of commentRows.results ?? []) {
      (comments[r.post_id] ??= []).push({
        id: r.id,
        author: r.author,
        text: r.text,
        createdAt: r.created_at,
        canDelete: Boolean(callerHash && r.owner_hash === callerHash),
      });
    }

    return new Response(
      JSON.stringify({ ok: true, likeCounts, likedByMe, comments }),
      { headers: JSON_HEADERS },
    );
  } catch {
    return new Response(
      JSON.stringify({ ok: true, likeCounts: {}, likedByMe: {}, comments: {} }),
      { headers: JSON_HEADERS },
    );
  }
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
    if (body.website) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: JSON_HEADERS,
      });
    }

    if (body.action === 'deleteComment') {
      const commentId = String(body.commentId ?? '').trim();
      const email = String(body.email ?? '')
        .trim()
        .toLowerCase();
      const token = String(body.token ?? '').trim();
      const ownerKey = String(body.ownerKey ?? '').trim();
      if (!commentId) {
        return new Response(
          JSON.stringify({ ok: false, error: 'missing_comment' }),
          { status: 400, headers: JSON_HEADERS },
        );
      }
      if (env.DB) {
        await ensureSchema(env.DB);
        if (env.PHOTOS_OWNER_KEY && ownerKey === env.PHOTOS_OWNER_KEY) {
          await env.DB.prepare('DELETE FROM photos_comments WHERE id = ?1')
            .bind(commentId)
            .run();
        } else if (email && token) {
          const callerHash = await sha256Hex(`${email}:${token}`);
          await env.DB.prepare(
            'DELETE FROM photos_comments WHERE id = ?1 AND owner_hash = ?2',
          )
            .bind(commentId, callerHash)
            .run();
        }
      }
      return new Response(JSON.stringify({ ok: true }), {
        headers: JSON_HEADERS,
      });
    }

    const name = String(body.name ?? '')
      .trim()
      .slice(0, 80);
    const email = String(body.email ?? '')
      .trim()
      .toLowerCase();
    const token = String(body.token ?? '')
      .trim()
      .slice(0, 120);
    if (!name || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'invalid_identity' }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

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

    if (body.action === 'unlock') {
      return new Response(JSON.stringify({ ok: true }), {
        headers: JSON_HEADERS,
      });
    }

    const postId = String(body.postId ?? '').trim();
    if (!postId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'missing_post' }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    if (body.action === 'like') {
      const liked = Boolean(body.liked);
      if (env.DB) {
        if (liked) {
          await env.DB.prepare(
            `INSERT OR IGNORE INTO photos_likes (post_id, email, created_at) VALUES (?1, ?2, ?3)`,
          )
            .bind(postId, email, now)
            .run();
        } else {
          await env.DB.prepare(
            `DELETE FROM photos_likes WHERE post_id = ?1 AND email = ?2`,
          )
            .bind(postId, email)
            .run();
        }
      }
      return new Response(JSON.stringify({ ok: true, liked }), {
        headers: JSON_HEADERS,
      });
    }

    if (body.action === 'comment') {
      const text = String(body.text ?? '')
        .trim()
        .slice(0, 500);
      if (!text) {
        return new Response(
          JSON.stringify({ ok: false, error: 'empty_comment' }),
          { status: 400, headers: JSON_HEADERS },
        );
      }
      const ownerHash = await sha256Hex(`${email}:${token}`);
      const comment = {
        id: `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        author: name,
        text,
        createdAt: now,
        canDelete: true,
      };
      if (env.DB) {
        await env.DB.prepare(
          `INSERT INTO photos_comments (id, post_id, author, email, owner_hash, text, created_at)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`,
        )
          .bind(comment.id, postId, name, email, ownerHash, text, now)
          .run();
      }
      return new Response(JSON.stringify({ ok: true, comment }), {
        headers: JSON_HEADERS,
      });
    }

    return new Response(
      JSON.stringify({ ok: false, error: 'unknown_action' }),
      { status: 400, headers: JSON_HEADERS },
    );
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'server_error' }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
};
