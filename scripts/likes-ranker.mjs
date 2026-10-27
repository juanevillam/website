import fs from 'node:fs';
import path from 'node:path';

/**
 * DEV ONLY — the ranker's save button (pages/dev/ranker). A Vite
 * middleware, so it exists only under `astro dev` and never in the static
 * build.
 *
 *   POST /__likes/save
 *   body: { "set": "cosmos", "order": ["the-crab-nebula", ...] }
 *
 * Writes that set's order, first to last, into `src/data/likes-order.json`
 * — the file lib/likes reads to show each set as Juan ranked it. Only a
 * set already in the file is taken, and only its own ids.
 */
const FILE = path.join(process.cwd(), 'src/data/likes-order.json');
const ID = /^[a-z0-9-]+$/;

const body = req =>
  new Promise((resolve, reject) => {
    const parts = [];
    req.on('data', c => parts.push(c));
    req.on('end', () => resolve(Buffer.concat(parts).toString('utf8')));
    req.on('error', reject);
  });

export const likesRanker = () => ({
  name: 'likes-ranker',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/__likes/save', async (req, res) => {
      res.setHeader('content-type', 'application/json');
      if (req.method !== 'POST') {
        res.statusCode = 405;
        return res.end('{}');
      }
      try {
        const { set, order } = JSON.parse(await body(req));
        const saved = JSON.parse(fs.readFileSync(FILE, 'utf8'));
        if (!(set in saved)) throw new Error(`unknown set: ${set}`);
        if (!Array.isArray(order) || !order.every(id => ID.test(id)))
          throw new Error('order must be a list of ids');
        saved[set] = order;
        fs.writeFileSync(FILE, `${JSON.stringify(saved, null, 2)}\n`);
        res.end(JSON.stringify({ ok: true, set, count: order.length }));
      } catch (e) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: String(e?.message ?? e) }));
      }
    });
  },
});
