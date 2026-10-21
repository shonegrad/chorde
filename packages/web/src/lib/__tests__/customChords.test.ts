import { describe, it, expect, beforeEach } from 'vitest';
import { getChord } from '../../data/chordLibrary';
import {
  deleteCustomChord,
  getCustomChords,
  saveCustomChord,
  useCustomChords,
} from '../customChords';

const shape = {
  frets: ['x', 3, 5, 5, 5, 3] as (number | 'x')[],
  fingers: ['x', 2, 3, 3, 3, 2] as (number | 'x')[],
};

describe("the player's own shapes", () => {
  beforeEach(() => {
    localStorage.clear();
    deleteCustomChord('Fmaj7');
  });

  it('keeps a shape the player has drawn', () => {
    saveCustomChord('Fmaj7', shape);

    expect(getCustomChords()).toHaveLength(1);
    expect(getCustomChords()[0].name).toBe('Fmaj7');
  });

  it("draws the player's shape for that chord", () => {
    saveCustomChord('Fmaj7', shape);

    const chord = getChord('Fmaj7');

    expect(chord).not.toBeNull();
    expect(chord?.variations[0].frets).toEqual(shape.frets);
  });

  it('changes the shape of a chord the library has', () => {
    const before = getChord('C')?.variations[0].frets;

    saveCustomChord('C', shape);

    expect(getChord('C')?.variations[0].frets).toEqual(shape.frets);
    expect(before).not.toEqual(shape.frets);

    // And the library's own shape comes back when the player's is taken away.
    deleteCustomChord('C');
    expect(getChord('C')?.variations[0].frets).toEqual(before);
  });

  it('changes a shape the player already has, rather than adding a second one', () => {
    saveCustomChord('Fmaj7', shape);
    saveCustomChord('Fmaj7', { ...shape, frets: [1, 3, 3, 2, 1, 1] });

    expect(getCustomChords()).toHaveLength(1);
    expect(getChord('Fmaj7')?.variations[0].frets).toEqual([1, 3, 3, 2, 1, 1]);
  });

  it('takes a shape away', () => {
    saveCustomChord('Fmaj7', shape);
    deleteCustomChord('Fmaj7');

    expect(getCustomChords()).toHaveLength(0);
    expect(getChord('Fmaj7')).toBeNull();
  });

  it('is a hook, so that the browser can follow it', () => {
    expect(typeof useCustomChords).toBe('function');
  });
});
