import { describe, it, expect } from 'vitest';
import {
  parseChordPro,
  extractMetadata,
  resolveSectionLabel,
  splitChordProSongs,
} from './chordPro';

describe('extractMetadata', () => {
  it('reads the title, artist, key and capo', () => {
    const metadata = extractMetadata(
      '{title: Amazing Grace}\n{artist: John Newton}\n{key: G}\n{capo: 2}'
    );

    expect(metadata.title).toBe('Amazing Grace');
    expect(metadata.artist).toBe('John Newton');
    expect(metadata.key).toBe('G');
    expect(metadata.capo).toBe(2);
  });

  it('prefers an explicit artist over a subtitle', () => {
    const metadata = extractMetadata('{title: Test}\n{artist: The Artist}\n{subtitle: A credit}');
    expect(metadata.artist).toBe('The Artist');
  });

  it('falls back to the subtitle when there is no artist', () => {
    const metadata = extractMetadata('{title: Test}\n{subtitle: A credit}');
    expect(metadata.artist).toBe('A credit');
  });

  it('reads the tempo and time signature', () => {
    const metadata = extractMetadata('{title: Test}\n{tempo: 96 bpm}\n{time: 3/4}');
    expect(metadata.tempo).toBe(96);
    expect(metadata.timeSignature).toBe('3/4');
  });

  it('falls back to sensible defaults', () => {
    const metadata = extractMetadata('[C]No metadata here');
    expect(metadata.title).toBe('Untitled Song');
    expect(metadata.artist).toBe('Unknown Artist');
    expect(metadata.key).toBeUndefined();
  });
});

describe('parseChordPro section labels', () => {
  const labelOf = (content: string): string | undefined =>
    parseChordPro(content)[0]?.section?.label;

  it('keeps the number of a numbered chorus', () => {
    const content = '{start_of_chorus1}\n[G]One\n{start_of_chorus2}\n[G]Two';
    const parsed = parseChordPro(content);

    expect(parsed[0].section?.label).toBe('Chorus 1');
    expect(parsed[1].section?.label).toBe('Chorus 2');
  });

  it('keeps the number of a numbered verse', () => {
    expect(labelOf('{start_of_verse2}\n[G]Two')).toBe('Verse 2');
  });

  it('numbers repeated sections automatically', () => {
    const content = '{start_of_chorus}\n[G]One\n{start_of_chorus}\n[G]Two';
    const parsed = parseChordPro(content);

    expect(parsed[0].section?.label).toBe('Chorus 1');
    expect(parsed[1].section?.label).toBe('Chorus 2');
  });

  it('uses a custom label when one is given', () => {
    expect(labelOf('{start_of_chorus: The Final Chorus}\n[G]One')).toBe('The Final Chorus');
  });

  it('does not confuse the section type with a custom label', () => {
    // "Verse 2" inside the custom label must not turn a chorus into a verse.
    const parsed = parseChordPro('{start_of_chorus: Verse 2}\n[G]One');
    expect(parsed[0].section?.type).toBe('chorus');
    expect(parsed[0].section?.label).toBe('Verse 2');
  });

  it('handles the short form directives', () => {
    expect(labelOf('{sov}\n[G]One')).toBe('Verse 1');
    expect(labelOf('{soc}\n[G]One')).toBe('Chorus 1');
    expect(labelOf('{sob}\n[G]One')).toBe('Bridge 1');
    expect(labelOf('{soi}\n[G]One')).toBe('Intro');
    expect(labelOf('{soo}\n[G]One')).toBe('Outro');
  });

  it('labels tab sections', () => {
    const parsed = parseChordPro('{start_of_tab}\n[G]One');
    expect(parsed[0].section?.type).toBe('tab');
    expect(parsed[0].section?.label).toBe('Tab');
  });

  it('keeps a section type it does not know, so that it is not lost', () => {
    const parsed = parseChordPro('{start_of_nonsense}\n[G]One');

    expect(parsed).toHaveLength(2);
    expect(parsed[0].annotation?.kind).toBe('unknown');
    expect(parsed[0].annotation?.text).toBe('{start_of_nonsense}');
    expect(parsed[1].section).toBeUndefined();
  });
});

