import { LocalLibraryStore } from '../libraryStore';
import type { Song } from '../../types';

describe('LocalLibraryStore', () => {
  const storageKey = 'test_chorde_songs';
  const versionKey = 'test_chorde_version';

  beforeEach(() => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(versionKey);
  });

  afterEach(() => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(versionKey);
  });

  const createTestSong = (id: string, title: string, artist: string): Song => ({
    id,
    title,
    artist,
    content: `{start_of_verse}\n[C]Test content\n{end_of_verse}`,
    format: 'chordpro' as const,
    capo: 0,
    tags: ['test'],
    key: 'C',
    bpm: 120,
    timeSignature: '4/4',
    attribution: {
      sourceName: 'Test',
      sourceUrl: '',
      license: 'Public Domain',
      author: 'Test Author',
      notes: 'Test notes',
    },
    rightsStatus: 'open' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hash: 'testhash',
  });

  test('should initialize with empty library', () => {
    const store = new LocalLibraryStore(storageKey, versionKey, '1.0');
    expect(store.listSongsSync()).toHaveLength(0);
  });

  test('should save and retrieve a song', async () => {
    const store = new LocalLibraryStore(storageKey, versionKey, '1.0');
    const song = createTestSong('1', 'Test Song', 'Test Artist');
    await store.upsertSong(song);
    const songs = await store.listSongs();
    expect(songs).toHaveLength(1);
    expect(songs[0]).toMatchObject(song);
  });

  test('should get a song by ID', async () => {
    const store = new LocalLibraryStore(storageKey, versionKey, '1.0');
    const song1 = createTestSong('1', 'Test Song 1', 'Test Artist');
    const song2 = createTestSong('2', 'Test Song 2', 'Test Artist');
    await store.upsertSong(song1);
    await store.upsertSong(song2);
    const retrieved = await store.getSong('2');
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe('2');
  });

  test('should update an existing song', async () => {
    const store = new LocalLibraryStore(storageKey, versionKey, '1.0');
    const originalSong = createTestSong('1', 'Original Title', 'Original Artist');
    const updatedSong = { ...originalSong, title: 'Updated Title', artist: 'Updated Artist' };
    await store.upsertSong(originalSong);
    await store.upsertSong(updatedSong);
    const songs = store.listSongsSync();
    expect(songs).toHaveLength(1);
    expect(songs[0].title).toBe('Updated Title');
  });

  test('should delete a song', async () => {
    const store = new LocalLibraryStore(storageKey, versionKey, '1.0');
    await store.upsertSong(createTestSong('1', 'Test Song 1', 'Test Artist'));
    await store.upsertSong(createTestSong('2', 'Test Song 2', 'Test Artist'));
    await store.deleteSong('1');
    expect(store.listSongsSync()).toHaveLength(1);
    expect(store.listSongsSync()[0].id).toBe('2');
  });

  test('should bulk upsert songs', async () => {
    const store = new LocalLibraryStore(storageKey, versionKey, '1.0');
    const songs = [
      createTestSong('1', 'Song 1', 'Artist 1'),
      createTestSong('2', 'Song 2', 'Artist 2'),
      createTestSong('3', 'Song 3', 'Artist 3'),
    ];
    await store.bulkUpsert(songs);
    expect(store.listSongsSync()).toHaveLength(3);
    expect(store.listSongsSync().map((s) => s.id)).toEqual(['1', '2', '3']);
  });

  test('should export and import snapshot', async () => {
    const store = new LocalLibraryStore(storageKey, versionKey, '1.0');
    await store.bulkUpsert([
      createTestSong('1', 'Song 1', 'Artist 1'),
      createTestSong('2', 'Song 2', 'Artist 2'),
    ]);
    const snapshot = store.exportSnapshot();
    expect(snapshot).toBeDefined();
    await store.deleteSong('1');
    await store.deleteSong('2');
    expect(store.listSongsSync()).toHaveLength(0);
    await store.importSnapshot(snapshot);
    expect(store.listSongsSync()).toHaveLength(2);
  });

  test('should handle version migration', async () => {
    const oldSong = createTestSong('1', 'Old Song', 'Old Artist');
    localStorage.setItem(storageKey, JSON.stringify([oldSong]));
    localStorage.setItem(versionKey, '0.9');
    const store = new LocalLibraryStore(storageKey, versionKey, '1.0');
    expect(store.listSongsSync()).toHaveLength(1);
    expect(store.listSongsSync()[0].id).toBe('1');
  });
});
