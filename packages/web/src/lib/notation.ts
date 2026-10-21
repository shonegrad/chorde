import { pitchClassOf } from './guitar';
import { notesOfScale } from './keyDetection';
import { parseChordName } from './voicings';
import { getChord } from '../data/chordLibrary';

/**
 * Working out how a chord is written down.
 *
 * A chord name says which notes belong together but not how they are spelled.
 * The seventh of a chord is the seventh letter, so a minor seventh is a
 * flattened seventh and not a sharpened sixth: that is why the chord on B
 * flat in B flat major is B flat, D and F, and never A sharp, D and F. The
 * key signature says which sharps and flats are already in the key, so the
 * notes that are spelled differently from the key are the ones that get an
 * accidental.
 */

/** The letters of the scale, and how many semitones above C each one is. */
const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const LETTER_SEMITONES = [0, 2, 4, 5, 7, 9, 11];

export interface NotationNote {
  /** The note as it is written, for example "Bb". */
  name: string;
  /** How many semitones above C. */
  pitchClass: number;
  /** The octave, where 4 is the octave of middle C. */
  octave: number;
  /** The note in the way VexFlow writes it, for example "Bb/4". */
  key: string;
}

export interface TabPosition {
  /** The string, where 1 is the highest and 6 the lowest. */
  str: number;
  /** The fret, where 0 is an open string. */
  fret: number;
  /** Whether the string is not played at all. */
  muted: boolean;
}

/** The keys that exist, and the ones that are written as their twin. */
const SHARP_KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'];
const FLAT_KEYS = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];
const KEY_TWINS: Record<string, string> = {
  'D#': 'Eb',
  'G#': 'Ab',
  'A#': 'Bb',
  'E#': 'F',
  'B#': 'C',
  'F##': 'G',
};

/**
 * The name of a key as VexFlow wants it, for example "Bb" or "Am".
 *
 * VexFlow draws the key signature from the name of the key, and it only
 * knows the keys that exist. A key that does not exist, such as A sharp
 * major, is written as the key it is the twin of.
 */
export const keySignatureName = (key?: string): string | undefined => {
  if (!key) return undefined;

  const trimmed = key.trim();
  if (!trimmed) return undefined;

  const match = trimmed.match(/^([A-G][#b]?)(m|min|minor)?$/i);
  if (!match) return trimmed;

  const root = match[1];
  const mode = match[2] ? 'm' : '';

  if (SHARP_KEYS.includes(root) || FLAT_KEYS.includes(root)) return root + mode;

  return (KEY_TWINS[root] ?? root) + mode;
};

/**
 * The notes of a chord, spelled the way a musician writes them.
 *
 * The chord is placed around the bottom of the treble staff, so it does not
 * need ledger lines, and the notes climb from there.
 */
export const notesOfChord = (chord: string): NotationNote[] => {
  const parsed = parseChordName(chord);
  if (!parsed) return [];

  const rootPitch = pitchClassOf(parsed.rootName);
  if (rootPitch < 0) return [];

  const rootLetter = LETTERS.indexOf(parsed.rootName[0].toUpperCase());
  if (rootLetter < 0) return [];

  // The root is put near the bottom of the treble staff: middle C and up to
  // the B above it.
  const rootMidi = 60 + rootPitch;

  return parsed.tones.map((tone, index) => {
    const midi = rootMidi + tone;
    const pitchClass = ((midi % 12) + 12) % 12;
    const octave = Math.floor(midi / 12) - 1;

    // The letter comes from how far up the scale the note is, and the
    // accidental from how many semitones it is above that letter.
    const step = parsed.steps[index] ?? index * 2;
    const letterIndex = (rootLetter + step) % 7;
    const letter = LETTERS[letterIndex];

    let difference = pitchClass - LETTER_SEMITONES[letterIndex];
    if (difference > 6) difference -= 12;
    if (difference < -6) difference += 12;

    const name =
      difference === 0
        ? letter
        : difference === 1
          ? `${letter}#`
          : difference === -1
            ? `${letter}b`
            : difference === 2
              ? `${letter}##`
              : difference === -2
                ? `${letter}bb`
                : letter;

    return { name, pitchClass, octave, key: `${name}/${octave}` };
  });
};

/**
 * The notes of a chord as they are written, for example "B♭ D F".
 */
export const spellingOfChord = (chord: string): string =>
  notesOfChord(chord)
    .map((note) => note.name)
    .join(' ');

/**
 * How many sharps or flats the key signature has.
 *
 * It is how much room the key signature takes on the stave.
 */
export const accidentalsInKey = (key?: string): number => {
  if (!key) return 0;

  const fifths: Record<string, number> = {
    C: 0,
    G: 1,
    D: 2,
    A: 3,
    E: 4,
    B: 5,
    'F#': 6,
    'C#': 7,
    F: -1,
    Bb: -2,
    Eb: -3,
    Ab: -4,
    Db: -5,
    Gb: -6,
    Cb: -7,
  };

  const match = key.trim().match(/^([A-G][#b]?)/);
  if (!match) return 0;

  const count = fifths[match[1]] ?? 0;
  return Math.abs(count);
};

/**
 * Where a shape is played on the guitar, as tablature.
 *
 * The strings are numbered from the highest, so the low E is the sixth, the
 * way tablature is written.
 */
export const tabPositionsOfShape = (frets: (number | 'x')[]): TabPosition[] =>
  frets.map((fret, index) => ({
    str: frets.length - index,
    fret: typeof fret === 'number' ? fret : 0,
    muted: fret === 'x',
  }));

/**
 * The shape of a chord, from the chord library.
 *
 * The first shape is the one a player would reach for.
 */
export const shapeOfChord = (chord: string): (number | 'x')[] | undefined =>
  getChord(chord)?.variations[0]?.frets;

/**
 * The notes of the key, for showing the key a chord belongs to.
 */
export { notesOfScale };
