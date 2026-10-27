import { defineConfig } from 'astro/config';
import { narrationRecorder } from './scripts/narration-recorder.mjs';
import { likesRanker } from './scripts/likes-ranker.mjs';
import { devTodos } from './scripts/dev-todos.mjs';

// juanevillam.com — static output, near-zero JS. Deployed on Cloudflare Pages
// from this repository's root: build command `npm run build`, output `dist`,
// Node from `.node-version`.
// Language is a client-side preference (html[data-lang]), not a URL — the
// page re-renders in place, the way the apps do from Settings.
export default defineConfig({
  site: 'https://juanevillam.com',
  // Every address is written WITHOUT a trailing slash — the canonical links,
  // the shareable addresses and the legal URLs Sound Shaper opens — so each
  // page is built as `{path}.html`, which Cloudflare Pages serves at exactly
  // that address. The default `{path}/index.html` would cost every one of
  // them a redirect to a slashed twin that names a different URL.
  build: { format: 'file' },
  // Astro 7 changed the default to 'jsx', which drops the whitespace between
  // inline elements (`a <em>b</em>` → `a<em>b</em>`) and so changes copy on
  // the page. `true` is the minification the site was written against.
  compressHTML: true,
  // Off in the CONFIG, not in `astro preferences` — that one lives in
  // .astro/settings.json, which any cache clear wipes, and the toolbar
  // came back twice that way.
  devToolbar: { enabled: false },
  // Dev only: the teleprompter's, the ranker's and the to-do list's saves
  // (pages/dev).
  // `apply: 'serve'` keeps them out of the build.
  vite: {
    plugins: [narrationRecorder(), likesRanker(), devTodos()],
    // Vite 8 minifies CSS with Lightning CSS, which folds
    // `backdrop-filter` + `-webkit-backdrop-filter` into the prefixed one
    // alone — Chrome then draws no frost behind a modal. esbuild is the
    // minifier the site was built and measured with.
    build: { cssMinify: 'esbuild' },
  },
  // Dev only: let a launcher hand the server a free port (PORT env);
  // Astro itself doesn't read PORT. Production is static output.
  server: ({ command }) =>
    command === 'dev' && process.env.PORT
      ? { port: Number(process.env.PORT) }
      : {},
});
