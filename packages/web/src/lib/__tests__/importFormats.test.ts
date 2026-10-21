import { describe, it, expect } from 'vitest';
import { convertCrdToChordPro, isSupportedFileName, titleFromFileName } from '../importFormats';
import { parseChordPro } from '../chordPro';

const chordsOf = (content: string): (string | undefined)[] =>
  parseChordPro(content).flatMap((line) => line.items.map((item) => item.chord));

describe('the files the app can read', () => {
  it('reads the formats it says it does', () => {
    expect(isSupportedFileName('song.cho')).toBe(true);
    expect(isSupportedFileName('song.onsong')).toBe(true);
    expect(isSupportedFileName('song.onsongpro')).toBe(true);
    expect(isSupportedFileName('song.crd')).toBe(true);
    expect(isSupportedFileName('song.chordpro')).toBe(true);
    expect(isSupportedFileName('song.txt')).toBe(true);
    expect(isSupportedFileName('song.pdf')).toBe(false);
    expect(isSupportedFileName('song')).toBe(false);
  });

  it('takes the title from the name of the file', () => {
    expect(titleFromFileName('Amazing_Grace.cho')).toBe('Amazing Grace');
    expect(titleFromFileName('my-song.txt')).toBe('my song');
  });
});

describe('reading a legacy ChordPro file', () => {
  it('puts the chords over the words they belong to', () => {
    // The chords are in a line of their own, and they line up with the words
    // by their place in the line.
    const lyric = 'This is the lyric line';
    const chordLine = '       C' + ' '.repeat(10) + 'G';

    const content = ['{title: Test}', '', 'Verse 1:', chordLine, lyric].join('\n');
    const chordPro = convertCrdToChordPro(content, 'test.crd');

    // "C" is over "the" and "G" is over "line".
    expect(chordPro).toContain('[C]the');
    expect(chordPro).toContain('[G]line');
  });

  it('turns a section into a section', () => {
    const content = ['{title: Test}', '', 'Chorus 2:', 'Words here'].join('\n');

    const chordPro = convertCrdToChordPro(content, 'test.crd');

    expect(chordPro).toContain('{start_of_chorus2}');
    const sections = parseChordPro(chordPro).flatMap((line) =>
      line.section ? [line.section] : []
    );
    expect(sections[0].label).toBe('Chorus 2');
  });

  it('names the song after the file when the file has no title', () => {
    const chordPro = convertCrdToChordPro('Words here', 'Amazing_Grace.crd');

    expect(chordPro).toContain('{title: Amazing Grace}');
  });

  it('keeps a title the file already has', () => {
    const chordPro = convertCrdToChordPro('{title: Given}\nWords', 'other.crd');

    expect(chordPro).toContain('{title: Given}');
  });

  it('does not mistake a line of words for a line of chords', () => {
    const content = ['{title: Test}', '', 'Amazing grace how sweet'].join('\n');

    const chordPro = convertCrdToChordPro(content, 'test.crd');

    expect(chordPro).toContain('Amazing grace how sweet');
    expect(chordsOf(chordPro)).toEqual([undefined]);
  });
});
