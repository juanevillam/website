---
description: Checkpoint audit of juanevillam.com (this repo) after a chunk of rework — is every repeated thing one component, every value a token, and does the page still say one thing at a time. Report-first.
argument-hint: [section(s) of the landing, or "all", plus anything to exclude]
---

# Web craft audit — one of everything, and restraint

The moment this command exists for: **a chunk of rework just landed on the
site** — a section rebuilt, a deck added, the narrator taught something new —
more is planned, and before continuing you want the ground solid. Not "does it
work": it works, it was built and looked at section by section. The question is
whether the RESULT is coherent: whether the newest section reuses what the
first one established, and whether the page still reads as one calm thing
rather than a set of sections that each solved their own problem.

Two axes, always both, because they fail together:

- **A. Componentization** — one deck, one narrator, one modal, one capture
  pipeline, one duration ladder. The same thing exists once; nothing lives on
  that nothing renders.
- **B. Restraint** — one motif at a time, the house tokens, Juan's taste rules.
  A second motif stacked on the first, a hard-coded duration beside `--beat`, a
  light or a glow nobody asked for — those are this axis.

Scope from the user (sections of the landing, or "all", plus exclusions — ask
if not given): $ARGUMENTS

Three contracts, same as the `portfolio-*` audits:

1. **Scope is explicit and echoed back.** State it before reading code and
   respect the exclusions — a serious finding just outside them goes in its own
   labelled section.
2. **Report before code.** Ranked findings with file:line evidence. Juan cuts
   and approves; he knows which asymmetries are decisions.
3. **Read everything in scope.** No sampling: the value is noticing that two
   files one scroll apart disagree.

**Copy is FLAGGED, never rewritten.** A string that breaks the voice rules is a
finding; the fix is "Juan rewords it", with the rule it breaks. Copy on this
site is drafted as options and Juan picks — an audit that rewrites a line has
written the AI-sounding text it was meant to catch.

## Phase 0 — Ground yourself

1. **Read the web section of [`docs/audit-playbook.md`](../../docs/audit-playbook.md)**
   — its "what every web audit grounds in" list is the site's standing rules,
   and they outrank every checklist below. Then the site memory
   (`juanevillam-site.md`, `juanevillam-taste.md`, `web-app-copy-feedback.md`)
   — newer notes win where they disagree, and they often do; quote the date of
   the one you rely on.
2. **Read the module headers** — `src/scripts/director.ts`, `src/lib/deck.ts`,
   `src/lib/links.ts`, `src/lib/scene.ts`, `src/lib/narration.ts`, the top of
   `src/styles/global.css`. They state the contracts each part keeps, and code
   that breaks its own module's header is the most defensible finding there is.
3. **Baseline green**: `npm run typecheck` and
   `npm run build`. Note uncommitted in-flight work (`git
status`) so your diff and Juan's stay apart.
4. **Get it runnable**: `preview_start {name: "web"}` (dev, `--host`) — one dev
   server at a time. Restart it if scoped CSS looks stale.

## Phase 1 — Inventory

- Every component, lib module and script in scope, **line counts descending**.
  `AppsShowcase.astro`, `PanelDeck.astro`, `director.ts` and `global.css` are
  each over 1,000 lines; that is where repeated blocks hide.
- **Who-imports-what.** For every component and lib export, its importers. A
  plain grep finds mentions in comments; you want imports. This is how a branch
  nothing reaches is found (the director's StoryShowcase / `.m-story` paths are
  the known case — check whether anything still marks up `[data-story]`).
- **Every literal that should be a token**: grep `global.css` and every
  `<style>` block for raw `ms`/`s` durations, `cubic-bezier(`, hex colours,
  `rem`/`px` radii, and compare each against the `:root` ladder.
- **Every motion on the page**, as a list: what moves, what drives it (scroll,
  time, a turn), what duration token it reads. The taste check in B needs it.

## Phase 2 — Audit both axes

Work the appendix. Every finding: file:line, the rule or sibling it disagrees
with, the concrete fix. A finding without evidence or a fix is noise — drop it.

- **Measure, don't eyeball.** A gap, a radius, an inset gets measured in the
  rendered page (screenshot, pixel scan, or `getBoundingClientRect` via
  `javascript_tool`) at 1440×900 and at 390×664, and the numbers quoted.
- **Verify "pre-existing" before saying it.** Check the untouched section.

## Phase 3 — Report (stop for approval)

