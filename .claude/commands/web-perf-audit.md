---
description: Audit what juanevillam.com (this repo) costs a real iPhone — scroll and compositing, picture, video and audio weight, JavaScript, first paint. Measured on the production build and on the device. Report-first.
argument-hint: [section(s), or "all", plus anything to exclude]
---

# Web performance audit — what the page costs the phone in your hand

The moment this command exists for: **the page works and looks right, and the
question has moved to what it costs while it does** — a section was just
rebuilt, a video or a deck of photos was just added, or the page "feels heavy"
on the phone and nobody can say why. The site is a full-screen snapped one-pager
with a narrator, decks, frosted surfaces and a scene light: every one of those
is cheap on the Mac and can be expensive on an iPhone, and the Mac will not
tell you which.

**THE MAC LIES.** Chrome's responsive mode and the browser pane draw with the
Mac's GPU, so a filter re-rasterised every scroll frame, a blurred backdrop
under a moving layer, or a stack of promoted layers all look smooth there. This
was learned on this site: lag Juan felt on his iPhone did not exist in
responsive mode at all. **A performance finding is not confirmed until it is
measured on the real iPhone, and a fix is not verified until the iPhone says
so.** CDP throttling on the Mac is for ranking and for numbers; it is not a
verdict.

**Smoothness beats savings.** Where a cheaper page and a calmer page disagree,
the calmer page wins, and this audit never trades a look Juan approved for a
lighter one — that goes to him as a choice, with the numbers.

Scope from the user (sections, or "all", plus exclusions — ask if not given):
$ARGUMENTS

Three contracts, same as the other audits:

1. **Scope is explicit and echoed back**, exclusions respected.
2. **Report before code.** Ranked findings with numbers and file:line. Mark
   every fix that changes how something LOOKS — those are Juan's call.
3. **Measure everything in scope.** This audit does not estimate.

## Phase 0 — Ground yourself

1. **Read the web section of [`docs/audit-playbook.md`](../../docs/audit-playbook.md)**
   and the site memory's performance lessons. Several plausible fixes were
   already tried and measured; several costs are already paid deliberately
   (the always-promoted deck parts that stop a 0.5px re-snap, the stepped mode
   on touch, the desktop-Safari class in `Base.astro`). Know them before you
   propose undoing them.
2. **Measure the PRODUCTION build, never dev.** Dev mode ships unbundled
   modules and HMR; its cost is not the site's. `preview_start {name:
"web-prod"}` builds and serves `dist` on :4322 with `--host`.
3. **Get the iPhone on it.** Same Wi-Fi, `http://<mac-ip>:4322`. Note that
   motion sensors need HTTPS on iOS, so over the LAN the phone layer shows its
   buttons only — that is expected, not a finding. If no iPhone is reachable
   this session, say so up front: the report will carry "UNCONFIRMED ON
   DEVICE" on every compositing finding.
4. **Baseline numbers before any change**, so every fix can quote before/after.

## Phase 1 — Measure

### Weight

```bash
npm run build
du -sh dist dist/_astro dist/media/*
find dist -type f \( -name '*.jpg' -o -name '*.png' -o -name '*.webp' -o -name '*.avif' \) -size +300k -exec ls -lh {} \;
find dist -type f \( -name '*.mp4' -o -name '*.m4a' -o -name '*.mov' \) -exec ls -lh {} \;
ls -l dist/_astro/*.js dist/_astro/*.css
```

Then, per page (`/`, one `/work/*`, one `/events/*`, `/sound-shaper`, one legal
page): **what the first load actually fetches** — the browser pane's
`read_network_requests` after a cold, cache-busted load, with no scroll.
Separate three budgets:

- **first paint** — HTML, CSS, the JS that runs on load, the hero's media;
- **on scroll** — what each section pulls as it nears (`loading="lazy"`,
  `preload="none"` flipped to `auto`, pre-warmed screenshots);
- **on demand** — the arcade (Phaser is ~1.2 MB and must load only on Play),
  the narration clips (one per paragraph), event videos.

A byte in the wrong budget is the finding, more than the byte itself.

### Pictures

For each picture: intrinsic size against its rendered size at 1440×900 and at
390×664 @3x. A capture drawn at 625×417 CSS px needs ~1250 px wide at 2x, not 2880. Format (JPEG at quality ~82 is the house recipe; check whether AVIF/WebP
with a JPEG fallback would be a real saving on the big ones), `decoding`,
`loading`, and whether `width`/`height` or `aspect-ratio` reserve its box.

### Video and audio

Bitrate and resolution against the box they play in (the ILC event video went
19 MB → 1.9 MB with no visible loss — that is the scale of what is possible).
Posters present. Autoplaying video muted, `playsinline`, paused when off screen.
**Narration audio is never re-encoded beyond the existing AAC rewrap** — its
weight is reported, never "fixed" (see the playbook).

### Scroll and compositing — the part only the iPhone can answer

- **Inventory every expensive property on the page**: `backdrop-filter`,
  `filter`, `mix-blend-mode`, `box-shadow` on large or moving things,
  `will-change`, fixed layers, `position: sticky`. For each: what moves under
  or with it while the page scrolls.
- **CDP trace on the Mac to rank them**: headless Chrome, 390×844 @3x, CPU 6×
  slowdown, a scripted scroll through the whole page; record frame times and
  the paint/raster share per section. Write the harness to the scratchpad, not
  the repo.
- **Then the iPhone**: Safari Web Inspector on the Mac attached to the phone
  (Develop → the iPhone → the page), Timelines → Rendering Frames and Layers,
  while Juan or you scroll through each section. Quote frame times per section
  and layer count/memory. Without Web Inspector, a screen recording on the
  iPhone at 60 fps, stepped frame by frame, is the fallback.
- **Touch-specific**: the stepped mode (`html.is-stepped`) must be what runs on
  the phone; a scroll-coupled value that still scrubs per pixel on touch is a
  finding regardless of its frame time, because iOS delivers scroll late.

### JavaScript

Each script that runs on load: size, and what it does on the main thread before
first paint and on every scroll event (`getBoundingClientRect` or
`getComputedStyle` in a scroll handler forces layout — the scene light's
`showing()` and `photosOf()` are the obvious places to look). Listeners that
outlive their section, observers never disconnected, rAF loops that run while
nothing is moving.

## Phase 2 — Report (stop for approval)

```
# Web performance audit — <scope> — <date>

## Verdict
One honest paragraph, with the headline numbers: first-load bytes, total
page bytes, worst section's iPhone frame time.

## Findings
Ranked by what a person on an iPhone feels, not by bytes. Each:
section, file:line, the number (before), the fix, the expected number,
CONFIRMED ON DEVICE / UNCONFIRMED, and whether it changes the look.

## Already paid for, on purpose
Costs you found that the site carries deliberately, with the reason —
so the next audit does not re-propose removing them.

## Ranked fix order
Batches, each independently verifiable.
```

Present it and wait.

## Phase 3 — Execute approved batches

- Weight in the wrong budget first (things loaded at first paint that belong on
  demand), then picture and video re-encodes, then compositing, then JS.
- **Re-encoded media keeps its source.** Write the new file beside the old,
  compare them side by side at the size they render, then replace. Never
  re-encode narration takes.
- After each batch: build, then the same measurement as before on the
  production build — and the iPhone for anything compositing. Quote before and
  after in the commit message.
- Record measured costs and the harness recipe in the site memory, so the next
  audit diffs instead of restarting.