describe('parseChordPro and the words on a directive line', () => {
  it('keeps the words that share a line with a section', () => {
    const parsed = parseChordPro('{start_of_verse} [C]Some words');

    expect(parsed).toHaveLength(1);
    expect(parsed[0].section?.type).toBe('verse');
    expect(parsed[0].items[1].chord).toBe('C');
    expect(parsed[0].items[1].lyric).toBe('Some words');
  });

  it('keeps a directive it does not know', () => {
    const parsed = parseChordPro('{something_new: hello}\n[G]One');

    expect(parsed[0].annotation?.kind).toBe('unknown');
    expect(parsed[0].annotation?.text).toBe('{something_new: hello}');
  });

  it('keeps a comment as a comment', () => {
    const parsed = parseChordPro('{comment: play quietly}\n[G]One');

    expect(parsed[0].annotation?.kind).toBe('comment');
    expect(parsed[0].annotation?.text).toBe('play quietly');
  });

  it('reads a short comment as a comment, not as a capo', () => {
    const parsed = parseChordPro('{c: play quietly}\n[G]One');

    expect(parsed[0].annotation?.kind).toBe('comment');
    expect(parsed[0].annotation?.text).toBe('play quietly');
  });

  it('still reads a short capo as a capo', () => {
    const parsed = parseChordPro('{c: 2}\n[G]One');

    expect(parsed[0].annotation).toBeUndefined();
    expect(parsed[0].items[0].chord).toBe('G');
  });

  it('keeps a chord grid as a grid', () => {
    const parsed = parseChordPro('{gc: Am7}\n[G]One');

    expect(parsed[0].annotation?.kind).toBe('grid');
    expect(parsed[0].annotation?.chords).toEqual(['Am7']);
  });

  it('keeps a row of chords as one grille', () => {
    const parsed = parseChordPro('{gc: Am} {gc: D7} {gc: G7}\n[G]One');

    expect(parsed[0].annotation?.kind).toBe('grid');
    expect(parsed[0].annotation?.chords).toEqual(['Am', 'D7', 'G7']);
  });

  it('does not show the directives that are about the song', () => {
    const parsed = parseChordPro('{title: Test}\n{key: G}\n[G]One');

    expect(parsed).toHaveLength(1);
    expect(parsed[0].items[0].lyric).toBe('One');
  });
});

describe('parseChordPro and the blocks', () => {
  it('keeps a block of tablature as it is', () => {
    const parsed = parseChordPro('{start_of_tab}\ne|--0--|\n{end_of_tab}\n[G]One');

    expect(parsed[0].annotation?.kind).toBe('tab');
    expect(parsed[0].annotation?.raw).toBe('e|--0--|');
    expect(parsed[0].section?.type).toBe('tab');
    expect(parsed[1].items[0].lyric).toBe('One');
  });

  it('keeps a block of chords on lines of their own', () => {
    const parsed = parseChordPro('{-\nC   G   Am\n-}\n[G]One');

    expect(parsed[0].annotation?.kind).toBe('chords');
    expect(parsed[0].annotation?.chords).toEqual(['C', 'G', 'Am']);
    expect(parsed[1].items[0].lyric).toBe('One');
  });
});

describe('parseChordPro and where things sit in a line', () => {
  it('keeps both chords when two are written over the same word', () => {
    const parsed = parseChordPro('[C][G]Words');

    expect(parsed[0].items.map((item) => item.chord)).toEqual(['C', 'G']);
  });

  it('says where a chord sits in the line', () => {
    const parsed = parseChordPro('Some[Am]thing else');

    // The chord is written over "thing", which starts at the fifth character
    // of the words.
    expect(parsed[0].items[1].chord).toBe('Am');
    expect(parsed[0].items[1].column).toBe(4);
  });

  it('counts the words, not the brackets', () => {
    const parsed = parseChordPro('[C]Hello [G]world');

    expect(parsed[0].items[0].column).toBe(0);
    expect(parsed[0].items[1].column).toBe(6);
  });
});

describe('parseChordPro and the definitions', () => {
  it('plays a chord that was defined under another name', () => {
    const parsed = parseChordPro('{define: Am A minor}\n[Am]Words');

    expect(parsed[0].items[0].chord).toBe('A minor');
  });

  it('puts a defined word back into the words', () => {
    const parsed = parseChordPro('{define: forever and ever}\n[C]Sing forever now');

    expect(parsed[0].items[0].lyric).toBe('Sing and ever now');
  });

  it('leaves a word alone when it is part of a longer word', () => {
    const parsed = parseChordPro('{define: sing sing}\n[C]singing');

    expect(parsed[0].items[0].lyric).toBe('singing');
  });

  it('does not show the definition itself', () => {
    const parsed = parseChordPro('{define: Am A minor}\n[C]Words');

    expect(parsed).toHaveLength(1);
    expect(parsed[0].annotation).toBeUndefined();
  });
});

describe('splitChordProSongs', () => {
  it('leaves a file with one song in it alone', () => {
    const content = '{title: One}\n[G]Words';

    expect(splitChordProSongs(content)).toEqual([content]);
  });

  it('splits a file that holds more than one song', () => {
    const songs = splitChordProSongs('{title: One}\n[G]Words\n{title: Two}\n[G]More words');

    expect(songs).toHaveLength(2);
    expect(songs[0]).toContain('One');
    expect(songs[0]).not.toContain('Two');
    expect(songs[1]).toContain('Two');
  });

  it('splits on a new song marker', () => {
    const songs = splitChordProSongs('{title: One}\n[G]Words\n{new_song:}\n[G]More words');

    expect(songs).toHaveLength(2);
  });
});

describe('resolveSectionLabel', () => {
  const definition = {
    keyword: 'chorus',
    type: 'chorus',
    label: 'Chorus',
    numbered: true,
  } as const;

  it('uses a trailing number from the section type', () => {
    expect(resolveSectionLabel('chorus3', '', definition, 1)).toBe('Chorus 3');
  });

  it('uses the counter when there is no number', () => {
    expect(resolveSectionLabel('chorus', '', definition, 2)).toBe('Chorus 2');
  });

  it('prefers a custom label', () => {
    expect(resolveSectionLabel('chorus', 'Refrain', definition, 2)).toBe('Refrain');
  });
});
