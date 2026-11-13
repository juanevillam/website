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
  `npm run tridi` (refresh the Tridi robot's two motions — the walk and the jumping jacks — from `../../tridi/`, or
  `TRIDI_DIR`).
- Easter eggs (`lib/eggs`, 2026-10-28). Space Explorer's ship is the
  star (`lib/ship`): three scenes that PLAY the game — a small copy of
  its own simulation, with its numbers and rules (cruise, eased yaw and
  pitch on a locked horizon, the dash, the shield, nitro, the cannon's
  cadence and auto-aim cone, missiles, the aces' AI and embers, the
  destroyer's entrance, salvo, turrets, domes and bridge) — where a scene
  adds only the stick and a camera. No flips (Juan, 2026-10-28): the
  hunt behind the hero's name (the shield eats the ace's embers), the
  escape over the game's card in More Work (the ship jinks through the
  game's dust; two kamikazes — flat out, never breaking off, the first
  firing as it comes — come in from off the right edge onto its tail;
  as one is about to ram it, a dash and nitro take it out to the left
  and they stream after it; no link there, so it never takes Play
  Game's tap) and the destroyer in the foot, brought in
  as the game does — dark, a flash, bow on you, its salvo — seen from
  behind the ship. The hero and the foot link to the game's card. They
  play behind the page's words, on canvases that reach the screen's
  edges, so a ship leaving is never cut off.
  Tridi's robot (`lib/robot`, Tridi's own data) only on the Platanus
  card's photo frame, where the tracking points become the G1 (a link to
  Tridi). Each plays ONCE a visit (Juan, 2026-10-29); a reload brings it
  back. None starts while the voice plays or anything is open, but
  one already passing plays on when the voice starts or stops (Juan,
  2026-10-28): only something covering the page ends it. With reduced
  motion they stand still. Their drawing loads on first show.
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

**Tags and GitHub Releases mark real product milestones — NEVER every push** (Juan, 2026-11-13). `package.json`'s `version` is the site's; it went `1.0.0` at the public launch (`v1.0.0`, 2026-10-17) and follows the same disciplined cadence as Sound Shaper (`v1.0.0` → `v1.0.1` → `v1.1.0` → `v1.1.1` → `v1.1.2` → `v1.1.3`).

- **Day-to-day pushes take NO version bump and NO tag.** Push normal fixes, copy tweaks, layout adjustments, and small features directly to `main`; Cloudflare Pages deploys them continuously.
- **Cut a release only at a true milestone or when Juan explicitly asks.**
  - **Minor (`1.2.0`)**: a major new section or product surface on the site (e.g., launching More of Me with the Songs player and 3D easter eggs).
  - **Patch (`1.1.3`)**: a consolidated milestone bundling substantial improvements (e.g., full 9:16 companion video narration + DJ Juan modes) — never a single small fix or link change.
- **When cutting a release:** bump `version` in a `chore(release): vX.Y.Z` commit, tag THAT commit (`git tag -m "vX.Y.Z" vX.Y.Z`), push `main` and the tag together, and create a GitHub Release with concise user-facing notes (`/release-notes`).
- **Format — identical to Sound Shaper (Juan, 2026-11-13):** tag name `vX.Y.Z` (always the `v`); tag message just `vX.Y.Z`, nothing more — the story lives in the Release; Release title exactly `vX.Y.Z` (`gh release create vX.Y.Z --title vX.Y.Z`); body is `•` bullets in visitor language. The site has one channel, so its body carries no channel line.

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
- **Narration is Juan's voice and video, Spanish only** (`lib/narration.ts`,
  Juan 2026-11-11): every narrated paragraph has one audio clip and one `9:16`
  video in `public/media/narration/es/`. There are **no** English or Chinese
  audio/video recordings and no "coming soon" notice: visitors in English or
  Chinese watch and hear the Spanish take while the page's translated text
  (`src/i18n/ui.ts`) reads along sentence by sentence on the Spanish clock, like
  a subtitled film. Existing Spanish recordings stay as recorded (no lip-sync
  ADR re-dubbing).
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
  - `/dev/teleprompter` (`pages/dev/[tool].astro` + `scripts/narration-recorder.mjs`,
    dev only) is strictly for recording full Spanish camera (`9:16`) + audio
    takes (`lib/scripts.ts`) when new sections (apps, events, projects) are
    added. It transcribes each take locally with `whisper-cli` into
    `src/data/narration/{key}.words.json`; afterwards, write the tidied Spanish
    copy and its English and Chinese translations in `src/i18n/ui.ts` keeping
    sentence counts aligned.

## Songs

