/**
 * Ranking and de-duplication for search results.
 *
 * The sources are searched one after another and their results are simply
 * concatenated, so an exact title match could end up below a song that merely
 * contains the word. These helpers put the best match first and make sure the
 * same song is not listed twice.
 */

export interface RankableResult {
  id: string;
  source: string;
  title: string;
  artist: string;
  key?: string;
  hasChords?: boolean;
}

/** Lower case, and strip anything that is not a letter, a digit or a space. */
export const normalise = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const wordsOf = (value: string): string[] => normalise(value).split(' ').filter(Boolean);

/**
 * How well a result matches the search, from 100 (an exact title) down to 0.
 */
export const scoreResult = (result: RankableResult, query: string): number => {
  const normalisedQuery = normalise(query);
  if (!normalisedQuery) return 0;

  const title = normalise(result.title);
  const artist = normalise(result.artist);
  const titleWords = new Set(wordsOf(result.title));

  if (title === normalisedQuery) return 100;
  if (title.startsWith(normalisedQuery)) return 80;
  if (titleWords.has(normalisedQuery)) return 70;

  const queryWords = wordsOf(query);
  if (queryWords.length > 1 && queryWords.every((word) => titleWords.has(word))) return 65;

  if (title.includes(normalisedQuery)) return 55;
  if (artist === normalisedQuery) return 45;
  if (artist.includes(normalisedQuery)) return 35;

  // The query is spread across the title and the artist.
  if (queryWords.every((word) => title.includes(word) || artist.includes(word))) return 30;

  return 0;
};

/**
 * Order the results so the closest match comes first.
 *
 * Songs with chords come before lyrics-only versions of the same title, which
 * is what someone looking for a chord sheet wants.
 */
export const rankResults = <T extends RankableResult>(results: T[], query: string): T[] => {
  const scored = results.map((result) => ({ result, score: scoreResult(result, query) }));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (Boolean(b.result.hasChords) !== Boolean(a.result.hasChords)) {
      return Number(Boolean(b.result.hasChords)) - Number(Boolean(a.result.hasChords));
    }
    return a.result.title.localeCompare(b.result.title);
  });

  return scored.map((entry) => entry.result);
};

/**
 * Remove songs that are listed more than once.
 *
 * The same hymn often appears in more than one source. The first one wins,
 * which after ranking is the best match.
 */
export const dedupeResults = <T extends RankableResult>(results: T[]): T[] => {
  const seen = new Set<string>();

  return results.filter((result) => {
    const key = normalise(result.title);
    if (!key) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