```
# Web craft audit — <scope> — <date>

## Verdict
One honest paragraph. If it is in good shape, say so plainly.

## A. Componentization
Ranked. Each: file:line, what is duplicated/dead/ignored, the fix, effort.

## B. Restraint
Ranked. Each: file:line, which token, taste rule or motif rule it departs
from, the fix. Add a short "already coherent" note for systems you checked
and found sound (the deck controls, the duration ladder…).

## Copy flagged for Juan
Each: where, the line, which voice rule it breaks. No rewrites.

## Outside the exclusion boundary
Labelled, not acted on.

## Ranked fix order
Batches, each independently verifiable.
```

Present it and wait.

## Phase 4 — Execute approved batches

- Dead code first, then real duplication, then token corrections, then cosmetic
  cleanup.
- **Extract the shared TERM, not a copy.** A second copy of a measured number
  is the defect.
- Behavior stays identical unless the finding IS the behavior; say which ones
  change it in the report.
- After each batch: typecheck, build, and **look** — walk every changed section
  on desktop and phone width, in all three languages. A clean diff is not
  verification.
- Record any new standing rule or measured constant in the site memory or the
  module header, so the next audit inherits it.

---

# Appendix — What to look for

Prompts, not boxes. The site's own rules outrank everything here.

## A. Componentization

1. **A second deck.** Every turning thing goes through `createDeck`
   (`lib/deck.ts`), `DeckControls.astro` and the global `.deck-card`. A section
   that turns its own cards, keys its own arrows or draws its own dots is the
   finding.
2. **A second narrator path.** The voice is ONE session (`director.ts`, loaded
   by `NarrationPlayer`). A section that plays audio itself, or listens for
   scroll to start a clip without `data-narr-panel` / `narr:select` /
   `narr:para`, has forked it.
3. **A second modal.** Shareable addresses open as `data-focused` (global.css,
   `Landing.astro`). A section with its own overlay, scrim or close button
   beside it is drift.
4. **Card data in markup.** Work and Events cards live in `lib/work.ts` /
   `lib/events.ts`, apps in `lib/apps.ts`, store state in `lib/releases.ts`. A
   name, date or picture written into a component is a second source.
5. **Strings outside `src/i18n/ui.ts`** (and `lib/scripts.ts` for the
   narration scripts). Grep components for visible text nodes.
6. **Dead branches and archive drift.** Code serving only `archive/`
   content (Topper, Booker) or a removed section, kept alive in a live file.
   The archive is the place for it; a live file carrying its branch is fine
   ONLY where the header says putting an entry back republishes it (the legal
   templates do).
7. **Comments describing what no longer exists** — the halo, the ambient light,
   the glitch, StoryShowcase, a 16:9 or 16:10 frame. Stale comments mislead
   the next session; they are findings.
8. **Scripts that duplicate a lib** — two scroll observers measuring the same
   section, two `matchMedia('(max-width: 48rem)')` with their own reload logic.

## B. Restraint

1. **One motif at a time.** List every motion (Phase 1). Two treatments doing
   the same job — two entrance styles, a glow AND a scene light on one picture,
   a second animated layer under a turning deck — are the finding. A new motif
   replaces the old; it never stacks.
2. **The duration ladder.** Every duration reads `--beat` through a
   `--dur-*` token, in CSS and in scripts (scripts read the computed value).
   A literal `300ms` or `setTimeout(…, 450)` is a finding.
3. **Colour tokens.** `--ground`, `--ink`, `--ink-body`, `--surface`,
   `--hairline`; never `#fff` / `#000`, never a hue the brand does not have.
   The site is dark-only — a `prefers-color-scheme: light` branch is dead code.
4. **Geometry tokens.** `--media-radius` / `--media-radius-flat`, `--stage-top`,
   `--gap-block`, `--content-max`, `--float-*`. Grep for each token's VALUE as a
   literal, not just its name.
5. **Rejected ideas returning.** Check `juanevillam-taste.md`'s rejected list
   (drawn lines and grids, starfields, glitch, halo, ambient light, mirrored
   layouts, gyroscope, nested sliders, muted neighbours). A rejected idea back
   under a new name is a finding, with the date it was rejected.
6. **Pictures that blur, text that takes the beat.** Deck parts: text moves at
   `--dur-micro`, only pictures take the beat, pictures never blur.
7. **Fixed-position traps.** No `[data-reveal]`, transform or `will-change` on
   an ancestor of a fixed or `[data-dock]` element.
8. **Copy (flag only).** First person, plain, short; none of the banned words
   in the playbook's list; no claim about an app the shipped app code does not
   back; nothing that needs the audio to make sense.
