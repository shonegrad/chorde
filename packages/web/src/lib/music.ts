export interface TransposeOptions {
  /**
   * Spell natural notes using flat names (Bb) rather than sharp names (A#).
   * Derived from the song's key so a transposed song keeps a coherent signature.
   */
  preferFlats?: boolean;
}

const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

/** Semitone index for every note name we understand, sharp or flat spelled. */
const SEMITONE_INDEX: Record<string, number> = {};
SHARP_NAMES.forEach((name, index) => {
  SEMITONE_INDEX[name] = index;
});
FLAT_NAMES.forEach((name, index) => {
  if (!(name in SEMITONE_INDEX)) SEMITONE_INDEX[name] = index;
});

/** Notes that are conventionally spelled flat no matter the key signature. */
const FLAT_SPELLED = new Set(['Db', 'Eb', 'Gb', 'Ab', 'Bb']);
/** Notes that are conventionally spelled sharp no matter the key signature. */
const SHARP_SPELLED = new Set(['C#', 'D#', 'F#', 'G#', 'A#']);

/** Circle-of-fifths position for each natural letter. */
const FIFTHS: Record<string, number> = {
  C: 0,
  G: 1,
  D: 2,
  A: 3,
  E: 4,
  B: 5,
  F: -1,
};

/** Normalise unicode accidentals so `C♯` transposes like `C#`. */
const normalizeAccidentals = (value: string): string => value.replace(/♯/g, '#').replace(/♭/g, 'b');

/**
 * Transpose a chord by a number of semitones.
 *
 * Explicit accidentals keep their spelling (an `Eb` chord stays flat-spelled),
 * while natural notes follow the key signature supplied via `preferFlats`.
 */
export const transposeChord = (
  chord: string,
  semitones: number,
  options: TransposeOptions = {}
): string => {
  if (!chord) return '';

  const normalized = normalizeAccidentals(chord);
  const rootMatch = normalized.match(/^([A-G][#b]?)(.*)$/);
  if (!rootMatch) return chord; // Unparseable chord (N.C., em dash, ...) is left alone.

  const root = rootMatch[1];
  const suffix = rootMatch[2];

  // Slash chord handling (e.g. /G)
  const slashParts = suffix.split('/');
  const newSuffix = slashParts[0];
  let bassNote = '';

  if (slashParts.length > 1 && slashParts[1]) {
    bassNote = '/' + transposeNote(slashParts[1], semitones, options.preferFlats);
  }

  const newRoot = transposeNote(root, semitones, options.preferFlats);
  return newRoot + newSuffix + bassNote;
};

/**
 * Transpose a key signature such as "Eb", "F#m" or "Bmaj7".
 * The quality suffix is preserved verbatim.
 */
export const transposeKey = (
  key: string,
  semitones: number,
  options: TransposeOptions = {}
): string => {
  if (!key) return key;

  const normalized = normalizeAccidentals(key).trim();
  const match = normalized.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return key;

  const [, root, suffix] = match;
  return transposeNote(root, semitones, options.preferFlats) + suffix;
};

/**
 * Whether the key signature is on the flat side of the circle of fifths.
 *
 * Used to spell chords consistently: a song in Eb should not sprout C# chords
 * the moment it is transposed.
 */
export const keyPrefersFlats = (key?: string): boolean => {
  if (!key) return false;

  const match = normalizeAccidentals(key)
    .trim()
    .match(/^([A-G])([#b]?)(.*)$/);
  if (!match) return false;

  const [, letter, accidental, rest] = match;
  const base = FIFTHS[letter];
  if (base === undefined) return false;

  let fifths = base;
  if (accidental === '#') fifths += 7;
  else if (accidental === 'b') fifths -= 7;

  // A minor key shares the signature of its relative major, three fifths clockwise.
  if (/^m(?!aj)/i.test(rest.trim())) fifths -= 3;

  return fifths < 0;
};

const transposeNote = (note: string, semitones: number, preferFlats = false): string => {
  const index = SEMITONE_INDEX[note];
  if (index === undefined) return note;

  const newIndex = (((index + semitones) % 12) + 12) % 12;

  const useFlats = FLAT_SPELLED.has(note) || (!SHARP_SPELLED.has(note) && preferFlats);
  return useFlats ? FLAT_NAMES[newIndex] : SHARP_NAMES[newIndex];
};

/**
 * Transpose every `[Chord]` marker inside raw ChordPro text.
 * Used by the export button so a downloaded file matches what is on screen.
 */
export const transposeChordProContent = (
  content: string,
  semitones: number,
  options: TransposeOptions = {}
): string => {
  if (!content || semitones === 0) return content;

  return content.replace(/\[([^\]]+)\]/g, (match, chord: string) => {
    const transposed = transposeChord(chord, semitones, options);
    return transposed === chord ? match : `[${transposed}]`;
  });
};
