import { pitchClassOf } from './guitar';
import { parseChordName } from './voicings';

/**
 * Whether a song belongs in a key.
 *
 * The question a musician asks is "can I play this in G?", and the honest
 * answer is whether every chord in the song is a chord of G. A song in A minor
 * whose chords are A minor, D minor and E minor sits perfectly well in G major,
 * because those are the chords of G major.
 */

/** The notes of a key, as the numbers of semitones above C. */
const scaleOf = (key: string): number[] => {
  const match = key.trim().match(/^([A-G][#b]?)/);
  if (!match) return [];

  const root = pitchClassOf(match[1]);
  if (root < 0) return [];

  // A minor key has the same notes as the major key a minor third above it.
  const isMinor = /^m(?!aj)/i.test(key.trim().slice(match[1].length));
  const tonic = isMinor ? (root + 3) % 12 : root;

  const major = [0, 2, 4, 5, 7, 9, 11];
  return major.map((step) => (tonic + step) % 12);
};

/**
 * Whether a chord is a chord of the key.
 *
 * What matters is the note the chord is built on: a dominant seventh is
 * still a chord of the key, and so is the secondary dominant that sends you
 * somewhere else for a bar. A chord built on a note that is not in the key
 * is not a chord of it.
 */
export const chordFitsKey = (chord: string, key: string): boolean => {
  const scale = scaleOf(key);
  if (scale.length === 0) return false;

  const parsed = parseChordName(chord);
  if (!parsed) return false;

  return scale.includes(parsed.root);
};

/**
 * Whether every chord of a song is a chord of the key.
 *
 * A song with no chords at all fits nothing, because there is nothing to
 * play.
 */
export const songFitsKey = (chords: string[], key: string): boolean => {
  if (chords.length === 0) return false;
  return chords.every((chord) => chordFitsKey(chord, key));
};
