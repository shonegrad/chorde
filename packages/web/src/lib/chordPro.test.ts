import { describe, it, expect } from 'vitest';
import { parseChordPro, extractMetadata, resolveSectionLabel } from './chordPro';

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

  it('ignores unknown section types', () => {
    const parsed = parseChordPro('{start_of_nonsense}\n[G]One');
    expect(parsed).toHaveLength(1);
    expect(parsed[0].section).toBeUndefined();
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
