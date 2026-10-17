---
description: Accessibility audit of juanevillam.com (this repo) — keyboard and focus through decks, modals and the arcade, screen-reader names, language, reduced motion, subtitles as captions, contrast, zoom and touch targets. Measured. Report-first.
argument-hint: [section(s), or "all", plus anything to exclude]
---

# Web accessibility audit — the page works for everyone who opens the link

The moment this command exists for: **the layouts have settled** (after
`/web-parity-audit`) and before a release, so the audit reads a page that is
not about to move. The site is a cinematic one-pager — snapped sections, decks
that turn, a voice that plays, frosted modals, a game — which is precisely the
kind of page that works beautifully with a trackpad and not at all with a
keyboard, a screen reader or a raised text size, unless someone checks.

Juan wears glasses; text size and contrast are not hypothetical here.

**Accessible is not a different look.** Most fixes are invisible (a name, a
focus order, a role). Where a fix would change what the page LOOKS like — a
focus ring, a larger target, a contrast bump — it is reported with the numbers
and the smallest change that passes, and Juan decides. Never ship a visible
change this audit thought of on its own.

Scope from the user (sections, or "all", plus exclusions — ask if not given):
$ARGUMENTS

Three contracts:

1. **Scope is explicit and echoed back**, exclusions respected.
2. **Report before code**, ranked by who is locked out and how badly, with
   file:line and the WCAG 2.2 criterion each finding fails.
3. **Every section in scope, every interactive thing in it.** No sampling.

## Phase 0 — Ground yourself

1. **Read the web section of [`docs/audit-playbook.md`](../../docs/audit-playbook.md)**
   and the site memory. Several behaviours are deliberate (the touch-only
   swipe, `touch-action: manipulation`, the reload at 48rem, the arcade being
   landscape-only on phones) — the audit asks whether each has an accessible
   equivalent, not whether it should exist.
2. **Production build**: `preview_start {name: "web-prod"}`.
3. **Tools**: the browser pane's `read_page` (accessibility tree), keyboard
   driven through `computer` `key` actions, `javascript_tool` for
   `document.activeElement` and computed styles. If axe is wanted, load
   `axe-core` from a pinned CDN version into the page via `javascript_tool` —
   never add it to the site. On a real iPhone, VoiceOver is the check for the
   phone layout; on the Mac, VoiceOver (⌘F5) with Safari for desktop.

## Phase 1 — Walk and measure

### Keyboard (desktop layout)

From a cold load, Tab only, in each language once:

- every interactive thing is reachable, in reading order, and visibly focused
  (`:focus-visible` — measure the ring's contrast against what is behind it);
- each deck turns by keyboard (arrows when focused, the controls by Tab/Enter),
  and focus does not land on hidden neighbour cards (`inert` or `tabindex=-1`
  on cards that are not current);
- a shareable address (`FOCUS_PAGES`, `src/lib/links.ts`) opened cold: focus
  starts inside the modal, cannot Tab out under it, Escape closes it
  (`Landing.astro`), and focus lands somewhere sensible after;
- the arcade cabinet: opening moves focus into it, Escape closes it
  (`ArcadeCabinet.astro`) and returns focus to Play; the Konami code is an
  easter egg, never the only way in;
- the narrator: play/pause by keyboard, and the voice never starts unasked;
- the language switch is reachable and announces the current language.

### Screen reader

- Every control has a name in all three languages (`aria-label` from
  `src/i18n/ui.ts`, never hard-coded English). Glyph-only buttons — arrows,
  dots, ✕, play — are the usual misses.
- Decorative media is `alt=""` + `aria-hidden`; meaningful media (a capture
  that shows the feature being described) has a real `alt` in the reader's
  language.
- Decks expose position ("2 of 5") and the current card; dots say which card
  they go to.
- Landmarks and headings: one `h1`, sections in order, `main`, `header`,
  `footer` — read the outline with `read_page`.
- `html lang` follows `data-lang` on every switch, and Chinese text is not read
  with an English voice.

### Motion and time

- `prefers-reduced-motion: reduce` (emulate it): the scroll-coupled walk, the
  turns, the scene light and any autoplaying video stop or become instant. The
  director already reads it — check every other script and every CSS
  animation does too.
- Nothing auto-advances without a pause control (WCAG 2.2.2); cycling event
  photos count.
- Autoplaying video is muted; the voice plays only after a gesture.

### Captions and audio

- Narration subtitles (`public/media/narration/es/*.vtt`, `.en.vtt`, `.zh.vtt`)
  are shown on screen for every clip, in the reader's language, and are
  readable: contrast against the page, size at the phone design height, and
  characters per second per cue (above ~17 cps in en/es is hard to read).
- `npm run narration` reports no clip missing a subtitle.
- Event videos with speech carry captions or say nothing that matters.

### Visual

- **Contrast**, measured on the rendered page (not the token values): body
  text, muted text (`--ink-body`), text over frosted surfaces and over photos,
  the store "Coming soon" lockup, hairline-only controls (non-text contrast
  3:1, WCAG 1.4.11).
- **Zoom**: 200% browser zoom and the OS text size raised — the html font size
  is a `clamp()`; check nothing is clipped, overlaps or needs horizontal
  scroll at 320 CSS px wide (WCAG 1.4.10).
- **Touch targets** on the phone layout: at least 24×24 CSS px (WCAG 2.5.8),
  44×44 as the house aim; measure each control's hit box, not its glyph.
- The swipe-to-turn on touch has a tap equivalent (arrows or dots).

## Phase 2 — Report (stop for approval)

```
# Web accessibility audit — <scope> — <date>

## Verdict
One honest paragraph: who can and cannot use the page today.

## Findings
Ranked by impact (locked out → hard → annoying). Each: section, file:line,
WCAG criterion, what happens, the fix, VISIBLE or INVISIBLE change.

## Already accessible
Systems checked and sound, so the next audit does not re-derive them.

## Ranked fix order
Invisible fixes first.
```

Present it and wait.

## Phase 3 — Execute approved batches

- Invisible fixes first (names, roles, focus management, `inert`, `lang`),
  then reduced motion, then visible ones Juan approved.
- Every new label goes into `src/i18n/ui.ts` in all three languages, and its
  wording is flagged for Juan if it shows anywhere.
- After each batch: repeat the same keyboard walk and the same screen-reader
  pass, and re-measure what changed.
