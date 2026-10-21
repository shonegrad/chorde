import { describe, it, expect } from 'vitest';
import { convertOnSongToChordPro } from '../onsong';

describe('reading an OnSong file', () => {
  it('reads the title, the artist, the key and the capo', () => {
    const content = [
      'Title: Amazing Grace',
      'Artist: John Newton',
      'Key: G',
      'Capo: 2',
      'CCLI: 12345',
      '',
      'Verse 1:',
      '[G]Amazing [C]grace how sweet',
    ].join('\n');

    const chordPro = convertOnSongToChordPro(content, 'Amazing_Grace.onsong');

    expect(chordPro).toContain('{title: Amazing Grace}');
    expect(chordPro).toContain('{artist: John Newton}');
    expect(chordPro).toContain('{key: G}');
    expect(chordPro).toContain('{capo: 2}');
    expect(chordPro).not.toContain('CCLI');
  });

  it('turns the sections into sections', () => {
    const content = ['Verse 1:', '[G]Words', 'Chorus:', '[C]More words'].join('\n');

    const chordPro = convertOnSongToChordPro(content, 'test.onsong');

    expect(chordPro).toContain('{start_of_verse1}');
    expect(chordPro).toContain('{start_of_chorus}');
    expect(chordPro).toContain('{end_of_verse1}');
  });

  it('names the song after the file when the file has no title', () => {
    const chordPro = convertOnSongToChordPro('[G]Words', 'Amazing_Grace.onsong');

    expect(chordPro).toContain('{title: Amazing Grace}');
  });

  it('keeps the chords as they were written', () => {
    const chordPro = convertOnSongToChordPro('[G]Amazing [C]grace', 'test.onsong');

    expect(chordPro).toContain('[G]Amazing [C]grace');
  });
});
