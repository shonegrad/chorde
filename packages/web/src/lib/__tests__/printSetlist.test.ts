import { describe, it, expect } from 'vitest';
import { buildSetlistSheet } from '../printSetlist';
import type { Setlist, Song } from '../../types';

const song: Song = {
  id: 'song-1',
  title: 'Amazing Grace',
  artist: 'John Newton',
  key: 'G',
  content: '[G]Words',
  duration: '4:28',
  attribution: {
    sourceName: 'test',
    sourceUrl: '',
    license: 'public-domain',
    verifiedBy: 'auto',
  },
  rightsStatus: 'open',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const setlist: Setlist = {
  id: 'set-1',
  name: 'Sunday',
  targetKey: 'G',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  songs: [{ songId: 'song-1', transpose: 2, capo: 1, note: 'Slowly' }],
};

const songById = new Map([[song.id, song]]);

describe('the page for a setlist', () => {
  it('has the name of the set and the running order', () => {
    const sheet = buildSetlistSheet(setlist, songById);

    expect(sheet).toContain('Sunday');
    expect(sheet).toContain('Amazing Grace');
    expect(sheet).toContain('John Newton');
  });

  it('says how the song is played', () => {
    const sheet = buildSetlistSheet(setlist, songById);

    expect(sheet).toContain('Transpose +2');
    expect(sheet).toContain('Capo 1');
    expect(sheet).toContain('Slowly');
  });

  it('says how long the set takes', () => {
    const sheet = buildSetlistSheet(setlist, songById);

    expect(sheet).toContain('Running time 4:28');
    expect(sheet).toContain('Played in G');
  });

  it('says when a song is not in the library any more', () => {
    const sheet = buildSetlistSheet(setlist, new Map());

    expect(sheet).toContain('A song that is no longer in your library');
  });

  it('leaves the songs out unless they are asked for', () => {
    expect(buildSetlistSheet(setlist, songById)).not.toContain('<div class="song-page"');
    expect(buildSetlistSheet(setlist, songById, { includeSongs: true })).toContain(
      '<div class="song-page"'
    );
  });

  it('keeps the words of a song out of the markup', () => {
    const sheet = buildSetlistSheet({ ...setlist, name: '<script>bad()</script>' }, songById);

    expect(sheet).not.toContain('<script>bad()</script>');
    expect(sheet).toContain('&lt;script&gt;');
  });
});
