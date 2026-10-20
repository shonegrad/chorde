import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import 'fake-indexeddb/auto';
import { IndexedDBLibraryStore } from '../libraryStore';
import type { Song } from '../../types';

const makeSong = (id: string, overrides: Partial<Song> = {}): Song => ({
  id,
  title: `Song ${id}`,
  artist: 'Artist',
  content: '{title: Song}\n[C]Hello',
  attribution: {
    sourceName: 'test',
    sourceUrl: '',
    license: 'public-domain',
    verifiedAt: '2026-01-01T00:00:00.000Z',
    verifiedBy: 'auto',
  },
  rightsStatus: 'open',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('IndexedDBLibraryStore', () => {
  let store: IndexedDBLibraryStore;

  beforeEach(async () => {
    await new Promise<void>((resolve) => {
      const request = indexedDB.deleteDatabase('chorde-library');
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => resolve();
    });
    store = new IndexedDBLibraryStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns an empty list for a fresh database', async () => {
    await expect(store.listSongs()).resolves.toEqual([]);
  });

  it('persists an upserted song', async () => {
    const song = makeSong('a');
    await store.upsertSong(song);

    const songs = await store.listSongs();
    expect(songs).toHaveLength(1);
    expect(songs[0].id).toBe('a');
    expect(songs[0].title).toBe('Song a');
  });

  it('replaces an existing song on upsert rather than duplicating it', async () => {
    await store.upsertSong(makeSong('a', { title: 'First' }));
    await store.upsertSong(makeSong('a', { title: 'Second' }));

    const songs = await store.listSongs();
    expect(songs).toHaveLength(1);
    expect(songs[0].title).toBe('Second');
  });

  it('deletes a song', async () => {
    await store.upsertSong(makeSong('a'));
    await store.upsertSong(makeSong('b'));
    await store.deleteSong('a');

    const songs = await store.listSongs();
    expect(songs.map((s) => s.id)).toEqual(['b']);
  });

  it('merges on bulkUpsert instead of replacing the library', async () => {
    await store.bulkUpsert([makeSong('a'), makeSong('b')]);
    await store.bulkUpsert([makeSong('b', { title: 'Updated B' }), makeSong('c')]);

    const songs = await store.listSongs();
    expect(songs.map((s) => s.id).sort()).toEqual(['a', 'b', 'c']);
    expect(songs.find((s) => s.id === 'b')?.title).toBe('Updated B');
  });

  it('exposes the in-memory cache synchronously', async () => {
    await store.upsertSong(makeSong('a'));
    expect(store.listSongsSync().map((s) => s.id)).toEqual(['a']);
  });

  it('round-trips a snapshot', async () => {
    await store.upsertSong(makeSong('a'));

    const snapshot = store.exportSnapshot();
    const parsed = JSON.parse(snapshot);
    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.songs).toHaveLength(1);

    const target = new IndexedDBLibraryStore();
    await target.importSnapshot(snapshot);

    const songs = await target.listSongs();
    expect(songs.map((s) => s.id)).toEqual(['a']);
  });

  it('rejects snapshots with an unsupported schema version', async () => {
    await expect(
      store.importSnapshot(JSON.stringify({ schemaVersion: 99, songs: [] }))
    ).rejects.toThrow(/format version 99/i);
  });

  it('rejects malformed snapshot JSON', async () => {
    await expect(store.importSnapshot('not json')).rejects.toThrow(/not a valid Chorde backup/i);
  });

  it('rejects snapshots without a songs array', async () => {
    await expect(
      store.importSnapshot(JSON.stringify({ schemaVersion: 1, songs: 'nope' }))
    ).rejects.toThrow(/does not contain any songs/i);
  });

  it('refreshes the cache when another tab signals a change', async () => {
    await store.upsertSong(makeSong('a'));

    // Simulate another tab writing directly to the same database.
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('chorde-library', 1);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('songs', 'readwrite');
        tx.objectStore('songs').put(makeSong('b'));
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => reject(tx.error);
      };
      request.onerror = () => reject(request.error);
    });

    window.dispatchEvent(new StorageEvent('storage', { key: 'chorde_idb_sync' }));
    await vi.waitFor(async () => {
      expect((await store.listSongs()).map((s) => s.id).sort()).toEqual(['a', 'b']);
    });
  });

  it('tells subscribers about a change made in another tab', async () => {
    const received: string[][] = [];
    store.subscribe((songs) => received.push(songs.map((s) => s.id)));

    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('chorde-library', 1);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('songs', 'readwrite');
        tx.objectStore('songs').put(makeSong('from-other-tab'));
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => reject(tx.error);
      };
      request.onerror = () => reject(request.error);
    });

    window.dispatchEvent(new StorageEvent('storage', { key: 'chorde_idb_sync' }));

    await vi.waitFor(() => {
      expect(received.length).toBeGreaterThan(0);
    });
    expect(received.at(-1)).toContain('from-other-tab');
  });

  it('stops notifying a subscriber once it unsubscribes', async () => {
    const received: string[][] = [];
    const unsubscribe = store.subscribe((songs) => received.push(songs.map((s) => s.id)));
    unsubscribe();

    window.dispatchEvent(new StorageEvent('storage', { key: 'chorde_idb_sync' }));
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(received).toHaveLength(0);
  });

  it('includes the setlists in an exported snapshot', async () => {
    await store.upsertSong(makeSong('a'));

    const snapshot = JSON.parse(
      store.exportSnapshot([
        {
          id: 'set-1',
          name: 'Sunday set',
          songIds: ['a'],
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ])
    );

    expect(snapshot.setlists).toHaveLength(1);
    expect(snapshot.setlists[0].name).toBe('Sunday set');
  });
});
