import { describe, it, expect } from 'vitest';
import { buildSnapshot, parseSnapshot, SNAPSHOT_SCHEMA_VERSION } from '../backup';
import type { Song } from '../../types';
import type { Setlist } from '@chorde/shared';

const song: Song = {
  id: 'song-1',
  title: 'Amazing Grace',
  artist: 'John Newton',
  content: '{title: Amazing Grace}\n[G]Amazing grace',
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
  name: 'Sunday set',
  songs: [{ songId: 'song-1' }],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('buildSnapshot', () => {
  it('includes the songs and the setlists', () => {
    const snapshot = buildSnapshot([song], [setlist]);

    expect(snapshot.schemaVersion).toBe(SNAPSHOT_SCHEMA_VERSION);
    expect(snapshot.songs).toHaveLength(1);
    expect(snapshot.setlists).toHaveLength(1);
    expect(snapshot.setlists[0].name).toBe('Sunday set');
  });

  it('defaults to no setlists', () => {
    expect(buildSnapshot([song]).setlists).toEqual([]);
  });
});

describe('parseSnapshot', () => {
  it('round-trips a snapshot', () => {
    const original = buildSnapshot([song], [setlist]);
    const parsed = parseSnapshot(JSON.stringify(original));

    expect(parsed.songs).toEqual(original.songs);
    expect(parsed.setlists).toEqual(original.setlists);
  });

  it('accepts a snapshot without setlists', () => {
    const parsed = parseSnapshot(
      JSON.stringify({ schemaVersion: 1, exportedAt: '2026-01-01', songs: [song] })
    );
    expect(parsed.setlists).toEqual([]);
  });

  it('rejects malformed JSON', () => {
    expect(() => parseSnapshot('not json')).toThrow(/not a valid Chorde backup/i);
  });

  it('rejects a file that is not a backup', () => {
    expect(() => parseSnapshot(JSON.stringify({ hello: 'world' }))).toThrow(/not a Chorde backup/i);
  });

  it('rejects an unsupported schema version', () => {
    expect(() => parseSnapshot(JSON.stringify({ schemaVersion: 99, songs: [] }))).toThrow(
      /format version 99/i
    );
  });

  it('rejects a backup without songs', () => {
    expect(() => parseSnapshot(JSON.stringify({ schemaVersion: 1, songs: 'nope' }))).toThrow(
      /does not contain any songs/i
    );
  });
});
