import fs from 'node:fs';
import path from 'node:path';

/**
 * DEV ONLY — drag-and-drop media orderer save endpoint (`pages/dev/media`).
 *
 *   POST /__media/save
 *   body: { group: 'events' | 'photos' | 'cosmos', id?: string, order: string[], removed?: string[] }
 *
 * Writes `src/data/media-order.json` so Events, Photos and Cosmos reflect the
 * exact order and removals chosen by Juan in `/dev/media`.
 *
 * Suppresses Vite HMR full-page reloads for `media-order.json` while still
 * invalidating the SSR module graph so navigating to site pages shows the
 * updated order immediately without resetting `/dev/media`.
 */
const FILE = path.join(process.cwd(), 'src/data/media-order.json');

const readBody = req =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });

export const mediaOrder = () => ({
  name: 'media-order',
  apply: 'serve',
  handleHotUpdate({ file, server }) {
    if (path.resolve(file) !== path.resolve(FILE)) return;
    const mods = server.moduleGraph.getModulesByFile(file);
    if (mods) {
      for (const mod of mods) {
        server.moduleGraph.invalidateModule(mod, new Set(), Date.now(), true);
      }
    }
    return [];
  },
  configureServer(server) {
    server.middlewares.use('/__media/save', async (req, res) => {
      res.setHeader('content-type', 'application/json');
      if (req.method !== 'POST') {
        res.statusCode = 405;
        return res.end(JSON.stringify({ ok: false, error: 'method' }));
      }
      try {
        const { group, id, order, removed } = JSON.parse(await readBody(req));
        if (
          !['events', 'photos', 'cosmos'].includes(group) ||
          !Array.isArray(order) ||
          !order.every(x => typeof x === 'string') ||
          (removed !== undefined &&
            (!Array.isArray(removed) || !removed.every(x => typeof x === 'string')))
        ) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ ok: false, error: 'invalid' }));
        }
        const current = fs.existsSync(FILE)
          ? JSON.parse(fs.readFileSync(FILE, 'utf8'))
          : { events: {}, photos: {}, cosmos: [], removed: { events: {}, photos: {}, cosmos: [] } };
        current.removed = current.removed ?? { events: {}, photos: {}, cosmos: [] };
        current.removed.events = current.removed.events ?? {};
        current.removed.photos = current.removed.photos ?? {};
        current.removed.cosmos = current.removed.cosmos ?? [];

        if (group === 'cosmos') {
          current.cosmos = order;
          if (removed !== undefined) current.removed.cosmos = removed;
        } else {
          if (typeof id !== 'string' || !id) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ ok: false, error: 'missing id' }));
          }
          current[group] = current[group] ?? {};
          current[group][id] = order;
          if (removed !== undefined) {
            if (removed.length) current.removed[group][id] = removed;
            else delete current.removed[group][id];
          }
        }
        fs.writeFileSync(FILE, JSON.stringify(current, null, 2) + '\n', 'utf8');
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ ok: false, error: String(err?.message ?? err) }));
      }
    });
  },
});
