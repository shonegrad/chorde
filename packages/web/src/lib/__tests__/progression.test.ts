import { describe, it, expect } from 'vitest';
import { beatsPerBar, buildProgression, extractProgression } from '../progression';
import { midiOfFrequency } from '../voicings';

/** A line of a song, with the chords written over the words. */
const line = (...items: Array<{ lyric: string; chord?: string }>) => ({ items });

describe('the chords of a song', () => {
  it('reads the chords in the order they appear', () => {
    const lines = [
      line({ lyric: 'C', chord: 'C' }, { lyric: 'on', chord: 'G' }),
      line({ lyric: 'the', chord: 'Am' }, { lyric: 'road', chord: 'F' }),
    ];

    expect(extractProgression(lines)).toEqual(['C', 'G', 'Am', 'F']);
  });

  it('keeps a chord once when it follows itself', () => {
    const lines = [
      line({ lyric: 'C', chord: 'C' }, { lyric: 'and', chord: 'C' }),
      line({ lyric: 'G', chord: 'G' }),
    ];

    expect(extractProgression(lines)).toEqual(['C', 'G']);
  });

  it('keeps a chord that comes back later', () => {
    const lines = [
      line({ lyric: 'C', chord: 'C' }),
      line({ lyric: 'G', chord: 'G' }),
      line({ lyric: 'C', chord: 'C' }),
    ];

    expect(extractProgression(lines)).toEqual(['C', 'G', 'C']);
  });

  it('ignores the words', () => {
    const lines = [line({ lyric: 'hello' }, { lyric: 'world', chord: 'D' })];

    expect(extractProgression(lines)).toEqual(['D']);
  });

  it('has nothing to play in a song without chords', () => {
    expect(extractProgression([line({ lyric: 'hello' })])).toEqual([]);
  });
});

describe('playing the chords of a song', () => {
  it('gives the notes each chord plays', () => {
    const lines = [line({ lyric: 'C', chord: 'C' }), line({ lyric: 'G', chord: 'G' })];

    const progression = buildProgression(lines);

    expect(progression.map((chord) => chord.name)).toEqual(['C', 'G']);
    progression.forEach((chord) => {
      expect(chord.notes.length).toBeGreaterThan(0);
    });
  });

  it('leaves out a chord it cannot play', () => {
    const lines = [line({ lyric: 'nothing', chord: 'N.C.' }), line({ lyric: 'C', chord: 'C' })];

    expect(buildProgression(lines).map((chord) => chord.name)).toEqual(['C']);
  });

  it('moves the chords up the neck when a capo is used', () => {
    const lines = [line({ lyric: 'C', chord: 'C' })];

    const plain = buildProgression(lines)[0].notes.map((note) => midiOfFrequency(note.frequency));
    const capped = buildProgression(lines, { capo: 3 })[0].notes.map((note) =>
      midiOfFrequency(note.frequency)
    );

    capped.forEach((note, index) => {
      expect(note).toBe(plain[index] + 3);
    });
  });
});

describe('the beats in a bar', () => {
  it('reads the time signature of the song', () => {
    expect(beatsPerBar('3/4')).toBe(3);
    expect(beatsPerBar('6/8')).toBe(6);
  });

  it('takes a song without a time signature to be in four four', () => {
    expect(beatsPerBar(undefined)).toBe(4);
    expect(beatsPerBar('')).toBe(4);
    expect(beatsPerBar('nonsense')).toBe(4);
  });
});
