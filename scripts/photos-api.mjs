import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STORE_PATH = fileURLToPath(
  new URL('../.astro/photos-store.json', import.meta.url),
);

const readStore = () => {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  } catch {
    return { visitors: [], likes: {} };
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

const isValidEmail = email =>
  typeof email === 'string' &&
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) &&
  email.trim().length <= 160;

/**
 * Dev-server middleware for `/api/photos`.
 * Stores data in `.astro/photos-store.json` (gitignored, never committed to
 * the public repo).
 */
export const photosApi = () => ({
  name: 'photos-api',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/api/photos', async (req, res, next) => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');

      if (req.method === 'GET') {
        const url = new URL(req.url ?? '', 'http://localhost');
        const email = (url.searchParams.get('email') ?? '')
          .trim()
          .toLowerCase();
        const store = readStore();

        const likeCounts = {};
        const likedByMe = {};
        for (const [postId, list] of Object.entries(store.likes ?? {})) {
          if (Array.isArray(list)) {
            likeCounts[postId] = list.length;
            likedByMe[postId] = Boolean(email && list.includes(email));
          }
        }

        res.end(JSON.stringify({ ok: true, likeCounts, likedByMe }));
        return;
      }

      if (req.method !== 'POST') {
        next();
        return;
      }

      try {
        const body = await readBody(req);
        if (body.website) {
          res.end(JSON.stringify({ ok: true }));
          return;
        }

        const store = readStore();
        store.visitors ??= [];
        store.likes ??= {};

        const name = String(body.name ?? '')
          .trim()
          .slice(0, 80);
        const email = String(body.email ?? '')
          .trim()
          .toLowerCase();

        if (!name || !isValidEmail(email)) {
          res.statusCode = 400;
          res.end(JSON.stringify({ ok: false, error: 'invalid_identity' }));
          return;
        }

        const existing = store.visitors.find(v => v.email === email);
        const now = new Date().toISOString();
        if (existing) {
          existing.name = name;
          existing.lastSeenAt = now;
        } else {
          store.visitors.push({ name, email, createdAt: now, lastSeenAt: now });
        }

        if (body.action === 'unlock') {
          writeStore(store);
          res.end(JSON.stringify({ ok: true }));
          return;
        }

        const postId = String(body.postId ?? '').trim();
        if (!postId) {
          res.statusCode = 400;
          res.end(JSON.stringify({ ok: false, error: 'missing_post' }));
          return;
        }

        if (body.action === 'like') {
          const list = Array.isArray(store.likes[postId])
            ? store.likes[postId]
            : [];
          const idx = list.indexOf(email);
          const liked =
            body.liked !== undefined ? Boolean(body.liked) : idx === -1;
          if (liked && idx === -1) list.push(email);
          if (!liked && idx !== -1) list.splice(idx, 1);
          store.likes[postId] = list;
          writeStore(store);
          res.end(
            JSON.stringify({
              ok: true,
              liked,
              countDelta: list.length,
            }),
          );
          return;
        }

        res.statusCode = 400;
        res.end(JSON.stringify({ ok: false, error: 'unknown_action' }));
      } catch {
        res.statusCode = 500;
        res.end(JSON.stringify({ ok: false, error: 'server_error' }));
      }
    });
  },
});
