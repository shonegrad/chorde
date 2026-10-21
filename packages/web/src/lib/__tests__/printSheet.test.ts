import { describe, it, expect } from 'vitest';
import { buildChordChart, buildPrintSheet, chordsUsed, soundingKey } from '../printSheet';
import { parseChordPro } from '../chordPro';
import type { Song } from '../../types';

const song: Song = {
  id: 'song-1',
  title: 'Amazing Grace',
  artist: 'John Newton',
  key: 'G',
  bpm: 120,
  duration: '4:28',
  content: [
    '{start_of_verse}',
    '[G]Amazing [C]grace how sweet',
    '{start_of_chorus}',
    '[G]How sweet the sound',
  ].join('\n'),
  attribution: {
    sourceName: 'Traditional',
    sourceUrl: '',
    license: 'public-domain',
    verifiedBy: 'auto',
  },
  rightsStatus: 'open',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('the changes of a song', () => {
  it('gives the chords of each section, in order', () => {
    const chart = buildChordChart(parseChordPro(song.content));

    expect(chart).toHaveLength(2);
    expect(chart[0].label).toBe('Verse 1');
    expect(chart[0].chords).toEqual(['G', 'C']);
    expect(chart[1].chords).toEqual(['G']);
  });

  it('keeps a chord that follows itself only once', () => {
    const chart = buildChordChart(parseChordPro('[G]One [G]Two [C]Three'));

    expect(chart[0].chords).toEqual(['G', 'C']);
  });

  it('lists every chord the song uses, once each', () => {
    expect(chordsUsed(parseChordPro(song.content))).toEqual(['G', 'C']);
  });
});

describe('the key a printed song is in', () => {
  it('takes the transposition and the capo into account', () => {
    expect(soundingKey(song, {})).toBe('G');
    expect(soundingKey(song, { transpose: 2 })).toBe('A');
    expect(soundingKey(song, { capo: 2 })).toBe('A');
  });
});

describe('the page for a song', () => {
  it('has the title, the writer, the key and the length', () => {
    const sheet = buildPrintSheet(song);

    expect(sheet).toContain('Amazing Grace');
    expect(sheet).toContain('John Newton');
    expect(sheet).toContain('Key: G');
    expect(sheet).toContain('4:28');
    expect(sheet).toContain('120 bpm');
  });

  it('has the chords over the words', () => {
    const sheet = buildPrintSheet(song);

    expect(sheet).toContain('<span class="chord">G</span>');
    expect(sheet).toContain('<span class="word">Amazing</span>');
  });

  it('has the sections', () => {
    const sheet = buildPrintSheet(song);

    expect(sheet).toContain('Verse 1');
    expect(sheet).toContain('Chorus 1');
  });

  it('can print the changes instead of the song', () => {
    const sheet = buildPrintSheet(song, { layout: 'chart' });

    expect(sheet).toContain('chart-chord');
    expect(sheet).not.toContain('<span class="word">');
  });

  it('can draw the shapes of the chords', () => {
    const sheet = buildPrintSheet(song, { diagrams: true }, { G: '<svg id="shape"></svg>' });

    expect(sheet).toContain('The chords');
    expect(sheet).toContain('<svg id="shape"></svg>');
  });

  it('leaves the shapes out when they are not asked for', () => {
    const sheet = buildPrintSheet(song, {}, { G: '<svg id="shape"></svg>' });

    expect(sheet).not.toContain('<svg id="shape"></svg>');
  });

  it('shows the note on the song', () => {
    const sheet = buildPrintSheet({ ...song, notes: 'Play quietly here' });

    expect(sheet).toContain('Play quietly here');
  });

  it('applies the transposition to the chords', () => {
    const sheet = buildPrintSheet(song, { transpose: 2 });

    expect(sheet).toContain('<span class="chord">A</span>');
    expect(sheet).toContain('Key: A');
    expect(sheet).toContain('written in G');
  });

  it('keeps the words of a song out of the markup', () => {
    const sheet = buildPrintSheet({ ...song, content: '[G]<script>bad()</script>' });

    expect(sheet).not.toContain('<script>bad()</script>');
    expect(sheet).toContain('&lt;script&gt;');
  });
});
