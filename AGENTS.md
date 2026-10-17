# juanevillam.com — the website

Juan Villa's personal site: his GitHub and LinkedIn in one place, told in his
own voice. Astro, static output, deployed on Cloudflare Pages. Its own repo
since 2026-10-17 (`juanevillam/website`), extracted with its history from the
private `juanevillam/portfolio` monorepo, where it was `apps/web`. It is
cloned inside that monorepo's folder (gitignored there, pushed by its
pre-push hook), next to `sound-shaper/` and `games/`.

**NOT DEPLOYED YET (2026-10-17).** Juan's order: run the `web-*` audits, deploy
the site, then submit Sound Shaper — whose App Store listing needs the legal
pages here (`/sound-shaper/privacy-policy`, `/support`, `/delete-account`,
`/terms-and-conditions`) live first.

## Working here

- Commit on `main`, conventional commits, signed (SSH key; `git commit` hangs
  if `ssh-add -l` is empty — never `--no-gpg-sign`). Don't push unless asked.
- `npm run dev` (dev server + the teleprompter's recorder), `npm run build`,
  `npm run typecheck` (`astro check`), `npm run narration` (the recording
  checklist), `npm run arcade` (refresh Space Explorer from `../games/`).
- One dev server at a time. `.claude/launch.json`: `web` (dev, `--host` for
  the iPhone on the LAN) and `web-prod` (build + preview on :4322).
- **Verify on a real iPhone** for anything scroll- or motion-coupled: the
  Mac's responsive mode runs on the Mac's GPU and hides compositing cost.
- The audits are `.claude/commands/web-*.md`; their order and the ground
  rules they share are in [`docs/audit-playbook.md`](docs/audit-playbook.md).
  `/web-release-audit` runs before every deploy.

## What the site is

- **One snapped page**: hero → the apps (`AppsShowcase`, today only Sound
  Shaper) → More Work (`lib/work.ts`) → Events (`lib/events.ts`, newest
  first) → footer. Both lists are `PanelDeck`s: one deck, one narrator, the
  same controls. The phone layout is its own composition below 48rem.
- **Dark only.** Language is an in-place preference (`html[data-lang]`, en / es
  / zh), never a URL; a link may carry `?lang=` for that visit only, and with
  none the browser's language wins over English.
- **Shareable addresses** (`lib/links.ts`): `/sound-shaper`, `/work/{slug}`,
  `/events/{slug}-{yyyy-mm}` — the whole landing with that one thing open as a
  modal from the first paint, with its own preview card. The link glyph beside
  each name copies it. `/work` and `/events` open the landing at their section.
- **Narration is ONE VOICE, Spanish** (`lib/narration.ts`): every paragraph has
  a clip in `public/media/narration/es/`, and English and Chinese visitors get
  subtitles in their language on the Spanish clock (`{key}.en.vtt`,
  `{key}.zh.vtt`). Recording English and Chinese was dropped on purpose.
  - Takes are kept **exactly as recorded** — only re-wrapped as AAC. No trim,
    levelling, filters or breath softening, ever. Cuts Juan asks for are made
    without re-encoding (`ffmpeg -c copy`), the subtitles moved with them.
  - Juan records from IDEAS (`lib/scripts.ts`), not a script; the teleprompter
    (`/dev/teleprompter`, dev only) transcribes each take locally with
    whisper.cpp into the Spanish `.vtt`. After a re-record, rewrite that clip's
    English and Chinese subtitles.

## Copy

- First person, plain, short sentences — Juan's voice, never an AI's: no
  "elevate / seamless / passionate / dive into", no rule-of-three, no hype.
- Every claim matches what the product does today — check the code or Juan's
  own words (the narration transcripts are the best source) before writing.
- Strings live in `src/i18n/ui.ts` only; labels in title case (English),
  Apple's terms. Salvalo is spelled without an accent. Never mention
  commissions, investors or company structure for Salvalo; Crol's title stays
  "Lead Frontend Developer", but he BUILT Crol ERP Móvil — never "led the
  frontend".

## Brand

The `#F5F5F5` / `#222222` neutrals, the stroke-built "jv" mark, no webfonts.
The favicon (`public/favicon.svg`) and `src/components/AppTile.astro` are
ports of the apps' brand tile — when the palette changes, follow the brand
runbook in the portfolio's `AGENTS.md`, which lists these two files.
