/**
 * The notes a chord is made of.
 *
 * Every chord quality is written down twice: the notes in semitones from the
 * root, and how far up the scale each note is in letter steps. The second
 * one is what decides how a note is spelled. The seventh of a chord is the
 * seventh letter, so a minor seventh is a flattened seventh and not a
 * sharpened sixth — which is why the chord on B flat in B flat major is
 * B flat, D and F, and never A sharp, D and F.
 */

export interface ChordTones {
  /** The notes, in semitones from the root. */
  semitones: number[];
  /** How many letter steps above the root each note is. */
  steps: number[];
}

export const CHORD_TONES: Record<string, ChordTones> = {
  '': { semitones: [0, 4, 7], steps: [0, 2, 4] },
  '5': { semitones: [0, 7], steps: [0, 4] },
  m: { semitones: [0, 3, 7], steps: [0, 2, 4] },
  dim: { semitones: [0, 3, 6], steps: [0, 2, 4] },
  aug: { semitones: [0, 4, 8], steps: [0, 2, 4] },
  sus2: { semitones: [0, 2, 7], steps: [0, 1, 4] },
  sus4: { semitones: [0, 5, 7], steps: [0, 3, 4] },
  '6': { semitones: [0, 4, 7, 9], steps: [0, 2, 4, 5] },
  maj6: { semitones: [0, 4, 7, 9], steps: [0, 2, 4, 5] },
  m6: { semitones: [0, 3, 7, 9], steps: [0, 2, 4, 5] },
  '7': { semitones: [0, 4, 7, 10], steps: [0, 2, 4, 6] },
  maj7: { semitones: [0, 4, 7, 11], steps: [0, 2, 4, 6] },
  m7: { semitones: [0, 3, 7, 10], steps: [0, 2, 4, 6] },
  mmaj7: { semitones: [0, 3, 7, 11], steps: [0, 2, 4, 6] },
  dim7: { semitones: [0, 3, 6, 9], steps: [0, 2, 4, 6] },
  m7b5: { semitones: [0, 3, 6, 10], steps: [0, 2, 4, 6] },
  '7sus4': { semitones: [0, 5, 7, 10], steps: [0, 3, 4, 6] },
  '7b5': { semitones: [0, 4, 6, 10], steps: [0, 2, 4, 6] },
  '7#5': { semitones: [0, 4, 8, 10], steps: [0, 2, 4, 6] },
  '7b9': { semitones: [0, 4, 7, 10, 13], steps: [0, 2, 4, 6, 7] },
  '7b13': { semitones: [0, 4, 7, 10, 20], steps: [0, 2, 4, 6, 11] },
  '7alt': { semitones: [0, 4, 10], steps: [0, 2, 4, 6] },
  '9': { semitones: [0, 4, 7, 10, 14], steps: [0, 2, 4, 6, 7] },
  maj9: { semitones: [0, 4, 7, 11, 14], steps: [0, 2, 4, 6, 7] },
  m9: { semitones: [0, 3, 7, 10, 14], steps: [0, 2, 4, 6, 7] },
  '9sus4': { semitones: [0, 5, 7, 10, 14], steps: [0, 3, 4, 6, 7] },
  add9: { semitones: [0, 4, 7, 14], steps: [0, 2, 4, 7] },
  '11': { semitones: [0, 4, 7, 10, 14, 17], steps: [0, 2, 4, 6, 7, 9] },
  m11: { semitones: [0, 3, 7, 10, 14, 17], steps: [0, 2, 4, 6, 7, 9] },
  '13': { semitones: [0, 4, 7, 10, 14, 21], steps: [0, 2, 4, 6, 7, 11] },
  maj13: { semitones: [0, 4, 7, 11, 14, 21], steps: [0, 2, 4, 6, 7, 11] },
};

/** The qualities that are written in more than one way. */
const QUALITY_ALIASES: Record<string, string> = {
  min: 'm',
  minor: 'm',
  maj: '',
  major: '',
  o: 'dim',
  '°': 'dim',
  ø: 'm7b5',
  '+': 'aug',
  sus: 'sus4',
};

/**
 * The notes of a chord quality, however it is written.
 *
 * A chord with an extra note in its name, such as "maj7#11", is played as
 * the chord we do know.
 */
export const tonesOfQuality = (quality: string): ChordTones | null => {
  const normalised = quality
    .trim()
    .toLowerCase()
    .replace(/[\s()]/g, '');
  const alias = QUALITY_ALIASES[normalised];
  const key = alias !== undefined ? alias : normalised;

  if (key in CHORD_TONES) return CHORD_TONES[key];

  const known = Object.keys(CHORD_TONES).sort((a, b) => b.length - a.length);
  const match = known.find((candidate) => candidate !== '' && key.startsWith(candidate));
  if (match) return CHORD_TONES[match];

  return null;
};
