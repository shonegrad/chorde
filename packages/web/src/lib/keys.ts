/**
 * The keys a song can be in, and how far apart they are.
 */

const SEMITONES: Record<string, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};

export const ALL_KEYS = Object.keys(SEMITONES);

/** The note a key is built on, e.g. the E flat of E flat minor. */
export const rootOfKey = (key: string): string => key.match(/^([A-G][#b]?)/)?.[1] ?? '';

/**
 * How many semitones separate one key from another.
 *
 * The quality of the key is kept: moving a minor song up a tone keeps it
 * minor.
 */
export const keyShift = (from: string, to: string): number => {
  const fromRoot = SEMITONES[rootOfKey(from)];
  const toRoot = SEMITONES[rootOfKey(to)];

  if (fromRoot === undefined || toRoot === undefined) return 0;
  return (toRoot - fromRoot + 12) % 12;
};
