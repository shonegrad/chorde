import { describe, it, expect } from 'vitest';
import {
  detectKey,
  chordsOfKey,
  chordInKey,
  classifyChord,
  keyName,
  notesOfScale,
} from '../keyDetection';

describe('working out what a chord is', () => {
  it('reads the root and the quality', () => {
    expect(classifyChord('C')?.root).toBe(0);
    expect(classifyChord('C')?.quality).toBe('major');
    expect(classifyChord('Am')?.quality).toBe('minor');
    expect(classifyChord('C7')?.quality).toBe('dominant');
    expect(classifyChord('Cmaj7')?.quality).toBe('major');
    expect(classifyChord('Cm7')?.quality).toBe('minor');
    expect(classifyChord('Cdim7')?.quality).toBe('diminished');
    expect(classifyChord('C5')?.quality).toBe('power');
    expect(classifyChord('Csus4')?.quality).toBe('suspended');
  });

  it('reads a flat root', () => {
    expect(classifyChord('Bb')?.root).toBe(10);
    expect(classifyChord('Eb')?.root).toBe(3);
  });

  it('has nothing to say about nonsense', () => {
    expect(classifyChord('N.C.')).toBeNull();
  });
});

describe('working out the key of a song', () => {
  it('finds a major key', () => {
    const guess = detectKey(['G', 'C', 'G', 'D', 'G7', 'C', 'G', 'D', 'G']);

    expect(guess?.key).toBe('G');
    expect(guess?.mode).toBe('major');
    expect(guess?.confidence).toBeGreaterThan(0.7);
  });

  it('finds a minor key', () => {
    const guess = detectKey(['Am', 'Dm', 'E7', 'Am', 'F', 'C', 'Dm', 'E7', 'Am']);

    expect(guess?.mode).toBe('minor');
    expect(guess?.key).toBe('Am');
  });

  it('does not mistake a minor key for its relative major', () => {
    // These are the chords of Am, but the song never uses C, so it is not C
    // major.
    const guess = detectKey(['Am', 'F', 'Dm', 'E7', 'Am', 'F', 'E7']);

    expect(guess?.key).toBe('Am');
  });

  it('counts the chords at the start and the end for more', () => {
    const guess = detectKey(['Em', 'C', 'G', 'D', 'Em']);

    expect(guess?.key).toBe('Em');
  });

  it('says nothing when there are no chords', () => {
    expect(detectKey([])).toBeNull();
    expect(detectKey(['N.C.', 'N.C.'])).toBeNull();
  });

  it('offers the other keys that fit', () => {
    const guess = detectKey(['G', 'C', 'D', 'Em', 'G']);

    expect(guess?.alternatives.length).toBeGreaterThan(0);
    expect(guess?.alternatives[0].confidence).toBeLessThanOrEqual(guess!.confidence);
  });

  it('points out the chords that do not belong', () => {
    const guess = detectKey(['G', 'C', 'Eb', 'G', 'C', 'G']);

    expect(guess?.outside).toContain('Eb');
  });
});

describe('the chords of a key', () => {
  it('lists the chords of a major key', () => {
    const chords = chordsOfKey('G');

    expect(chords.map((chord) => chord.name)).toEqual(['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim']);
  });

  it('lists the chords of a minor key', () => {
    const chords = chordsOfKey('Am');

    expect(chords.map((chord) => chord.name)).toEqual(['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G']);
  });

  it('spells a flat key with flats', () => {
    expect(chordsOfKey('Bb')[0].name).toBe('Bb');
    expect(chordsOfKey('Bb')[1].name).toBe('Cm');
  });

  it('has nothing to say about a key it does not know', () => {
    expect(chordsOfKey('H')).toEqual([]);
  });
});

describe('where a chord sits in a key', () => {
  it('names the degree', () => {
    expect(chordInKey('C', 'G')?.degree).toBe('IV');
    expect(chordInKey('D', 'G')?.degree).toBe('V');
    expect(chordInKey('Em', 'G')?.degree).toBe('vi');
  });

  it('says when a chord does not fit', () => {
    const result = chordInKey('Eb', 'G');

    expect(result?.fits).toBe(false);
  });

  it('says when a chord fits', () => {
    expect(chordInKey('C', 'G')?.fits).toBe(true);
  });
});

describe('naming a key', () => {
  it('spells it the way it is written', () => {
    expect(keyName(7, 'major')).toBe('G');
    expect(keyName(9, 'minor')).toBe('Am');
    expect(keyName(10, 'major', true)).toBe('Bb');
  });
});

describe('the notes of a scale', () => {
  it('lists the notes of a major scale', () => {
    expect(notesOfScale('C')).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    expect(notesOfScale('G')).toEqual(['G', 'A', 'B', 'C', 'D', 'E', 'F#']);
  });

  it('lists the notes of a minor scale', () => {
    expect(notesOfScale('Am')).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
  });

  it('spells a flat key with flats', () => {
    expect(notesOfScale('Bb')).toEqual(['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A']);
  });

  it('has nothing to say about a key it does not know', () => {
    expect(notesOfScale('H')).toEqual([]);
  });
});
