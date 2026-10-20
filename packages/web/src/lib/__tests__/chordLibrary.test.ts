import { describe, it, expect } from 'vitest';
import { CHORD_LIBRARY, getChord, normaliseChordName } from '../../data/chordLibrary';
import { pitchClassesOfShape, pitchClassOf } from '../guitar';
import { SEED_SONGS } from '../../data/seedSongs';
import { ROCK_PACK } from '../../data/rockPack';
import { ROCK_PACK_2 } from '../../data/rockPack2';
import { MIX_PACK } from '../../data/mixPack';

/**
 * The tones each chord quality is made of, counted in semitones from the
 * root. This is the reference the shapes are checked against.
 */
const CHORD_TONES: Record<string, number[]> = {
  '': [0, 4, 7],
  '5': [0, 7],
  m: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  '+': [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  '6': [0, 4, 7, 9],
  maj6: [0, 4, 7, 9],
  m6: [0, 3, 7, 9],
  '7': [0, 4, 7, 10],
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  mmaj7: [0, 3, 7, 11],
  dim7: [0, 3, 6, 9],
  m7b5: [0, 3, 6, 10],
  '9': [0, 4, 7, 10, 2],
  m9: [0, 3, 7, 10, 2],
  '9sus4': [0, 5, 7, 10, 2],
  add9: [0, 4, 7, 2],
  '11': [0, 4, 7, 10, 2, 5],
  m11: [0, 3, 7, 10, 2, 5],
  '7sus4': [0, 5, 7, 10],
  '7b5': [0, 4, 6, 10],
  '7b9': [0, 4, 7, 10, 1],
  '7b13': [0, 4, 7, 10, 8],
};

/**
 * Chords with no fixed set of notes. Only the root is checked for these.
 */
const IMPRECISE_QUALITIES = new Set(['7alt']);

interface ParsedName {
  root: string;
  quality: string;
  /** The note in the bass for a slash chord, e.g. the F# in D/F#. */
  bass?: string;
}

const parseChordName = (name: string): ParsedName => {
  // A slash chord: D/F#, Em/B, and the odd "Ebm7/Ab".
  const slash = name.match(/^([A-G][#b]?)([^/]*)\/(.+)$/);
  if (slash) {
    return { root: slash[1], quality: slash[2], bass: slash[3] };
  }

  const match = name.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return { root: name, quality: '' };
  return { root: match[1], quality: match[2] };
};

/** The qualities the library spells in more than one way. */
const normaliseQuality = (quality: string): string => quality.toLowerCase().replace(/[()]/g, '');

describe('the chord library', () => {
  it('gives every chord a shape we understand', () => {
    const unknown = Object.keys(CHORD_LIBRARY).filter((name) => {
      const { quality } = parseChordName(name);
      return !CHORD_TONES[normaliseQuality(quality)] && !IMPRECISE_QUALITIES.has(quality);
    });

    expect(unknown).toEqual([]);
  });

  it('plays the notes the chord is meant to play', () => {
    const problems: string[] = [];

    for (const [name, definition] of Object.entries(CHORD_LIBRARY)) {
      const { root, quality, bass } = parseChordName(name);

      if (IMPRECISE_QUALITIES.has(quality)) {
        // Only check that the root is there.
        definition.variations.forEach((variation, index) => {
          const played = pitchClassesOfShape(variation.frets);
          if (!played.includes(pitchClassOf(root))) {
            problems.push(`${name} variation ${index + 1}: the root is missing`);
          }
        });
        continue;
      }

      const expected = CHORD_TONES[normaliseQuality(quality)];
      if (!expected) continue;

      const rootPitch = pitchClassOf(root);
      const expectedPitches = expected.map((interval) => (rootPitch + interval) % 12);
      // The note in the bass of a slash chord may be outside the chord.
      if (bass) expectedPitches.push(pitchClassOf(bass));

      /*
       * A flat root is ambiguous: "Abm" is written with a major third (Ab C
       * Eb Gb) far more often than the theoretical minor third (Ab Cb Eb Gb).
       * Both are accepted, but the chord has to have one of them.
       */
      const flatRoot = root.includes('b');
      const alternativeThird = (rootPitch + 4) % 12;
      const allowed = new Set(expectedPitches);
      if (flatRoot) allowed.add(alternativeThird);

      const hasThird = expected.length > 2;
      const thirds = [expectedPitches[1]];
      if (flatRoot) thirds.push(alternativeThird);

      definition.variations.forEach((variation, index) => {
        const played = pitchClassesOfShape(variation.frets);
        const label = `${name} variation ${index + 1}`;

        if (played.length === 0) {
          problems.push(`${label}: plays nothing`);
          return;
        }

        for (const pitch of played) {
          if (!allowed.has(pitch)) {
            problems.push(`${label}: plays a note that is not in the chord`);
          }
        }

        // The third decides major against minor, so it has to be there.
        if (hasThird && !thirds.some((third) => played.includes(third))) {
          problems.push(`${label}: is missing the third`);
        }
      });
    }

    expect(problems).toEqual([]);
  });

  it('does not have two chords that differ only in spelling', () => {
    const seen = new Map<string, string>();
    const duplicates: string[] = [];

    for (const name of Object.keys(CHORD_LIBRARY)) {
      const key = name.toLowerCase();
      if (seen.has(key)) {
        duplicates.push(`${name} and ${seen.get(key)}`);
      } else {
        seen.set(key, name);
      }
    }

    expect(duplicates).toEqual([]);
  });
});

describe('finding a chord', () => {
  it('finds a chord however it is spelled', () => {
    expect(getChord('EbMaj7')?.name).toBe('Ebmaj7');
    expect(getChord('ebmaj7')?.name).toBe('Ebmaj7');
    expect(getChord('EBMaj7')?.name).toBe('Ebmaj7');
    expect(getChord('Cmin')?.name).toBe('Cm');
    expect(getChord('C min')?.name).toBe('Cm');
    expect(getChord('  C  ')?.name).toBe('C');
  });

  it('finds the chords that are written in an unusual way', () => {
    expect(getChord('Dbm6')?.name).toBe('Dbmaj6');
    expect(getChord('F#m7b5')?.name).toBe('F#m7b5');
    expect(getChord('C6')?.name).toBe('C6');
    expect(getChord('Abm7')?.name).toBe('Abm7');
  });

  it('has a diagram for every chord used in the songs', () => {
    const songs = [...SEED_SONGS, ...ROCK_PACK, ...ROCK_PACK_2, ...MIX_PACK];
    const used = new Set<string>();

    for (const song of songs) {
      for (const match of song.content.matchAll(/\[([^\]]+)\]/g)) {
        used.add(match[1]);
      }
    }

    const missing = [...used].filter((chord) => !getChord(chord));

    expect(missing).toEqual([]);
  });

  it('normalises a name the same way every time', () => {
    expect(normaliseChordName('EbMaj7')).toBe(normaliseChordName('ebmaj7'));
    expect(normaliseChordName('Cmin')).toBe('cm');
    expect(normaliseChordName('Bm(maj7)')).toBe('bmmaj7');
  });
});
