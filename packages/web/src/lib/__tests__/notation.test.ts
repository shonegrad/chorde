import { describe, it, expect } from 'vitest';
import { notesOfChord, shapeOfChord, spellingOfChord, tabPositionsOfShape } from '../notation';

describe('the notes of a chord', () => {
  it('writes a flat key with flats', () => {
    // The chord on B flat in B flat major is B flat, D and F.
    expect(spellingOfChord('Bb')).toBe('Bb D F');
  });

  it('writes the seventh of a chord as a seventh', () => {
    // The seventh of C is B flat, never A sharp.
    expect(spellingOfChord('C7')).toBe('C E G Bb');
  });

  it('writes the notes of a major chord', () => {
    expect(spellingOfChord('C')).toBe('C E G');
    expect(spellingOfChord('F')).toBe('F A C');
  });

  it('writes the notes of a minor chord', () => {
    expect(spellingOfChord('Am')).toBe('A C E');
    expect(spellingOfChord('Am7')).toBe('A C E G');
  });

  it('writes a chord with sharps in sharps', () => {
    expect(spellingOfChord('F#')).toBe('F# A# C#');
  });

  it('writes a diminished chord as a diminished chord', () => {
    expect(spellingOfChord('Bdim')).toBe('B D F');
  });

  it('puts the chord on the staff', () => {
    const notes = notesOfChord('C');

    // Middle C and up, so the chord does not need ledger lines.
    expect(notes[0].octave).toBe(4);
    expect(notes.map((note) => note.pitchClass)).toEqual([0, 4, 7]);
  });

  it('has nothing to say about a name that is not a chord', () => {
    expect(notesOfChord('N.C.')).toEqual([]);
    expect(notesOfChord('')).toEqual([]);
  });
});

describe('the shape of a chord', () => {
  it('is played on the strings, from the highest down', () => {
    const positions = tabPositionsOfShape(['x', 3, 2, 0, 1, 0]);

    expect(positions.map((position) => position.str)).toEqual([6, 5, 4, 3, 2, 1]);
    expect(positions.map((position) => position.fret)).toEqual([0, 3, 2, 0, 1, 0]);
    expect(positions[0].muted).toBe(true);
    expect(positions[1].muted).toBe(false);
  });

  it('comes from the chord library', () => {
    expect(shapeOfChord('C')).toEqual(['x', 3, 2, 0, 1, 0]);
    expect(shapeOfChord('N.C.')).toBeUndefined();
  });
});
