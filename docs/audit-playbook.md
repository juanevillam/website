# Audit playbook — the web set

This repo (Astro, static, Cloudflare Pages) has its own six `web-*` audits in
`.claude/commands/`, written 2026-10-17. Juan's call for the site is to **ship
it as it is and improve it over time**, so these are built for a loop rather
than for one milestone: one short gate runs before every deploy, and the other
five run when the change in hand calls for them.

| command              | the moment                                         | scope                          |
| -------------------- | -------------------------------------------------- | ------------------------------ |
| `/web-craft-audit`   | a chunk of rework landed on a section              | section(s) or the whole page   |
| `/web-perf-audit`    | rework landed, new media, or "it feels heavy"      | section(s), on the real iPhone |
| `/web-parity-audit`  | a section changed on one layout or in one language | phone ⇄ desktop × en/es/zh     |
| `/web-a11y-audit`    | layouts have settled, before a release             | section(s)                     |
| `/web-share-audit`   | an address was added/changed, or a post is next    | every shareable address        |
| `/web-release-audit` | before EVERY deploy, last                          | what is about to go out        |

They are the mobile set's siblings, translated: craft is craft; perf is the
data and cache audits' question (what does it cost while it works) asked of a
page; parity is native parity with the phone and desktop layouts as the two
platforms and the three languages as a third axis; release is the quality
audit cut down to a gate that is cheap enough to run every time. A11y and
share have no mobile twin — the mobile apps inherit most of both from the OS;
a hand-built web page inherits neither.

## The order, and why

**At a milestone** (a section rebuilt, a new deck, the narrator taught
something):

```
/web-craft-audit  <section>     # 1  structure first — it moves code the others cite
/web-perf-audit   <section>     # 2  measure the settled structure, on the iPhone
/web-parity-audit <section>     # 3  both layouts, three languages, after perf moved things
/web-a11y-audit   <section>     # 4  on layouts that are not about to move
/web-share-audit                # 5  only if an address or its picture changed
/web-release-audit              # 6  last, on the built output; GO / NO-GO
```

- **Craft before perf**, for the reason craft leads the mobile set: it moves
  code, which invalidates line-level findings, and a componentized deck is one
  place to make cheap instead of three.
- **Perf before parity**: perf fixes change media boxes and layers, and parity
  measures boxes.
- **Parity before a11y**: accessibility is judged on the layout people will
  actually get; checking focus order on a layout parity is about to change
  wastes the pass.
- **Share is independent** of the others and can run any time an address
  changes — before Juan posts a link above all.
- **Release is always last** and always runs.

**Per deploy, with nothing else due:** `/web-release-audit` alone.

**The first deploy (ship as it is, 2026-10):** `/web-release-audit`, then
`/web-share-audit` — the site goes out whole, and the links Juan posts draw a
good card. Craft, perf, parity and a11y then become the improvement loop, one
section at a time, in the order above.

## What every web audit grounds in

The site's standing rules, collected so six commands do not carry six copies.
Newer site memory wins over this list; update it here when one changes.

- **Dark-only.** No light theme, no `prefers-color-scheme: light` branch;
  checks in light mode have nothing to check.
- **One of everything.** One deck (`lib/deck.ts` + `DeckControls.astro` +
  `.deck-card`), one narration session (`scripts/director.ts`, loaded by
  `NarrationPlayer`), one modal (`data-focused`, `Landing.astro`), one address
  list (`lib/links.ts`), card data in `lib/work.ts` / `lib/events.ts` /
  `lib/apps.ts`, store state in `lib/releases.ts`, strings in `i18n/ui.ts`.
- **Tokens on `:root` in `global.css`**, durations on the `--beat` ladder
  (600 ms; `--dur-*`), in CSS and scripts alike.
- **Restraint.** One motif at a time — a new one replaces the old, never
  stacks. The rejected list in the taste memory is real; a rejected idea under
  a new name is a finding.
- **Two layouts.** ≤48rem is a different page (snapped panels, stepped touch
  transitions, `--media-glow`, centred), designed at **390×664**; crossing
  the line reloads. Desktop is the pinned stage the director walks.
- **Three languages, one voice.** en/es/zh as `html[data-lang]`, never in the
  URL (`?lang=` for one visit). Narration is Spanish only, subtitled in
  English and Chinese on the Spanish timings. **Narration takes are never
  processed** beyond an AAC rewrap — their weight is reported, never "fixed".
- **The Mac lies about performance.** Responsive mode and the browser pane
  draw with the Mac's GPU. Compositing findings are confirmed on the real
  iPhone (`web-prod` over `--host`) or marked unconfirmed. Measure the
  production build, not dev.
- **Copy is Juan's.** First person, plain, short — a Spanish speaker writing
  English. Banned: elevate, seamless, passionate about, dive into, craft
  experiences, "not just X but Y", rule-of-three lists, hype adjectives,
  anything that needs the audio or context to make sense. Every claim about an
  app must match the shipped app code. **Audits FLAG copy; they never
  rewrite it** — copy here is drafted as options and Juan picks.
- **Measured, not eyeballed.** Every geometry claim quotes a number from the
  rendered page; every fix quotes before and after.
- **Report-first, never deploy.** Juan pushes. No audit posts a link,
  publishes a preview, or sends anything anywhere.
