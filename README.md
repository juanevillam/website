# juanevillam.com

My personal site: the apps I build, the work I do, and the events I've been to,
narrated in my own voice and `9:16` video in Spanish with synchronized read-along
across English, Spanish, and Chinese. It also hosts the playable Space Explorer
arcade cabinet, a miniature Sound Shaper player with DJ Juan, 3D canvas easter
eggs, and the support and legal pages for my apps.

Built with [Astro](https://astro.build) as a static site and deployed on
Cloudflare Pages. Plain CSS and TypeScript, no UI framework.

- **Web:** [juanevillam.com](https://juanevillam.com)

## Layout

| path             | what it is                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `src/pages`      | Astro routes — the landing page, shareable modal routes (`/sound-shaper`, `/work/*`, `/events/*`), app legal pages, `/dev/teleprompter`  |
| `src/components` | page sections, `PanelDeck`, `NarrationPlayer`, `SongsPlayer`, `ArcadeCabinet`, and media viewers                                         |
| `src/lib`        | narration alignment, Mini Sound Shaper DSP and DJ Juan (`autoDj/`), 3D Space Explorer scenes (`ship/`), Tridi G1 motion (`robot/`)       |
| `src/scripts`    | client-side scroll and narration director (`director.ts`)                                                                                |
| `src/i18n`       | translations (`en`, `es`, `zh`) aligned sentence-for-sentence with the narration takes                                                   |
| `src/data`       | `whisper.cpp` word-level timing maps (`narration/*.words.json`)                                                                          |
| `src/styles`     | design tokens, motion grammar, and global styles (`global.css`)                                                                          |
| `public/`        | static media, narration audio and `9:16` video (`media/narration/es/`), embedded Space Explorer (`arcade/`), Cloudflare Pages `_headers` |
| `scripts/`       | teleprompter recorder, narration status, and sync scripts for Space Explorer (`arcade`), Sound Shaper (`songs`), and Tridi (`tridi`)     |
| `docs/`          | the six `web-*` audit gates ([`docs/audit-playbook.md`](docs/audit-playbook.md))                                                         |

`juanevillam.com` began life as `apps/web` inside the portfolio monorepo and
moved here, history included, when it became its own repository.

## Develop

```sh
npm install
npm run dev
npm run typecheck
npm run build
```

`npm run build` writes the static site to `dist/`. When upstream sibling repos
change, `npm run arcade` refreshes the embedded Space Explorer cabinet from
`../games/platanus-hack-26-venezuela-arcade/` and `npm run tridi` refreshes the
Unitree G1 motion data from `../../tridi/`.

## Narration and synced surfaces

Every narrated paragraph is a real Spanish voice and `9:16` camera take,
transcribed locally with `whisper.cpp` into `src/data/narration/{key}.words.json`.
At build time, Spanish aligns word by word and the English and Chinese
translations in `src/i18n/ui.ts` align sentence by sentence on the Spanish
clock, so the paragraph itself lights up as it is spoken without separate
subtitles.

The **Songs** card (`SongsPlayer.astro`) runs Sound Shaper's Web Audio graph and
DJ Juan planner (`src/lib/autoDj/`), and the background 3D scenes (`src/lib/ship/`)
run Space Explorer's own perspective projection and ship simulation.

## Standards

[`AGENTS.md`](AGENTS.md) is the product and engineering record: how the snapped
desktop layout and `<48rem` phone composition work, how narration and 3D easter
eggs behave, and the copy and UI rules they follow. The six web audits and the
order they run in live in [`docs/audit-playbook.md`](docs/audit-playbook.md).

## License

All rights reserved — see [`LICENSE`](LICENSE). The source is public to read;
it is not licensed for reuse or redistribution. Vendored third-party code keeps
its own license.
