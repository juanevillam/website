#!/usr/bin/env node
/**
 * Builds or updates the 4 desktop (1440 × 960, 3:2) screenshots for the
 * Book Highlighter section on juanevillam.com (`website/public/media/highlighter/`):
 *
 *   1. desktop-dark-shelf.webp     — 2-column Shelf + Book Stage (Sapiens, Cosmos, Elon Musk)
 *   2. desktop-dark-chapters.webp  — 3-column Shelf + Book Stage + Chapters (TOC extracted from photo)
 *   3. desktop-dark-scanner.webp   — 3-column Shelf + Book Stage + Photo Scanner (sticky-note neural OCR)
 *   4. desktop-dark-reader.webp    — Kindle-style Reader (Book theme + Aa appearance & 5 themes)
 *
 * Usage:
 *   npm --prefix website run highlighter
 *     - If ~/Downloads/book-highlighter-shots/{shelf,chapters,scanner,reader}.{png,webp,jpg}
 *       exist, converts & resizes them to 1440 × 960 WebP in public/media/highlighter/.
 *     - Otherwise, renders the 4 initial 1440 × 960 (@2x Retina) desktop screens
 *       directly from book-highlighter/src/styles.css via headless Chrome.
 */

import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const WEBSITE = join(ROOT, 'website');
const BOOK_WEB = join(ROOT, 'book-highlighter');
const ARCHIVE_BOOKER = join(ROOT, 'web-archive/media/booker');
const OUT_DIR = join(WEBSITE, 'public/media/highlighter');
const DOWNLOADS_DIR =
  process.env.HIGHLIGHTER_SHOTS_DIR ??
  join(homedir(), 'Downloads/book-highlighter-shots');

const SLIDES = [
  ['shelf', 'desktop-dark-shelf.webp'],
  ['chapters', 'desktop-dark-chapters.webp'],
  ['scanner', 'desktop-dark-scanner.webp'],
  ['reader', 'desktop-dark-reader.webp'],
];

mkdirSync(OUT_DIR, { recursive: true });

// 1. Check if user placed custom screenshots in ~/Downloads/book-highlighter-shots/
const findCustomFile = base => {
  for (const ext of ['png', 'webp', 'jpg', 'jpeg']) {
    const p = join(DOWNLOADS_DIR, `${base}.${ext}`);
    if (existsSync(p)) return p;
    const full = join(DOWNLOADS_DIR, `desktop-dark-${base}.${ext}`);
    if (existsSync(full)) return full;
  }
  return null;
};

const customFiles = SLIDES.map(([key, out]) => ({
  key,
  out,
  src: findCustomFile(key),
}));

if (customFiles.every(f => f.src) && !process.argv.includes('--seed')) {
  for (const { src, out } of customFiles) {
    const dest = join(OUT_DIR, out);
    await sharp(src)
      .resize(1440, 960, { fit: 'cover', position: 'top' })
      .webp({ quality: 86, effort: 6 })
      .toFile(dest);
    console.log(`[UPDATED] ${src} -> public/media/highlighter/${out}`);
  }
  process.exit(0);
}

