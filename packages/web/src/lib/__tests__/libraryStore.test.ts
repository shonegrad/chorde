import { LocalLibraryStore } from '../libraryStore';
import type { Song } from '../../types';

describe('LocalLibraryStore', () => {
  const storageKey = 'test_chorde_songs';
  const versionKey = 'test_chorde_version';
  
  beforeEach(() => {
    // Clean up localStorage before each test
    localStorage.removeItem(storageKey);
    localStorage.removeItem(versionKey);
  });
  
  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.removeItem(storageKey);
    localStorage.removeItem(versionKey);
  });
  
  const createTestSong = (id: string, title: string, artist: string): Song => {
    return {
      id,
      title,
      artist,
      content: `{start_of_verse}\n[C]Test content\n{end_of_verse}`,
      format: 'chordpro',
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
        notes: 'Test notes'
      },
      rightsStatus: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hash: 'testhash'
    };
  };
  
  test('should initialize with empty library', () => {
    const store = new LocalLibraryStore(storageKey, versionKey, '1.0');
    expect(store.listSongs()).toHaveLength(0);
  });
  
  test('should save and retrieve a song', () => {
    const store = new LocalLibraryStore(storageKey, versionKey, '1.0');
    const song = createTestSong('1', 'Test Song', 'Test Artist');
    
    store.upsertSong(song);
    const songs = store.listSongs();
    
    expect(songs).toHaveLength(1);
    expect(songs[0]).toMatchObject(song);
  });
  
  test('should get a song by ID', () => {
    const store = new LocalLibraryStore(storageKey, versionKey, '1.0');
    const song1 = createTestSong('1', 'Test Song 1', 'Test Artist');
    const song2 = createTestSong('2', 'Test Song 2', 'Test Artist');
    
    store.upsertSong(song1);
    store.upsertSong(song2);
    
    const retrieved = store.getSong('2');
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe('2');
    expect(retrieved?.title).toBe('Test Song 2');
  });
  
  test('should update an existing song', () => {
    const store = new LocalLibraryStore(storageKey, versionKey, '1.0');
    const originalSong = createTestSong('1', 'Original Title', 'Original Artist');
    const updatedSong = { ...originalSong, title: 'Updated Title', artist: 'Updated Artist' };
    
    store.upsertSong(originalSong);
    store.upsertSong(updatedSong);
    
    const songs = store.listSongs();
    expect(songs).toHaveLength(1);
    expect(songs[0].title).toBe('Updated Title');
    expect(songs[0].artist).toBe('Updated Artist');
  });
  
  test('should delete a song', () => {
    const store = new LocalLibraryStore(storageKey, versionKey, '1.0');
    const song1 = createTestSong('1', 'Test Song 1', 'Test Artist');
    const song2 = createTestSong('2', 'Test Song 2', 'Test Artist');
    
    store.upsertSong(song1);
    store.upsertSong(song2);
    
    store.deleteSong('1');
    const songs = store.listSongs();
    
    expect(songs).toHaveLength(1);
    expect(songs[0].id).toBe('2');
  });
  
  test('should bulk upsert songs', () => {
    const store = new LocalLibraryStore(storageKey, versionKey, '1.0');
    const songs = [
      createTestSong('1', 'Song 1', 'Artist 1'),
      createTestSong('2', 'Song 2', 'Artist 2'),
      createTestSong('3', 'Song 3', 'Artist 3')
    ];
    
    store.bulkUpsert(songs);
    const storedSongs = store.listSongs();
    
    expect(storedSongs).toHaveLength(3);
    expect(storedSongs.map(s => s.id)).toEqual(['1', '2', '3']);
  });
  
  test('should export and import snapshot', () => {
    const store = new LocalLibraryStore(storageKey, versionKey, '1.0');
    const songs = [
      createTestSong('1', 'Song 1', 'Artist 1'),
      createTestSong('2', 'Song 2', 'Artist 2')
    ];
    
    // Add some songs
    store.bulkUpsert(songs);
    
    // Export snapshot
    const snapshot = store.exportSnapshot();
    expect(snapshot).toBeDefined();
    
    // Clear the store
    store.deleteSong('1');
    store.deleteSong('2');
    expect(store.listSongs()).toHaveLength(0);
    
    // Import snapshot
    store.importSnapshot(snapshot);
    const importedSongs = store.listSongs();
    
    expect(importedSongs).toHaveLength(2);
    expect(importedSongs.map(s => s.id)).toEqual(['1', '2']);
  });
  
  test('should handle version migration', () => {
    // Set up old version data
    const oldSong = createTestSong('1', 'Old Song', 'Old Artist');
    localStorage.setItem(storageKey, JSON.stringify([oldSong]));
    localStorage.setItem(versionKey, '0.9'); // Old version
    
    // Initialize with new version
    const store = new LocalLibraryStore(storageKey, versionKey, '1.0');
    const songs = store.listSongs();
    
    // Should have migrated the song
    expect(songs).toHaveLength(1);
    expect(songs[0].id).toBe('1');
    expect(songs[0].title).toBe('Old Song');
  });
});