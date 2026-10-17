---
description: The quick gate before every deploy of juanevillam.com (this repo) — clean build, nothing dev-only shipped, every address and link resolves, legal pages the stores rely on, narration and arcade in sync, Cloudflare limits. Report-first; never deploys.
argument-hint: [what changed since the last deploy, if known]
---

# Web release audit — the gate before every deploy

The moment this command exists for: **a deploy is next.** Unlike the
`portfolio-quality-audit`, which runs once per release of an app, this one is
SHORT and runs EVERY time — the site is meant to ship as it is and improve
over time, so it ships often, and the gate has to be cheap enough that nobody
skips it. Deep questions belong to the other web audits; this one asks only
"is what is about to go out whole, and is nothing in it that should not be".

It runs **last**, after whatever audits the change called for, because it
checks the built output those audits leave behind.

**It never deploys and never pushes.** Juan pushes; the report ends with GO or
NO-GO and the reasons.

Scope from the user (what changed since the last deploy — or work it out from
`git log`): $ARGUMENTS

## Phase 0 — What is going out

1. **What changed**: `git log --oneline <last deploy>..HEAD -- this repo` — the
   last deploy is the commit Cloudflare Pages last built (the Pages dashboard,
   or ask Juan). Uncommitted work in this repo is NOT going out; say so if
   there is any.
2. **Which other web audits the change called for**, from the playbook's
   table: a new section → craft, perf, parity; new media → perf; a new or
   renamed address → share. If one was due and has not run, the verdict says
   so (it is a warning, not a NO-GO, unless Juan says otherwise).

## Phase 1 — The checks

Run them all; each is fast.

1. **Typecheck and a clean build.**
   ```bash
   npm run typecheck
   rm -rf dist && npm run build
   ```
   Zero errors; warnings listed.
2. **Nothing dev-only in `dist`.** No `dev/` pages (the teleprompter), no
   `narration-takes/`, no source maps unless intended, no `.DS_Store`, nothing
   from `archive/`. The narration recorder plugin is `apply: 'serve'` — confirm
   no request handler for it exists in the build.
   ```bash
   find dist -name '*.map' -o -name '.DS_Store' -o -path '*dev*' | head
   ```
3. **Cloudflare Pages limits**: no file over 25 MiB, fewer than 20,000 files.
   ```bash
   find dist -type f -size +24M; find dist -type f | wc -l
   ```
4. **Every address resolves.** Every `FOCUS_PAGES` path (`src/lib/links.ts`)
   and every legal page has an `index.html` in `dist`; the 404 page exists and
   is `noindex`.
5. **Every internal reference resolves.** Every `src`, `href`, `poster` and
   `og:image` in the built HTML that points at the site exists in `dist`:
   ```bash
   grep -rhoE '(src|href|poster|content)="/[^"#?]+' dist --include='*.html' \
     | sed -E 's/^[a-z]+="//' | sort -u \
     | while read p; do [ -e "dist$p" ] || [ -e "dist$p/index.html" ] || echo "MISSING $p"; done
   ```
   External links (LinkedIn, Instagram, store listings) — check they return
   200 with `curl -sIL`, but report a failure as a warning: a network blocking
   bots is not a broken link.
6. **What the apps link to.** The apps build `juanevillam.com/{slug}/{page}`
   (`legalUrl` in `sound-shaper/src/ui/author.ts`); every page an app that is
   SHIPPED or IN REVIEW links to must exist: today that is Sound Shaper's
   privacy policy, terms, support and delete-account. A missing one is NO-GO —
   the App Store listing points at it.
7. **Store state.** `src/lib/releases.ts` matches reality: `null` (Coming soon)
   for anything not live, a URL only for a listing that is live. Ask Juan if
   unsure; never flip one on a guess.
8. **Narration in sync.** `npm run narration` reports no clip
   missing audio or subtitles in any language, and no orphan script.
9. **Arcade in sync.** `public/arcade/game.js` is the current build of the
   game in `games/` (`npm run arcade`, then `git status
public/arcade` — any diff means the committed copy was stale).
10. **Legal dates.** If a legal page's text changed, `LEGAL_UPDATED` in
    `src/lib/legal.ts` moved with it.
11. **A look at the production build.** `preview_start {name: "web-prod"}`,
    cold load of `/` and of one shareable address, at desktop and phone width:
    no console errors (`read_console_messages`), no failed requests
    (`read_network_requests`), the hero renders, the voice plays on tap, one
    deck turns, the modal closes.

## Phase 2 — Report

```
# Web release audit — <date> — <HEAD short sha>

## GO / NO-GO
One line, then the reasons.

## Checks
1–11, each PASS / WARN / FAIL with the evidence (a count, a path, a line).

## Audits due but not run
## Going out
The commits since the last deploy, one line each.
```

A FAIL on 1, 2, 4, 5 or 6 is NO-GO. Everything else is Juan's call.

Fixes are not this command's job: a FAIL is reported with its cause, and the
fix happens as its own change — approved, committed, then this gate runs again.
The one exception is a stale generated copy (step 9) — regenerating it is the
fix, and it is still shown to Juan before it is committed.

After a deploy, if Juan asks: the same steps 4–5 against
`https://juanevillam.com` instead of `dist`.
