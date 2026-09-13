import { defineConfig } from 'astro/config';

// juanevillam.com — static output, near-zero JS. Deployed on Cloudflare Pages
// (build command `npm run build --workspace web`, output `apps/web/dist`).
// Language is a client-side preference (html[data-lang]), not a URL — the
// page re-renders in place, the way the apps do from Settings.
export default defineConfig({
  site: 'https://juanevillam.com',
});