The Songs card (`SongsPlayer.astro`, Things I Like) is Sound Shaper's player
in miniature: the same Shape graph (`lib/shaper.ts`) and, since v1.11.0
(2026-11-05), the same **Auto DJ**. Its planner — `lib/autoDj/analysis`,
`plan`, `set`, `sections`, `fx` — is COPIED from the app's `src/lib/autoDj/`
with only the DSP import pointed at `./dsp` (and re-sorted for the lint); never edit those five here:
change the app, then copy them again and update the revision in each header.
`lib/autoDj/director.ts` is the site's own, a port of the app's web director
onto the card's one `<audio>`. Nothing is fetched until Auto DJ is switched
on; then it reads every song once (~70 MB the first time) and keeps only each
song's map in `localStorage`.

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

## Brand & UI rules (infer by default — never wait to be told)

The `#F5F5F5` / `#222222` neutrals, the stroke-built "jv" mark, no webfonts.
The favicon (`public/favicon.svg`) and `src/components/AppTile.astro` are
ports of the apps' brand tile — when the palette changes, follow the brand
runbook in the portfolio's `AGENTS.md`, which lists these two files.

- **Every show/hide has an entrance and exit transition.** Never snap an
  element in or out with raw `[hidden]` alone: toggle a state class (e.g.
  `.is-dismissed` / `.is-open`) that transitions `opacity` (and `scale` where
  appropriate) on `--dur-quick` or `--dur-turn` (`var(--ease)`).
- **Every media frame uses the site's `rem` tokens (invariant under browser zoom).** Corner radius is always in `rem` (`--media-radius: 2.5rem` / `--media-radius-flat: 1.25rem` on desktop, `2rem` / `1rem` on mobile `<= 48rem` for screens and cards; `--nar-video-r: 0.75rem` on desktop and `0.625rem` on mobile for the compact `9:16` narration video companion, matching the Songs player's tighter web borders rather than an iOS screen bezel; never `svh`/`vw`, which invert under browser zoom) — paired with `border: 1px solid var(--hairline)`, `background: var(--surface)` and the two-layer shadow (`0 2rem 4rem rgba(0, 0, 0, 0.55), 0 0.5rem 1.25rem rgba(0, 0, 0, 0.4)`).
- **Media hand-overs cross-fade linearly on `--dur-settle`.** Whether switching
  photos in `PanelDeck` or switching `.mp4` clips in `NarrationPlayer`, the
  leaving and arriving layers use `transition: opacity var(--dur-settle) linear`
  (triggered on `requestAnimationFrame` after the frame is decoded) so the two
  always add up to 1 and never flash or glitch.
- **Scroll-driven floating elements never carry a CSS `transform` transition on
  desktop.** `[data-narrator]` and `[data-narr-video]` are positioned every
  frame by `requestAnimationFrame`; a CSS `transform` transition fights the
  render loop and causes lag. Only `html.is-stepped` (touch screens) enables
  `transition: transform var(--dur-turn) var(--ease)`.
- **Narration `9:16` video companion & 6-line `[data-cap]` (Juan, 2026-11-08 / 2026-11-10):**
  - `[data-cap]` shows **6 full lines** (`LINES = 6` in `Base.astro`) with the
    7th fading through the bottom padding, leaving vertical room below the text
    column.
  - Every `.narr-slot` and `.narr-anchor` on desktop keeps a fixed `margin-top: 3rem`
    below the last vertical UI element in its column (never reduced by short-height
    media queries), and `placeVideo` in `director.ts` places `[data-narr-video]` at
    `vy = ny - 1.75 * rem` on desktop (`vy = ny` when parked on the hero on mobile)
    without clamping `vy` upward against `innerHeight`, so the gap between the last
    vertical UI element and the narrator (`3rem`) / video (`1.25rem`) is invariant
    and never overlaps buttons or links above it on smaller windows or laptops. On
    mobile (`<= 48rem`), where the video docks in the bottom-right corner
    (`6rem × 10.67rem`), `dockReserve()` in `Base.astro` reserves `--nar-video-h`
    and `--shot-h` / `--screen-max-m` reserve `22.5rem` so the text and action rows
    stay clear above the video. On desktop in the footer (`SiteFooter.astro`),
    `.lead .narr-caption` sits to the right of the video (`left: calc(7.25rem + 1.75rem)`,
    gliding to `left: calc(var(--narrator-w) + 1.25rem)` when the video is collapsed)
    so the video never covers the footer's live read-along text. It shows ONLY while
    narration audio is actively playing (`running === true`, hiding with `.is-dismissed`
    on pause or stop so no paused frame is ever shown), reveals `×` and `1× / 2× / 3×`
    (`preservesPitch = true`) on hover, keeps raw `.webm` takes untouched in
    `narration-takes/`, and never applies audio filters, EQ, denoiser or volume
    boost to the voice.
