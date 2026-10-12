import { defineConfig } from 'astro/config';
import { narrationRecorder } from './scripts/narration-recorder.mjs';

// juanevillam.com — static output, near-zero JS. Deployed on Cloudflare Pages
// (build command `npm run build --workspace web`, output `apps/web/dist`).
// Language is a client-side preference (html[data-lang]), not a URL — the
// page re-renders in place, the way the apps do from Settings.
export default defineConfig({
  site: 'https://juanevillam.com',
  // Off in the CONFIG, not in `astro preferences` — that one lives in
  // .astro/settings.json, which any cache clear wipes, and the toolbar
  // came back twice that way.
  devToolbar: { enabled: false },
  // Dev only: the teleprompter's save button (pages/dev). `apply: 'serve'`
  // keeps it out of the build.
  vite: { plugins: [narrationRecorder()] },
  // Dev only: let a launcher hand the server a free port (PORT env);
  // Astro itself doesn't read PORT. Production is static output.
  server: ({ command }) =>
    command === 'dev' && process.env.PORT
      ? { port: Number(process.env.PORT) }
      : {},
});
