/**
 * Working out what a chord shape actually plays.
 *
 * A guitar shape is a list of fret numbers, one per string, from the low E to
 * the high e. This turns those into the notes that sound, so a shape can be
 * checked rather than trusted.
 */

export const STANDARD_TUNING = [
  { note: 'E', octave: 2 },
  { note: 'A', octave: 2 },
  { note: 'D', octave: 3 },
  { note: 'G', octave: 3 },
  { note: 'B', octave: 3 },
  { note: 'E', octave: 4 },
] as const;

/** Semitones above C for each natural note. */
const SEMITONES: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

export interface PlayedNote {
  /** The note name, using sharps. */
  note: string;
  /** How many semitones above the root of the octave, e.g. 0 is C. */
  pitchClass: number;
  /** The string it was played on, 0 is the low E. */
  string: number;
  /** The fret it was played at, or null for a muted string. */
  fret: number | null;
  /** The octave of the note. */
  octave: number;
}

const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/** The pitch class of a note name, in sharps. */
export const pitchClassOf = (note: string): number => {
  const match = note.match(/^([A-G])([#b]?)/);
  if (!match) return -1;

  const [, letter, accidental] = match;
  const base = SEMITONES[letter];
  if (base === undefined) return -1;

  return (base + (accidental === '#' ? 1 : accidental === 'b' ? -1 : 0) + 12) % 12;
};

/**
 * The notes a shape plays, lowest string first.
 *
 * Muted strings ('x') and open strings (0) are included, because they decide
 * whether a shape is playable.
 */
export const notesOfShape = (frets: (number | 'x')[]): PlayedNote[] => {
  const notes: PlayedNote[] = [];

  frets.forEach((fret, string) => {
    if (fret === 'x') return;

    const open = STANDARD_TUNING[string];
    const pitchClass = (pitchClassOf(open.note) + fret) % 12;
    const octave = open.octave + Math.floor((pitchClassOf(open.note) + fret) / 12);

    notes.push({
      note: SHARP_NAMES[pitchClass],
      pitchClass,
      string,
      fret,
      octave,
    });
  });

  return notes;
};

/** The pitch classes a shape plays, without duplicates, in order. */
export const pitchClassesOfShape = (frets: (number | 'x')[]): number[] => {
  const seen = new Set<number>();
  const order: number[] = [];

  for (const note of notesOfShape(frets)) {
    if (!seen.has(note.pitchClass)) {
      seen.add(note.pitchClass);
      order.push(note.pitchClass);
    }
  }

  return order;
};
