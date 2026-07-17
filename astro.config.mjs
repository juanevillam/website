import { defineConfig } from 'astro/config';

// juanevillam.com — static output, near-zero JS. Deployed on Cloudflare Pages
// (build command `npm run build --workspace web`, output `apps/web/dist`).
export default defineConfig({
  site: 'https://juanevillam.com',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
