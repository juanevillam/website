import orderData from '../data/media-order.json';

type MediaOrderData = {
  events: Record<string, string[]>;
  photos: Record<string, string[]>;
  cosmos: string[];
  removed?: {
    events?: Record<string, string[]>;
    photos?: Record<string, string[]>;
    cosmos?: string[];
  };
};

const saved = orderData as MediaOrderData;

/**
 * Filters out removed items and reorders `items` according to a saved list of
 * keys (from `/dev/media`), keeping any newly added items at the end in their
 * original order.
 */
export const applyOrder = <T>(
  items: T[],
  order: string[] | undefined,
  keyOf: (item: T) => string,
  removed?: string[],
): T[] => {
  const removedSet = new Set(removed ?? []);
  const kept = removedSet.size
    ? items.filter(item => !removedSet.has(keyOf(item)))
    : items;
  if (!order?.length) return kept;
  const map = new Map(kept.map(item => [keyOf(item), item]));
  const out: T[] = [];
  const seen = new Set<string>();
  for (const key of order) {
    const item = map.get(key);
    if (item && !seen.has(key)) {
      out.push(item);
      seen.add(key);
    }
  }
  for (const item of kept) {
    const key = keyOf(item);
    if (!seen.has(key)) out.push(item);
  }
  return out;
};

export const savedEventOrder = (id: string) => saved.events?.[id];
export const savedPhotoOrder = (id: string) => saved.photos?.[id];
export const savedCosmosOrder = () => saved.cosmos;

export const savedEventRemoved = (id: string) => saved.removed?.events?.[id] ?? [];
export const savedPhotoRemoved = (id: string) => saved.removed?.photos?.[id] ?? [];
export const savedCosmosRemoved = () => saved.removed?.cosmos ?? [];
