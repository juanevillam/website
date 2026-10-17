---
description: Audit juanevillam.com (this repo) across its two layouts and three languages — the phone page and the desktop page tell the same story, each in its own shape, and en/es/zh all hold the layout. Measured. Report-first.
argument-hint: [section(s), or "all"; and which layout or language changed]
---

# Web parity audit — one story, two layouts, three languages

The moment this command exists for: **a section changed on one layout** — the
desktop stage was reworked and the phone panels were not, or a new card was
added and only looked at in English. The site is built twice: above 48rem a
pinned stage the director walks; at or below it, plain snapped panels, chosen
once per load (crossing the line reloads the page). Two builds of one page drift
the same way two platform twins of one app do, and nothing in the toolchain
notices.

**This is the site's native-parity audit, and the same principle holds: parity
of quality, never of pixels.** The phone is not a shrunken desktop and the
desktop is not a stretched phone. The phone centres everything (but the footer
rows and the copyright), uses `--media-glow` instead of the scene light, and is
designed at 390×664 svh. Each layout should be the best version of itself;
what must match is the STORY — the same sections, the same cards, the same
words, the same narration, the same ways in and out.

**The third axis is language.** Every layout has to hold in English, Spanish
and Chinese: Spanish runs ~20–30% longer than English and breaks lines in
different places; Chinese is shorter, has no spaces to wrap on, and takes
full-width punctuation. Narration is Spanish for everyone, subtitled in English
and Chinese on the Spanish timings — so subtitle length matters as well.

Scope from the user (sections, and which layout or language changed — ask if
not given): $ARGUMENTS

**THIS AUDIT RUNS ON NUMBERS.** The deliverable of Phase 1 is a table of
measurements across both layouts and all three languages, with disagreements
ranked, produced before Juan is asked anything. If the report says "consider
whether" or "may feel", it is the wrong report.

Three contracts:

1. **Scope is explicit and echoed back**, exclusions respected.
2. **Report before code.** A difference in what the site DOES on one layout
   (a card the phone lacks, a control only desktop has) is reported, never
   "fixed" — what the page does is Juan's call.
3. **Every section in scope, at every layout and language.** No sampling.

## Phase 0 — Ground yourself

1. **Read the web section of [`docs/audit-playbook.md`](../../docs/audit-playbook.md)**
   and the site memory's layout notes — phone design height, centring rule,
   which things are desktop-only on purpose (the scene light, the pinned stage,
   the continuous scrub) and which are phone-only (stepped transitions,
   `--media-glow`, the arcade's touch layer).
2. **Production build**: `preview_start {name: "web-prod"}` (:4322).
3. **The measuring sizes**, fixed for every audit so results diff:
   desktop **1440×900**, laptop **1280×800**, phone **390×664** (the design
   height — browser bars shown) and **390×844** (bars collapsed), plus one
   narrow phone at **375×667**. `resize_window` in the browser pane, or CDP
   with a device-scale factor of 3 for phones. A real iPhone confirms the phone
   rows that matter.
4. **Language** is switched with `?lang=es` / `?lang=zh` (one visit, not saved)
   — check `html[data-lang]` changed before measuring.

## Phase 1 — Inventory and measure

### A0 — What exists on each side

For every section and every card: is it present on desktop, on phone, or both?
For every control (deck arrows, dots, keys, swipe, the ✕ on a focused address,
the narrator's play/pause, the language switch, the store tags, the arcade's
Play): which layouts carry it, and how it is reached. A one-sided row is either
a documented decision (cite it) or a finding.

### A1 — Each layout against its own rules

Measured, per section, per layout:

- the stage's top and bottom against `--stage-top` / `--stage-bottom`;
- media box size and radius against `--media-radius` (`-flat` for flat
  pictures) — a 3:2 frame on every PanelDeck screen;
- the gap between media and copy against `--gap-block` / `--media-gap-m`;
- centring on phone (horizontal centre of every block within ±0.5 CSS px of
  the viewport centre, except the footer rows and copyright);
- nothing clipped, nothing overflowing horizontally
  (`document.documentElement.scrollWidth === innerWidth`), nothing under the
  header or the narrator.

### A2 — Each language against the layout

The same measurements, repeated in es and zh. Look for: a line that wraps to
one more row than in English and pushes the block (measure each block's height
in all three; quote the delta), a title that overflows its card, a Chinese
line broken mid-word or carrying ASCII punctuation, a button label that no
longer fits its pill, a subtitle cue too long to read in its time on screen
(characters per second against the cue's duration).

### A3 — Ways in and out

On both layouts, in one language: every shareable address (`FOCUS_PAGES` in
`src/lib/links.ts`) opens its modal over the landing, its ✕ returns to `/` at
the top, Escape closes it on desktop; a lone PanelDeck card is locked and its
voice stops at its clip; the narration session follows the page on both
layouts; crossing 48rem reloads (except with the arcade open).

## Phase 2 — Report (stop for approval)

```
# Web parity audit — <scope> — <date>

## Verdict
Parity is done here and this is the evidence — or this is exactly what is left.

## A0. One-sided things
Table: thing | desktop | phone | documented? | finding.

## Measurements
Table per section: metric | desktop | phone | en | es | zh | expected | Δ.
Rows that disagree ranked first.

## Behaviour differences (Juan's call)
Listed, not fixed.

## Ranked fix order
```

Present it and wait.

## Phase 3 — Execute approved batches

- Layout fixes go into the token or the shared component, never a per-language
  or per-width patch on one section — a `:lang(es)` override is the defect
  moved, not fixed, unless the language genuinely needs it (Chinese
  `line-break`, for one).
- **A string that does not fit is flagged for Juan**, not shortened by the
  audit; copy is his.
- After each batch: re-measure the same rows at the same sizes in all three
  languages, and quote before/after.
