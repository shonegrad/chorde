import type { Song } from '../types';
import { parseChordPro } from './chordPro';
import { transposeChord, transposeKey, keyPrefersFlats } from './music';
import type { ParsedSong } from '../types';

export interface PreparedSong {
  /** The song with the chords transposed. */
  lines: ParsedSong;
  /** The key the chords are written in, after any transposition. */
  writtenKey?: string;
  /** The key it sounds in, once the capo is taken into account. */
  soundingKey?: string;
}

/**
 * Get a song ready to play.
 *
 * The transpose moves the written chords; the capo does not, because a capo
 * plays the same shapes higher up the neck.
 */
export const prepareSong = (song: Song | undefined, transpose = 0, capo = 0): PreparedSong => {
  if (!song) {
    return { lines: [], writtenKey: undefined, soundingKey: undefined };
  }

  const parsed = parseChordPro(song.content);

  const writtenKey = transpose ? transposeKey(song.key ?? '', transpose) : song.key;
  const preferFlats = keyPrefersFlats(writtenKey);

  const lines =
    transpose === 0
      ? parsed
      : parsed.map((line) => ({
          ...line,
          items: line.items.map((item) => ({
            ...item,
            chord: item.chord ? transposeChord(item.chord, transpose, { preferFlats }) : undefined,
          })),
        }));

  const soundingKey =
    writtenKey && capo > 0 ? transposeKey(writtenKey, capo, { preferFlats }) : writtenKey;

  return { lines, writtenKey, soundingKey };
};
