import { describe, it, expect } from 'vitest';
import {
  SETLIST_FILE_FORMAT,
  buildSetlistFile,
  parseSetlistFile,
  setlistFromFile,
} from '../setlistFile';
import type { Setlist, Song } from '../../types';

const setlist: Setlist = {
  id: 'set-1',
  name: 'Sunday',
  targetKey: 'G',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  songs: [
    { songId: 'song-1', transpose: 2, capo: 1, note: 'Slowly' },
    { songId: 'song-2', title: 'A Song Not Here', artist: 'Someone' },
  ],
};

const song: Song = {
  id: 'song-1',
  title: 'Amazing Grace',
  artist: 'John Newton',
  content: '[G]Words',
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

const songById = new Map([[song.id, song]]);
let counter = 0;
const newId = () => `new-${(counter += 1)}`;

describe('writing a setlist down', () => {
  it('keeps the name, the key and how each song is played', () => {
    const file = buildSetlistFile(setlist, songById);

    expect(file.format).toBe(SETLIST_FILE_FORMAT);
    expect(file.name).toBe('Sunday');
    expect(file.targetKey).toBe('G');
    expect(file.songs[0].transpose).toBe(2);
    expect(file.songs[0].capo).toBe(1);
    expect(file.songs[0].note).toBe('Slowly');
  });

  it('keeps the title of every song, so that the set reads properly', () => {
    const file = buildSetlistFile(setlist, songById);

    expect(file.songs[0].title).toBe('Amazing Grace');
    expect(file.songs[1].title).toBe('A Song Not Here');
  });

  it('reads a setlist back', () => {
    const file = buildSetlistFile(setlist, songById);
    const read = parseSetlistFile(JSON.stringify(file));

    expect(read.name).toBe('Sunday');
    expect(read.songs).toHaveLength(2);
  });

  it('refuses a file that is not a setlist', () => {
    expect(() => parseSetlistFile('not json')).toThrow(/not a setlist/i);
    expect(() => parseSetlistFile('{"format":"something-else"}')).toThrow(/not a setlist/i);
  });

  it('refuses a setlist from a newer version of the app', () => {
    const file = { ...buildSetlistFile(setlist, songById), version: 99 };

    expect(() => parseSetlistFile(JSON.stringify(file))).toThrow(/newer version/i);
  });
});

describe('reading a setlist in', () => {
  it('links a song that is in the library', () => {
    const file = buildSetlistFile(setlist, songById);
    const imported = setlistFromFile(file, songById, newId);

    expect(imported.songs[0].songId).toBe('song-1');
    expect(imported.songs[0].title).toBe('Amazing Grace');
  });

  it('keeps a song that is not in the library, by its title', () => {
    const file = buildSetlistFile(setlist, songById);
    const imported = setlistFromFile(file, new Map(), newId);

    expect(imported.songs[0].title).toBe('Amazing Grace');
    expect(imported.songs[1].title).toBe('A Song Not Here');
    expect(imported.songs[1].artist).toBe('Someone');
  });

  it('finds a song by its title when the file has no id for it', () => {
    const file = {
      ...buildSetlistFile(setlist, songById),
      songs: [{ title: 'Amazing Grace' }],
    };

    const imported = setlistFromFile(file, songById, newId);

    expect(imported.songs[0].songId).toBe('song-1');
  });
});
