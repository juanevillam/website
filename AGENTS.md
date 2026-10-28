# juanevillam.com — the website

Juan Villa's personal site: his GitHub and LinkedIn in one place, told in his
own voice. Astro, static output, deployed on Cloudflare Pages. Its own repo
since 2026-10-17 (`juanevillam/website`), extracted with its history from the
private `juanevillam/portfolio` monorepo, where it was `apps/web`. It is
cloned inside that monorepo's folder (gitignored there, pushed by its
pre-push hook), next to `sound-shaper/` and `games/`.

**LIVE SINCE 2026-10-17** at https://juanevillam.com — Cloudflare Pages
project `juanevillam`, built from `main` on every push (`npm run build` →
`dist`, Node from `.node-version`), `www` 301s to the apex with path and query
kept (a zone Redirect Rule), DNSSEC on. The domain is registered at Namecheap
with Cloudflare's nameservers. Sound Shaper's legal pages
(`/sound-shaper/privacy-policy`, `/support`, `/delete-account`,
`/terms-and-conditions`) are what its App Store listing points at.

## Working here

- Commit on `main`, conventional commits, signed (SSH key; `git commit` hangs
  if `ssh-add -l` is empty — never `--no-gpg-sign`). Don't push unless asked.
- `npm run dev` (dev server + the teleprompter's recorder), `npm run build`,
  `npm run typecheck` (`astro check`), `npm run narration` (the recording
  checklist), `npm run arcade` (refresh Space Explorer from `../games/`),
  `npm run tridi` (refresh the Tridi robot's walk from `../../tridi/`, or
  `TRIDI_DIR`).
- Easter eggs (`lib/eggs`, 2026-10-28): a few seconds after the hero
  settles, Space Explorer's ship fights the game's rust ace behind the
  name (the game's own models, colours and arsenal: cannon, shield, dash,
  missiles, Overdrive) and links to its card; Tridi's tracking points walk
  onto the Platanus card's photo frame and become the G1 (real data from
  Tridi's `caminar` clip, linking to Tridi), and the same walk crosses the
  foot (linking to that card). Never while the voice plays or anything is
  open; with reduced motion they stand still. Their drawing loads on first
  show.
- One dev server at a time. `.claude/launch.json`: `web` (dev, `--host` for
  the iPhone on the LAN) and `web-prod` (build + preview on :4322).
- **Verify on a real iPhone** for anything scroll- or motion-coupled: the
  Mac's responsive mode runs on the Mac's GPU and hides compositing cost.
- **The page must load light** (Juan, 2026-10-18): measured on the
  production build it fetched 18.8 MB before anyone scrolled; it is ~2.3 MB
  now. Videos never preload ahead — they load when their card plays them;
  pictures ship at the size the page draws (WebP for screenshots, JPEG q80
  for photos). Re-measure with a production build and a throttled phone
  before adding media.
- The audits are `.claude/commands/web-*.md`; their order and the ground
  rules they share are in [`docs/audit-playbook.md`](docs/audit-playbook.md).
  `/web-release-audit` runs before every deploy.

## Versions

**Every push a visitor can see gets a tag and a GitHub Release** (Juan,
2026-10-18). `package.json`'s `version` is the site's; it went `1.0.0` at the
public launch (`v1.0.0`, 2026-10-17).

- **Bump by what a visitor notices.** Minor (`1.1.0`) for something new or gone
  — a section, a demo, a project added or removed, a redesign. Patch
  (`1.1.1`) for fixes, copy, performance. Docs- and tooling-only pushes take
  no version and no tag.
- **One tag per push, not per commit.** Bump `version` in a last
  `chore(release): vX.Y.Z` commit and tag THAT commit — it is the one
  Cloudflare deploys — then push the commits and the tag together.
- **Every tag becomes a GitHub Release** the same day, notes from
  `/release-notes` (what changed for a visitor, Apple voice, no engineering
  detail).

The apps follow the same idea with one difference: a store build waits for
review, so its tag is made at submit and its Release when a store approves —
see the portfolio's `AGENTS.md` → "Release tags".

## What the site is

- **One snapped page**: hero → the apps (`AppsShowcase`, today only Sound
  Shaper) → More Work (`lib/work.ts`) → Events (`lib/events.ts`, newest
  first) → footer. More Work's screens are silent recordings of each
  site being scrolled (~11 s, `public/media/work/*.mp4`, recorded with
  headless Chromium); only the strongest projects stay — Andreina Aular's
  was removed on 2026-10-18. Both lists are `PanelDeck`s: one deck, one
  narrator, the same controls. The phone layout is its own composition below 48rem.
- **Dark only.** Language is an in-place preference (`html[data-lang]`, en / es
  / zh), never a URL; a link may carry `?lang=` for that visit only, and with
  none the browser's language wins over English.
- **Shareable addresses** (`lib/links.ts`): `/sound-shaper`, `/work/{slug}`,
  `/events/{slug}-{yyyy-mm}` — the whole landing with that one thing open as a
  modal from the first paint, with its own preview card. The link glyph beside
  each name copies it. `/work` and `/events` open the landing at their section.
- **Narration is ONE VOICE, Spanish** (`lib/narration.ts`): every paragraph has
  a clip in `public/media/narration/es/`. Recording English and Chinese was
  dropped on purpose.
  - Takes are kept **exactly as recorded** — only re-wrapped as AAC. No trim,
    levelling, filters or breath softening, ever. Cuts Juan asks for are made
    without re-encoding (`ffmpeg -c copy`). They PLAY at the speed they were
    recorded: 1.1× with the pitch kept was tried and sounded robotic (Juan,
    2026-10-17), so nothing time-stretches the voice.
  - **THE PARAGRAPH IS THE TAKE, AND IT READS ITSELF** (2026-10-17). Every
    narrated paragraph is Juan's own take, transcribed and tidied (repeats
    and filler out, names spelled right; English and Chinese written sentence
    for sentence). While its clip plays the whole box dims to
    `--ink-waiting` and each word lights up as it is said — two inks only.
    The timings are whisper.cpp's, per word, in
    `src/data/narration/{key}.words.json`; at build time Spanish is aligned
    word by word and the translations sentence by sentence (same sentence
    count, or it falls back to the whole clip) and emitted as
    `data-read-{lang}`. There are NO subtitles in the narrator any more.
  - **The hero and the footer read along in a CAPTION** (2026-10-17): their
    clips have no paragraph on screen, so their words (`hero.caption`,
    `footer.caption`) stand under the narrator, three lines at most, the
    line being said always the last, shown only while the voice plays.
  - **A song a take introduces is a line of its own** (`SONGS` in
    `lib/narration.ts`): a note, the title and who it is by, under the
    paragraph. Its demo is NOT in the take any more (2026-10-18): it is
    Juan's screen recording of Sound Shaper shaping the song, with the app's
    own sound (`public/media/shaper/demo.mp4`), played over a frosted page
    on a phone exactly the screenshots' size, with no controls; the waves
    draw its sound (`SongDemo.astro`). The song's line, the welcome's
    "Hear DÁKITI in Sound Shaper" link and the end of the take all open it,
    and the voice carries on after it. Today that is DÁKITI in
    `shaper.s3.p2` — kept by Juan's call, knowing it is a commercial
    recording on a public page.
  - **The narrator is one fixed circle and never changes size**, and carries
    no controls of its own. A speed control and ten-second skips folded out
    of it for a day (2026-10-17) and were removed (Juan): the circle plays
    and pauses, and that is all.
  - Juan records from IDEAS (`lib/scripts.ts`), not a script; the teleprompter
    (`/dev/teleprompter`, dev only) transcribes each take locally with
    whisper.cpp and now writes its `.words.json` too. After a re-record,
    re-tidy that paragraph from the new transcript in all three languages,
    keeping the sentence counts equal.

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
