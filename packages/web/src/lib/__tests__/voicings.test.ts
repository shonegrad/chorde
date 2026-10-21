import { describe, it, expect } from 'vitest';
import {
  frequencyOfMidi,
  midiOf,
  midiOfFrequency,
  parseChordName,
  voicingForChord,
} from '../voicings';

describe('reading a chord name', () => {
  it('reads the root and the quality', () => {
    expect(parseChordName('Am7')).toEqual({
      root: 9,
      rootName: 'A',
      tones: [0, 3, 7, 10],
      steps: [0, 2, 4, 6],
      bass: undefined,
    });
    expect(parseChordName('C')).toEqual({
      root: 0,
      rootName: 'C',
      tones: [0, 4, 7],
      steps: [0, 2, 4],
      bass: undefined,
    });
    expect(parseChordName('Bbmaj7')).toEqual({
      root: 10,
      rootName: 'Bb',
      tones: [0, 4, 7, 11],
      steps: [0, 2, 4, 6],
      bass: undefined,
    });
  });

  it('reads the note in the bass of a slash chord', () => {
    expect(parseChordName('D/F#')).toEqual({
      root: 2,
      rootName: 'D',
      tones: [0, 4, 7],
      steps: [0, 2, 4],
      bass: 6,
    });
  });

  it('says so when a name is not a chord', () => {
    expect(parseChordName('N.C.')).toBeNull();
    expect(parseChordName('')).toBeNull();
    expect(parseChordName('---')).toBeNull();
  });

  it('plays a chord with an extra note as the chord it knows', () => {
    expect(parseChordName('Cmaj7#11')?.tones).toEqual([0, 4, 7, 11]);
  });
});

describe('the notes of a chord', () => {
  it('uses the shape from the chord library', () => {
    const voicing = voicingForChord('C');

    expect(voicing).not.toBeNull();
    // The open C shape: C3, E3, G3, C4, E4.
    expect(voicing?.map((note) => midiOfFrequency(note.frequency))).toEqual([48, 52, 55, 60, 64]);
  });

  it('numbers the strings from the lowest one', () => {
    const voicing = voicingForChord('C');

    expect(voicing?.map((note) => note.order)).toEqual([0, 1, 2, 3, 4]);
  });

  it('works out a chord the library does not have', () => {
    const voicing = voicingForChord('Abm');

    expect(voicing).not.toBeNull();
    const notes = voicing?.map((note) => midiOfFrequency(note.frequency)) ?? [];

    expect(notes).toHaveLength(3);
    // A flat, the flattened third, and E flat.
    expect(notes.map((note) => note % 12)).toEqual([8, 11, 3]);
  });

  it('puts a chord where a guitar can reach it', () => {
    const voicing = voicingForChord('Abm');

    const notes = voicing?.map((note) => midiOfFrequency(note.frequency)) ?? [];
    const lowest = Math.min(...notes);

    expect(lowest).toBeGreaterThanOrEqual(40);
    expect(lowest).toBeLessThanOrEqual(56);
  });

  it('plays a ninth above the root rather than a second', () => {
    const voicing = voicingForChord('Cmaj9');

    const notes = voicing?.map((note) => midiOfFrequency(note.frequency)) ?? [];

    // Root, third, fifth, seventh and the ninth a whole tone above the octave.
    expect(notes.map((note) => note % 12)).toEqual([0, 4, 7, 11, 2]);
    expect(Math.max(...notes) - Math.min(...notes)).toBeGreaterThanOrEqual(14);
  });

  it('puts the bass note of a slash chord underneath', () => {
    const voicing = voicingForChord('D/F#');

    const notes = voicing?.map((note) => midiOfFrequency(note.frequency)) ?? [];

    // The D shape with an F# under it.
    expect(notes[0] % 12).toBe(6);
    expect(notes[0]).toBeLessThan(notes[1]);
    expect(notes.map((note) => note % 12)).toContain(2);
  });

  it('raises every note by the capo', () => {
    const plain = voicingForChord('C');
    const capped = voicingForChord('C', { capo: 2 });

    expect(capped).not.toBeNull();
    plain?.forEach((note, index) => {
      expect(midiOfFrequency(capped![index].frequency)).toBe(midiOfFrequency(note.frequency) + 2);
    });
  });

  it('says so when a name is not a chord', () => {
    expect(voicingForChord('N.C.')).toBeNull();
  });

  it('plays the same note at the same frequency', () => {
    expect(frequencyOfMidi(midiOf(0, 4))).toBeCloseTo(261.63, 2);
  });
});