// 2. Otherwise, render the 4 initial 1440 × 960 (@2x Retina) desktop screens
//    using book-highlighter's real CSS and Juan's book covers from web-archive.
const tmp = mkdtempSync(join(tmpdir(), 'bh-shots-'));
try {
  const stylesCss = readFileSync(join(BOOK_WEB, 'src/styles.css'), 'utf8');

  const sapiensBuf = await sharp(join(ARCHIVE_BOOKER, 'ios-dark-book.png'))
    .extract({ left: 294, top: 486, width: 590, height: 892 })
    .png()
    .toBuffer();
  const cosmosBuf = await sharp(join(ARCHIVE_BOOKER, 'ios-dark-home.png'))
    .extract({ left: 612, top: 642, width: 519, height: 780 })
    .png()
    .toBuffer();
  const muskBuf = await sharp(join(ARCHIVE_BOOKER, 'ios-dark-home.png'))
    .extract({ left: 612, top: 1668, width: 519, height: 780 })
    .png()
    .toBuffer();

  const sapiensData = `data:image/png;base64,${sapiensBuf.toString('base64')}`;
  const cosmosData = `data:image/png;base64,${cosmosBuf.toString('base64')}`;
  const muskData = `data:image/png;base64,${muskBuf.toString('base64')}`;

  const shelfColumnHtml = `
    <main class="library">
      <div class="bar">
        <div class="bar-lead">
          <button type="button" class="filter-pill">
            <span>Recent</span>
            <svg viewBox="0 0 12 18" width="9" height="13" aria-hidden="true"><path d="M2.5 6.5 6 3l3.5 3.5M2.5 11.5 6 15l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
        <span class="bar-title">Book Highlighter</span>
        <div class="bar-actions bar-glyph">
          <div class="glass-pill">
            <button type="button" aria-label="Trophies">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
            </button>
            <button type="button" aria-label="Settings">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
            </button>
            <button type="button" aria-label="Account">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.8-3.6 5-5.5 8-5.5s6.2 1.9 8 5.5"/></svg>
            </button>
          </div>
        </div>
      </div>
      <h1 class="large-title">Book Highlighter</h1>
      <ol class="grid is-entered">
        <li>
          <button type="button" class="tile is-add">
            <span class="tile-art artwork is-empty">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </span>
            <span class="tile-title">New Book</span>
          </button>
        </li>
        <li>
          <button type="button" class="tile">
            <span class="tile-art artwork">
              <img class="is-ready" src="${cosmosData}" alt="" />
            </span>
            <span class="tile-title">Cosmos: Mundos posibles</span>
            <span class="tile-sub">Ann Druyan</span>
          </button>
        </li>
        <li>
          <button type="button" class="tile is-active">
            <span class="tile-art artwork">
              <img class="is-ready" src="${sapiensData}" alt="" />
              <span class="series-badge">2</span>
            </span>
            <span class="tile-title">Sapiens</span>
            <span class="tile-sub">Yuval Noah Harari</span>
          </button>
        </li>
        <li>
          <button type="button" class="tile">
            <span class="tile-art artwork">
              <img class="is-ready" src="${muskData}" alt="" />
            </span>
            <span class="tile-title">Elon Musk</span>
            <span class="tile-sub">Walter Isaacson</span>
          </button>
        </li>
      </ol>
    </main>
  `;

  const stageColumnHtml = `
    <aside class="stage">
      <div class="now-column">
        <div class="player-backdrop" aria-hidden="true">
          <div class="wash is-on">
            <img src="${sapiensData}" alt="" />
          </div>
          <div class="fade"></div>
        </div>
        <div class="now book-stage">
          <div class="book-stage-top">
            <div></div>
            <div class="glass-pill">
              <button type="button" aria-label="Export PDF">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0-12L8 7m4-4 4 4"/><path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/></svg>
              </button>
              <button type="button" aria-label="Edit Book">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              </button>
            </div>
          </div>
          <div class="book-stage-scroll">
            <div class="book-hero">
              <span class="book-hero-cover artwork">
                <img class="is-ready" src="${sapiensData}" alt="" />
              </span>
              <h2 class="book-hero-title">Sapiens. De animales a dioses: Una breve historia de la humanidad</h2>
              <p class="book-hero-author">Yuval Noah Harari</p>
              <p class="book-hero-meta">2011 · History, Essays, Popular Science</p>
              <button type="button" class="pill is-primary book-read-btn">Continue</button>
            </div>
            <div class="book-sections">
              <section class="form-section">
                <h3 class="section-head">SUMMARY</h3>
                <div class="card summary-card">
                  <p style="margin:0;padding:0.875rem 1rem;font-size:0.9375rem;line-height:1.5;color:var(--ink);">How Homo sapiens came to rule Earth through shared myths—money, empires, science and religion—and now stands on the threshold of engineering intelligent life beyond biology.</p>
                </div>
              </section>
              <section class="form-section">
                <div class="card">
                  <button type="button" class="cell is-button">
                    <span class="cell-name">Chapters</span>
                    <span class="cell-value" style="display:inline-flex;align-items:center;gap:0.375rem;">
                      <span>17 chapters · 58 highlights</span>
                      <svg viewBox="0 0 10 16" width="8" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m2 2 6 6-6 6"/></svg>
                    </span>
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </aside>
  `;

  // Slide 1: Shelf (2-column)
  const htmlShelf = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${stylesCss}
    .filter-pill { display:inline-flex; align-items:center; gap:0.35rem; border:0; background:none; color:var(--accent); font-size:0.9375rem; font-weight:500; padding:0; }
    .book-stage-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; }
    .book-hero { display:flex; flex-direction:column; align-items:center; text-align:center; }
    .book-hero-cover { width:11rem; aspect-ratio:2/3; border-radius:0.875rem; overflow:hidden; box-shadow:0 1rem 2.5rem rgb(0 0 0 / 0.45); }
    .book-hero-title { margin:1.25rem 0 0.25rem; font-size:1.35rem; font-weight:700; line-height:1.22; letter-spacing:-0.02em; }
    .book-hero-author { margin:0; color:var(--muted); font-size:1rem; }
    .book-hero-meta { margin:0.25rem 0 1.125rem; color:var(--faint); font-size:0.8125rem; }
    .book-read-btn { min-width:8.5rem; height:2.625rem; font-size:1rem; }
    .book-sections { margin-top:1.5rem; display:grid; gap:1rem; }
    .series-badge { position:absolute; right:0.5rem; bottom:0.5rem; width:1.75rem; height:1.75rem; border-radius:50%; background:rgb(20 20 22 / 0.82); backdrop-filter:blur(8px); display:grid; place-items:center; font-size:0.8125rem; font-weight:700; color:#fff; box-shadow:inset 0 0 0 1px rgb(255 255 255 / 0.18); }
  </style></head><body>
    <div class="home is-staged has-current">${shelfColumnHtml}${stageColumnHtml}</div>
  </body></html>`;

  // Slide 2: Chapters (3-column)
  const chaptersToolHtml = `
    <aside class="tools">
      <section class="side is-open is-base">
        <header class="side-bar is-edge">
          <div class="bar-lead"></div>
          <h2 class="side-title">Chapters</h2>
          <div class="bar-glyph">
            <div class="glass-pill">
              <button type="button" aria-label="Scan Index">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>
          </div>
        </header>
        <div class="form" style="padding:4.5rem 1.25rem 1rem;">
          <section class="form-section">
            <div class="section-head"><span>PART ONE · THE COGNITIVE REVOLUTION</span></div>
            <div class="card">
              ${[
                ['1. An Animal of No Significance', 'pp. 15–32', '4'],
                ['2. The Tree of Knowledge', 'pp. 33–54', '6'],
                ['3. A Day in the Life of Adam and Eve', 'pp. 55–85', '3'],
                ['4. The Flood', 'pp. 86–102', '2'],
              ]
                .map(
                  ([title, pp, count]) => `
                <div class="cell" style="padding:0.65rem 0.875rem;">
                  <div style="display:grid;gap:0.125rem;min-width:0;">
                    <span style="font-size:0.9375rem;font-weight:500;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${title}</span>
                    <span style="font-size:0.75rem;color:var(--muted);font-variant-numeric:tabular-nums;">${pp}</span>
                  </div>
                  <div class="chapter-row-trail">
                    <span class="chapter-count-pill">${count}</span>
                    <svg viewBox="0 0 10 16" width="7" height="12" fill="none" stroke="var(--faint)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m2 2 6 6-6 6"/></svg>
                  </div>
                </div>`,
                )
                .join('')}
            </div>
          </section>
          <section class="form-section" style="margin-top:1.25rem;">
            <div class="section-head"><span>PART FOUR · THE SCIENTIFIC REVOLUTION</span></div>
            <div class="card">
              ${[
                ['17. The Wheels of Industry', 'pp. 441–468', '5'],
                ['18. A Permanent Revolution', 'pp. 469–498', '4'],
                ['19. And They Lived Happily Ever After', 'pp. 499–522', '3'],
                ['20. El final de «Homo sapiens»', 'pp. 523–543', '7'],
              ]
                .map(
                  ([title, pp, count], idx) => `
                <div class="cell" style="padding:0.65rem 0.875rem;${idx === 3 ? 'background:rgb(255 255 255 / 0.05);' : ''}">
                  <div style="display:grid;gap:0.125rem;min-width:0;">
                    <span style="font-size:0.9375rem;font-weight:500;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${title}</span>
                    <span style="font-size:0.75rem;color:var(--muted);font-variant-numeric:tabular-nums;">${pp}</span>
                  </div>
                  <div class="chapter-row-trail">
                    <span class="chapter-count-pill">${count}</span>
                    <svg viewBox="0 0 10 16" width="7" height="12" fill="none" stroke="var(--faint)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m2 2 6 6-6 6"/></svg>
                  </div>
                </div>`,
                )
                .join('')}
            </div>
          </section>
        </div>
      </section>
    </aside>
  `;

  const htmlChapters = htmlShelf
    .replace(
      '<div class="home is-staged has-current">',
      '<div class="home is-staged is-tooled has-current">',
    )
    .replace('</div>\n  </body>', `${chaptersToolHtml}</div>\n  </body>`);

  // Slide 3: Scanner / Chapter Highlights (3-column)
  const scannerToolHtml = `
    <aside class="tools">
      <section class="side is-open is-base">
        <header class="side-bar is-edge">
          <div class="bar-lead">
            <button type="button" class="round" aria-label="Back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          </div>
          <h2 class="side-title" style="font-size:0.95rem;">20. El final de «Homo sapiens»</h2>
          <div class="bar-glyph">
            <button type="button" class="round is-commit" aria-label="Scan Pages">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </header>
        <div class="form" style="padding:4.5rem 1.25rem 1rem;display:grid;gap:1rem;">
          <div class="card" style="padding:0.875rem;background:rgb(255 255 255 / 0.05);border:1px solid var(--hairline);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.625rem;">
              <span style="font-size:0.75rem;font-weight:600;color:var(--accent);letter-spacing:0.04em;text-transform:uppercase;">Sticky-Note Page Scan · p. 538</span>
              <span class="chapter-count-pill">Reset Auto</span>
            </div>
            <div style="border-radius:0.625rem;background:#1c1b18;padding:0.875rem;font-family:var(--font-serif);font-size:0.82rem;line-height:1.55;color:#d8d3c8;border:1px solid rgb(255 255 255 / 0.08);position:relative;">
              <div style="opacity:0.42;margin-bottom:0.35rem;">El proyecto Gilgamesh y la creación de ciborgs...</div>
              <div style="background:rgb(212 163 89 / 0.26);border-left:3px solid #d4a359;padding:0.25rem 0.5rem;border-radius:0.25rem;color:#f5f2eb;">«Suponga el lector que puede hacer una copia de seguridad de su cerebro en un disco duro portátil. Y después ejecutarlo en su portátil.»</div>
              <div style="opacity:0.42;margin-top:0.35rem;">¿Sería su portátil capaz de pensar y sentir exactamente igual que un sapiens?</div>
            </div>
          </div>
          <section class="form-section">
            <div class="section-head"><span>HIGHLIGHTS · PP. 523, 538 & 543</span></div>
            <div class="card">
              ${[
                [
                  'p. 523',
                  'La primera grieta en el antiguo régimen apareció hace unos 10.000 años, durante la revolución agrícola, cuando los sapiens que soñaban con pollos gordos y lentos descubrieron que si emparejaban la gallina más gorda con el gallo más lento, algunos de sus descendientes serían tanto gordos como lentos.',
                ],
                [
                  'p. 538',
                  'Suponga el lector que puede hacer una copia de seguridad de su cerebro en un disco duro portátil. Y después ejecutarlo en su portátil. ¿Sería su portátil capaz de pensar y sentir igual que un sapiens?',
                ],
                [
                  'p. 543',
                  'El mito de Frankenstein enfrenta a Homo sapiens con el hecho de que los últimos días se están acercando rápidamente. A menos que alguna catástrofe nuclear o ecológica nos destruya antes, el ritmo del desarrollo tecnológico conducirá pronto a la sustitución de Homo sapiens por seres completamente distintos.',
                ],
              ]
                .map(
                  ([pg, text]) => `
                <div class="cell" style="padding:0.75rem 0.875rem;display:grid;gap:0.25rem;">
                  <span style="font-size:0.75rem;font-weight:600;color:#d4a359;font-variant-numeric:tabular-nums;">${pg}</span>
                  <span style="font-size:0.875rem;line-height:1.45;color:var(--ink);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;">${text}</span>
                </div>`,
                )
                .join('')}
            </div>
          </section>
        </div>
      </section>
    </aside>
  `;

  const htmlScanner = htmlShelf
    .replace(
      '<div class="home is-staged has-current">',
      '<div class="home is-staged is-tooled has-current">',
    )
    .replace('</div>\n  </body>', `${scannerToolHtml}</div>\n  </body>`);

  // Slide 4: Reader (Book theme + Aa panel open on the right)
  const htmlReader = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${stylesCss}
    .reader-mock { display:grid; grid-template-columns:minmax(0, 1fr) 22rem; height:100svh; background:#141210; color:#ede6d8; }
    .reader-page { position:relative; display:flex; flex-direction:column; justify-content:space-between; padding:1.5rem 3.5rem 2rem; overflow:hidden; }
    .reader-top { display:flex; align-items:center; justify-content:space-between; }
    .reader-content { max-width:38rem; margin:0 auto; font-family:var(--font-serif); }
    .reader-ch { font-size:1.65rem; font-weight:700; line-height:1.2; color:#f5efe4; margin:0 0 0.35rem; }
    .reader-pp { font-family:var(--font-sans); font-size:0.8125rem; color:#9e9482; margin-bottom:1.75rem; }
    .reader-hl { margin:0 0 1.35rem; font-size:1.125rem; line-height:1.68; color:#f0e9db; }
    .reader-hl mark { background:rgb(212 163 89 / 0.2); color:inherit; padding:0.08em 0.2em; border-radius:0.2em; box-decoration-break:clone; -webkit-box-decoration-break:clone; }
    .reader-hl .pg { font-family:var(--font-sans); font-size:0.75rem; font-weight:600; color:#d4a359; margin-left:0.4rem; }
    .ornament { display:flex; align-items:center; justify-content:center; gap:0.75rem; color:rgb(212 163 89 / 0.45); font-size:0.75rem; letter-spacing:0.2em; }
    .ornament::before, .ornament::after { content:''; width:4.5rem; height:1px; background:rgb(212 163 89 / 0.28); }
    .theme-chip { flex:1 1 0; min-width:0; display:flex; flex-direction:column; align-items:center; gap:0.35rem; padding:0.55rem 0.2rem; border-radius:0.75rem; border:1px solid var(--hairline); font-size:0.72rem; font-weight:500; }
    .theme-chip.is-on { border-color:var(--ink); box-shadow:inset 0 0 0 1px var(--ink); }
  </style></head><body>
    <div class="reader-mock">
      <div class="reader-page">
        <div class="reader-top">
          <button type="button" class="round" style="background:rgb(255 255 255 / 0.08);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <span style="font-size:0.875rem;font-weight:600;color:#b8ae9c;">Sapiens. De animales a dioses</span>
          <div class="glass-pill">
            <button type="button" aria-pressed="true" style="font-weight:700;font-size:0.9375rem;">Aa</button>
            <button type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
            </button>
          </div>
        </div>
        <div class="ornament">✦ ❖ ✦</div>
        <div class="reader-content">
          <h2 class="reader-ch">20. El final de «Homo sapiens»</h2>
          <div class="reader-pp">pp. 523, 538 & 543</div>
          <p class="reader-hl"><mark>“La primera grieta en el antiguo régimen apareció hace unos 10.000 años, durante la revolución agrícola, cuando los sapiens que soñaban con pollos gordos y lentos descubrieron que si emparejaban la gallina más gorda con el gallo más lento, algunos de sus descendientes serían tanto gordos como lentos.”</mark><span class="pg">p. 523</span></p>
          <p class="reader-hl"><mark>“Suponga el lector que puede hacer una copia de seguridad de su cerebro en un disco duro portátil. Y después ejecutarlo en su portátil. ¿Sería su portátil capaz de pensar y sentir exactamente igual que un sapiens?”</mark><span class="pg">p. 538</span></p>
          <p class="reader-hl"><mark>“El mito de Frankenstein enfrenta a Homo sapiens con el hecho de que los últimos días se están acercando rápidamente. A menos que alguna catástrofe nuclear o ecológica nos destruya antes, el ritmo del desarrollo tecnológico conducirá pronto a la sustitución de Homo sapiens por seres completamente distintos.”</mark><span class="pg">p. 543</span></p>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">
          <div class="ornament">✦</div>
          <span style="font-size:0.75rem;color:#9e9482;font-variant-numeric:tabular-nums;">71 of 79</span>
        </div>
      </div>
      <aside class="tools" style="display:block;border-left:1px solid var(--hairline);background:var(--ground);color:var(--ink);">
        <section class="side is-open is-base" style="position:relative;height:100%;background:var(--ground);">
          <header class="side-bar is-edge">
            <div class="bar-lead"></div>
            <h2 class="side-title">Appearance</h2>
            <div class="bar-glyph"></div>
          </header>
          <div class="form" style="padding:4.5rem 1.25rem 1rem;display:grid;gap:1.25rem;">
            <section class="form-section">
              <div class="section-head"><span>PAGE THEME</span></div>
              <div style="display:flex;gap:0.4rem;padding:0.65rem;border-radius:1rem;background:var(--surface);">
                <div class="theme-chip" style="background:#fff;color:#1c1c1e;"><span>Aa</span><span>Light</span></div>
                <div class="theme-chip" style="background:#0d0d0d;color:#f5f5f5;"><span>Aa</span><span>Dark</span></div>
                <div class="theme-chip" style="background:#f3e9d2;color:#3b2f22;"><span>Aa</span><span>Sepia</span></div>
                <div class="theme-chip" style="background:#cfcfcb;color:#1a1a1a;"><span>Aa</span><span>Paper</span></div>
                <div class="theme-chip is-on" style="background:#141210;color:#ede6d8;"><span>✦</span><span>Book</span></div>
              </div>
            </section>
            <section class="form-section">
              <div class="section-head" style="display:flex;justify-content:space-between;"><span>TEXT SIZE</span><span style="color:var(--ink);">100%</span></div>
              <div class="card" style="padding:0.75rem 1rem;display:flex;align-items:center;gap:0.75rem;">
                <span style="font-size:0.8125rem;color:var(--muted);">A</span>
                <div style="flex:1;height:0.25rem;border-radius:999px;background:linear-gradient(to right, var(--ink) 50%, var(--track) 50%);position:relative;">
                  <span style="position:absolute;left:50%;top:50%;width:1.25rem;height:1.25rem;border-radius:50%;background:#fff;transform:translate(-50%,-50%);box-shadow:0 2px 6px rgb(0 0 0 / 0.35);"></span>
                </div>
                <span style="font-size:1.125rem;color:var(--ink);font-weight:600;">A</span>
              </div>
            </section>
            <section class="form-section">
              <div class="section-head"><span>PAGE TURN</span></div>
              <div class="segmented">
                <button type="button" class="is-active">Curl</button>
                <button type="button">Slide</button>
                <button type="button">Scroll</button>
              </div>
            </section>
            <section class="form-section">
              <div class="section-head"><span>PAGE WIDTH</span></div>
              <div class="segmented">
                <button type="button" class="is-active">Standard</button>
                <button type="button">Extended</button>
              </div>
            </section>
          </div>
        </section>
      </aside>
    </div>
  </body></html>`;

  const pages = [
    ['shelf', 'desktop-dark-shelf.webp', htmlShelf],
    ['chapters', 'desktop-dark-chapters.webp', htmlChapters],
    ['scanner', 'desktop-dark-scanner.webp', htmlScanner],
    ['reader', 'desktop-dark-reader.webp', htmlReader],
  ];

  const chromeBin =
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

  for (const [key, out, html] of pages) {
    const htmlPath = join(tmp, `${key}.html`);
    const pngPath = join(tmp, `${key}.png`);
    writeFileSync(htmlPath, html);
    execFileSync(chromeBin, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--window-size=1440,960',
      '--force-device-scale-factor=2',
      `--screenshot=${pngPath}`,
      `file://${htmlPath}`,
    ]);
    await sharp(pngPath)
      .resize(1440, 960, { fit: 'cover' })
      .webp({ quality: 86, effort: 6 })
      .toFile(join(OUT_DIR, out));
    console.log(`[GENERATED] public/media/highlighter/${out} (1440 × 960)`);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
