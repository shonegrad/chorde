import { describe, it, expect } from 'vitest';
import { suggestChords, chordsInKey, chordsOutsideKey, allChordNames } from '../chordSuggestions';

describe('suggesting chords', () => {
  it('offers the chords of the key first', () => {
    const chords = suggestChords('', 'G', 8);

    // The chords of G major, in the order they usually appear.
    expect(chords.slice(0, 4)).toEqual(['G', 'Am', 'Bm', 'C']);
  });

  it('offers the open shapes when there is no key yet', () => {
    const chords = suggestChords('', undefined, 12);

    expect(chords.length).toBeGreaterThan(0);
    expect(chords).toContain('C');
    expect(chords).toContain('G');
  });

  it('matches what has been typed', () => {
    const chords = suggestChords('m7', 'C', 10);

    expect(chords.length).toBeGreaterThan(0);
    expect(chords.every((chord) => chord.toLowerCase().includes('m7'))).toBe(true);
  });

  it('knows the chords of a flat key', () => {
    const chords = chordsInKey('Eb');

    expect(chords[0]).toBe('Eb');
    expect(chords).toContain('Cm');
    expect(chords).toContain('Bb');
  });

  it('knows the chords of a minor key', () => {
    const chords = chordsInKey('Am');

    expect(chords[0]).toBe('Am');
    expect(chords).toContain('Dm');
    expect(chords).toContain('Em');
  });

  it('has nothing to say about a key it does not know', () => {
    expect(chordsInKey('H')).toEqual([]);
    expect(chordsInKey('')).toEqual([]);
  });

  it('offers every chord in the library', () => {
    const names = allChordNames();

    expect(names).toContain('C');
    expect(names).toContain('Ebmaj7');
    expect(names).toContain('F#m7b5');
  });
});

describe('chords that do not fit the key', () => {
  it('finds a chord that is not in the key', () => {
    const outside = chordsOutsideKey('[G]Hello [Db]there', 'G');

    expect(outside).toEqual(['Db']);
  });

  it('says nothing when every chord fits', () => {
    expect(chordsOutsideKey('[G]Hello [C]there [D]friend', 'G')).toEqual([]);
  });

  it('says nothing when there is no key', () => {
    expect(chordsOutsideKey('[Db]Hello', undefined)).toEqual([]);
  });
});
