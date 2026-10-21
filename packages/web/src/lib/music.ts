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

/** The letters of the scale, and how many semitones above C each one is. */
const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const LETTER_SEMITONES = [0, 2, 4, 5, 7, 9, 11];

/**
 * How many letters a move of so many semitones takes.
 *
 * A tone takes one letter, a third two, a fourth three, a fifth four, and
 * so on. A tritone is the odd one out: going up it is an augmented fourth
 * and keeps the letter three steps along, and going down it is a diminished
 * fifth and goes four.
 */
const letterSteps = (semitones: number): number => {
  const steps = Math.abs(semitones);
  if (steps <= 2) return 1;
  if (steps <= 4) return 2;
  if (steps === 5) return 3;
  if (steps === 6) return semitones > 0 ? 3 : 4;
  if (steps === 7) return 4;
  if (steps <= 9) return 5;
  if (steps <= 11) return 6;
  return 7;
};

/**
 * Move a note by so many semitones, keeping the spelling right.
 *
 * A note moves by the interval: the letter steps across and the accidental
 * follows from the note it lands on. That is why C up a minor third is E
 * flat and not D sharp, and why C down a tone is B flat and not A sharp.
 *
 * A semitone is the exception, because it can be an augmented first, which
 * keeps the letter, or a minor second, which moves it. The key decides
 * which, so a semitone keeps the old rule.
 */
const transposeNote = (note: string, semitones: number, preferFlats = false): string => {
  const index = SEMITONE_INDEX[note];
  if (index === undefined) return note;

  const newIndex = (((index + semitones) % 12) + 12) % 12;

  if (Math.abs(semitones) === 1) {
    const useFlats = FLAT_SPELLED.has(note) || (!SHARP_SPELLED.has(note) && preferFlats);
    return useFlats ? FLAT_NAMES[newIndex] : SHARP_NAMES[newIndex];
  }

  if (semitones === 0) return note;

  const letterIndex = LETTERS.indexOf(note[0].toUpperCase());
  if (letterIndex < 0) return note;

  const steps = letterSteps(semitones) * Math.sign(semitones);
  const newLetterIndex = (((letterIndex + steps) % 7) + 7) % 7;
  const newLetter = LETTERS[newLetterIndex];

  let difference = newIndex - LETTER_SEMITONES[newLetterIndex];
  if (difference > 6) difference -= 12;
  if (difference < -6) difference += 12;

  if (difference === 0) return newLetter;
  if (difference === 1) return `${newLetter}#`;
  if (difference === -1) return `${newLetter}b`;
  if (difference === 2) return `${newLetter}##`;
  if (difference === -2) return `${newLetter}bb`;

  // A double accidental beyond that is written the other way round.
  return difference > 0 ? `${newLetter}#`.repeat(difference) : `${newLetter}b`.repeat(-difference);
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
