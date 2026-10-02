/**
 * WHERE EACH APP IS LIVE — the one switch for every store badge on the site.
 *
 * `null` = not published yet: the badge renders as our own "Coming soon"
 * lockup. A URL = live: the badge becomes Apple's / Google's OFFICIAL
 * artwork, linked to that listing. Nothing else on the page changes.
 *
 * The planned launch order, one flip at a time:
 *
 *   1. Sound Shaper — App Store
 *   2. Topper       — App Store
 *   3. Sound Shaper — Google Play
 *   4. Topper       — Google Play
 *
 * Paste the listing URL as each one goes live, e.g.
 *   'https://apps.apple.com/app/id0000000000'
 *   'https://play.google.com/store/apps/details?id=com.juanevillam.soundshaper'
 * (the real ids come from App Store Connect / Play Console). The apps' own
 * release work — signing, the Firebase SHA fingerprints, the store listings
 * — is tracked in docs/phase-c-release.md, not here.
 */
export type Store = 'app-store' | 'google-play';
export type ReleasedApp = 'shaper' | 'topper';

export const RELEASES: Record<ReleasedApp, Record<Store, string | null>> = {
  shaper: {
    'app-store': null,
    'google-play': null,
  },
  topper: {
    'app-store': null,
    'google-play': null,
  },
};
