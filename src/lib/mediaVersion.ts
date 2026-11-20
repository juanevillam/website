import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const PUBLIC = path.join(process.cwd(), 'public');
const hashCache = new Map<string, string>();

/** Strip any `?v=...` query string from a site-relative media path. */
export const cleanMediaPath = (src: string): string => src.split('?')[0];

/**
 * Append a build-time content hash (`?v=<8-char sha256>`) to a site-relative
 * `/media/*` URL so updated screenshots, videos, posters, and narration clips
 * immediately bust Cloudflare Edge (`max-age=604800`) and browser caches.
 */
export const versionedMedia = (src: string): string => {
  const clean = cleanMediaPath(src);
  if (!clean.startsWith('/media/')) return src;
  let version = hashCache.get(clean);
  if (version === undefined) {
    const file = path.join(PUBLIC, clean);
    if (!fs.existsSync(file)) {
      hashCache.set(clean, '');
      return clean;
    }
    version = crypto
      .createHash('sha256')
      .update(fs.readFileSync(file))
      .digest('hex')
      .slice(0, 8);
    hashCache.set(clean, version);
  }
  return version ? `${clean}?v=${version}` : clean;
};

/**
 * Replace a suffix/extension on a site-relative media path (even if already
 * versioned) and return the versioned URL for the derived target file.
 */
export const deriveVersionedMedia = (
  src: string,
  pattern: RegExp,
  replacement: string,
): string => versionedMedia(cleanMediaPath(src).replace(pattern, replacement));
