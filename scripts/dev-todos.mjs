import fs from 'node:fs';
import path from 'node:path';

/**
 * DEV ONLY — the to-do page's save (pages/dev/todos). A Vite middleware, so
 * it exists only under `astro dev` and never in the static build.
 *
 *   POST /__todos/save
 *   body: [{ "id": "…", "text": "…", "done": false, "at": "2026-10-27" }, …]
 *
 * Writes the whole list to `src/data/todos.json`, committed with the site
 * like any other file, so the list travels with the repo.
 */
const FILE = path.join(process.cwd(), 'src/data/todos.json');

const body = req =>
  new Promise((resolve, reject) => {
    const parts = [];
    req.on('data', c => parts.push(c));
    req.on('end', () => resolve(Buffer.concat(parts).toString('utf8')));
    req.on('error', reject);
  });

export const devTodos = () => ({
  name: 'dev-todos',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/__todos/save', async (req, res) => {
      res.setHeader('content-type', 'application/json');
      if (req.method !== 'POST') {
        res.statusCode = 405;
        return res.end('{}');
      }
      try {
        const list = JSON.parse(await body(req));
        if (!Array.isArray(list) || !list.every(t => typeof t.id === 'string' && typeof t.text === 'string'))
          throw new Error('a list of { id, text } is expected');
        const clean = list.map(({ id, text, done = false, at }) => ({ id, text: text.trim(), done: !!done, at }));
        fs.writeFileSync(FILE, `${JSON.stringify(clean, null, 2)}\n`);
        res.end(JSON.stringify({ ok: true, count: clean.length }));
      } catch (e) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: String(e?.message ?? e) }));
      }
    });
  },
});
