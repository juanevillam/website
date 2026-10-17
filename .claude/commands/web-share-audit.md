---
description: Audit how juanevillam.com (this repo) looks when someone shares it — the preview card every shareable address draws on LinkedIn, Instagram, WhatsApp and X, and how search engines read the site. Report-first.
argument-hint: [addresses to check, or "all"]
---

# Web share audit — the link is the first screen

The moment this command exists for: **a shareable address was added or changed,
or Juan is about to post a link.** The site's addresses exist so a post
elsewhere can stop halfway and send people here (`src/lib/links.ts`), which
makes the PREVIEW CARD the first thing most visitors ever see — before the
hero, before the voice. A missing picture, a cropped face, an English title on
a Spanish post or a description cut mid-word is the site making its first
impression badly, and nothing on the site itself shows it.

The second half is search: how a crawler, which runs no script, reads a site
whose language is a client-side preference and whose sections open as modals.

Scope from the user (addresses, or "all" — default all): $ARGUMENTS

Three contracts:

1. **Scope is explicit and echoed back.**
2. **Report before code.** Ranked by how many people will see the defect
   (the home page and the address Juan is about to post first).
3. **Every address in scope, read from the BUILT HTML.** The source is what
   should be there; `dist` is what a crawler gets.

**Copy in a preview is copy.** A title or description that reads badly is
flagged for Juan; the audit does not reword it. Descriptions are derived from
card copy (`summary()` in `links.ts`), so the fix may be the card's `.m`
string — still his.

## Phase 0 — Ground yourself

1. **Read `src/lib/links.ts` and `src/layouts/Base.astro`** — the address list
   (`FOCUS_PAGES`), how title/description/picture are derived, and the head
   that renders them. Also the legal pages (`src/pages/[app]/*`) and
   `404.astro`: they are addresses too, and the stores link to the legal ones.
2. **Build**: `npm run build`.
3. **Know each network's rules** (re-check them when a card looks wrong —
   these change): Open Graph `og:title`, `og:description`, `og:image`
   (absolute https URL), `og:url`, `og:type`; `twitter:card`
   `summary_large_image`. The safe picture is **1200×630** (1.91:1), JPEG or
   PNG, under ~5 MB (WhatsApp is stricter — under ~300 KB shows reliably).
   LinkedIn crops to 1.91:1; WhatsApp and iMessage may show a square crop —
   keep the subject in the centre square.

## Phase 1 — Inventory and check

### Every address

```bash
cd dist && find . -name 'index.html' -o -name '*.html' | sort
```

For each page, extract the head (`grep -o '<meta[^>]*>' …`, `<title>`,
`<link rel="canonical">`) into one table: path | title | description (length) |
og:image | twitter:card | canonical | robots. Then check:

- **Every `FOCUS_PAGES` entry has a page**, and every page under `work/`,
  `events/`, `[app]/` is in `FOCUS_PAGES` or the legal set — no orphan, no
  missing.
- **Titles**: unique per page, the thing's name first; length under ~60.
- **Descriptions**: unique, a whole sentence, under ~160 for search and ~200
  for cards (`summary()` cuts at 197 + `…` — check none ends on a cut word in
  a way that reads badly).
- **Pictures**: present on every shareable address; the URL resolves in `dist`
  (and on the live site, for the deployed check); actual pixel size and aspect
  (`sips -g pixelWidth -g pixelHeight`); file size; subject inside the centre
  square. A 3:2 capture is not 1.91:1 — report how each network will crop it,
  and whether a purpose-made 1200×630 card would be better (Juan's call).
- **`og:url` and canonical** absolute, https, on `juanevillam.com`, with no
  `?lang` and no trailing-slash mismatch against how Cloudflare Pages serves
  the path (check `/work/salvalo` vs `/work/salvalo/` — a redirect breaks some
  crawlers' previews).
- **Language**: previews are English by design (a crawler runs no script).
  Report what that means for a Spanish post with `?lang=es`; whether
  `og:locale` / `og:locale:alternate` is worth adding is a suggestion, not a
  defect.

### Search

- `robots.txt` and a sitemap: today there are neither. Report whether to add
  them (Astro's sitemap integration, or a static file listing the addresses),
  never add them unasked.
- `noindex` on the 404 and on `/dev/*`; and `/dev/*` must not be in `dist` at
  all — check.
- Structured data: a `Person` JSON-LD on `/` (name, url, sameAs LinkedIn and
  Instagram — never GitHub, per the footer rule) is the one that matters for a
  personal site; report if absent.
- The text a crawler sees on `/`: the server-rendered language is English —
  confirm the hero, section titles and card copy are in the HTML, not only
  injected by script.

### Real previews

A table of tags proves the tags, not the card. Render the real thing where it
can be done without posting anything:

- LinkedIn Post Inspector (`linkedin.com/post-inspector`) — only for the
  DEPLOYED site, and only with Juan's go-ahead (it fetches and caches the URL);
- a local preview: draw each card from its own tags at each network's crop
  (a scratchpad script with PIL is enough) so Juan can see all of them on one
  sheet.

Never post, never send a link to anyone, never "test" in a real chat.

## Phase 2 — Report (stop for approval)

```
# Web share audit — <scope> — <date>

## Verdict

## Address table
path | title | description | picture (size, aspect, KB) | issues

## Findings
Ranked. Each: address, what a viewer sees, the fix, effort.

## Copy flagged for Juan
## Suggestions (sitemap, robots, JSON-LD, og:locale…)
## Preview sheet
Path to the rendered sheet, if made.
```

Present it and wait.

## Phase 3 — Execute approved batches

- Tag and head fixes go in `Base.astro` / `links.ts` once, never per page.
- New preview pictures are generated from the site's own media into
  `public/media/…` and committed; the generator, if any, is a script in
  `scripts/`, not a one-off.
- After each batch: rebuild, regenerate the address table, diff it against the
  first one.
- After a deploy: the deployed check — fetch each address from
  `https://juanevillam.com` and confirm the picture URLs return 200.
