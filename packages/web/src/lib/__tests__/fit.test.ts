import { describe, it, expect } from 'vitest';
import { chordFitsKey, songFitsKey } from '../fit';

describe('whether a chord belongs in a key', () => {
  it('knows the chords of a major key', () => {
    expect(chordFitsKey('C', 'C')).toBe(true);
    expect(chordFitsKey('Dm', 'C')).toBe(true);
    expect(chordFitsKey('Am', 'C')).toBe(true);
    expect(chordFitsKey('G7', 'C')).toBe(true);
    expect(chordFitsKey('Bb', 'C')).toBe(false);
    expect(chordFitsKey('F#', 'C')).toBe(false);
  });

  it('knows the chords of a minor key', () => {
    expect(chordFitsKey('Am', 'Am')).toBe(true);
    expect(chordFitsKey('Dm', 'Am')).toBe(true);
    // The dominant seventh of a minor key is a chord of it.
    expect(chordFitsKey('E7', 'Am')).toBe(true);
    // The seventh of the minor scale is in it, but a sharp is not.
    expect(chordFitsKey('G', 'Am')).toBe(true);
    expect(chordFitsKey('F#', 'Am')).toBe(false);
  });

  it('lets a secondary dominant stand', () => {
    // The dominant of the dominant sends you to the dominant for a bar, and
    // is still a chord of the key.
    expect(chordFitsKey('D7', 'C')).toBe(true);
    expect(chordFitsKey('A7', 'C')).toBe(true);
    expect(chordFitsKey('F#7', 'C')).toBe(false);
  });

  it('knows a flat key', () => {
    expect(chordFitsKey('Bb', 'Bb')).toBe(true);
    expect(chordFitsKey('Eb', 'Bb')).toBe(true);
    expect(chordFitsKey('Gm', 'Bb')).toBe(true);
    expect(chordFitsKey('F#m', 'Bb')).toBe(false);
  });

  it('says so about a name that is not a chord', () => {
    expect(chordFitsKey('N.C.', 'C')).toBe(false);
    expect(chordFitsKey('', 'C')).toBe(false);
    expect(chordFitsKey('C', '')).toBe(false);
  });
});

describe('whether a song belongs in a key', () => {
  it('is true when every chord is a chord of the key', () => {
    expect(songFitsKey(['C', 'G', 'Am', 'F'], 'C')).toBe(true);
  });

  it('is false when one chord is not', () => {
    expect(songFitsKey(['C', 'G', 'Bb'], 'C')).toBe(false);
  });

  it('copes with a chord the app cannot read', () => {
    expect(songFitsKey(['C', 'N.C.'], 'C')).toBe(false);
  });

  it('is false for a song with no chords', () => {
    expect(songFitsKey([], 'C')).toBe(false);
  });
});
