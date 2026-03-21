import type { Song } from '../types';

// LibraryStore interface as per Phase 1A
export interface LibraryStore {
  listSongs(): Song[];
  getSong(id: string): Song | undefined;
  upsertSong(song: Song): void;
  deleteSong(id: string): void;
  bulkUpsert(songs: Song[]): void;
  exportSnapshot(): string; // Returns JSON string of the snapshot
  importSnapshot(snapshot: string): void; // Merges snapshot into local library
}

// Simple implementation using localStorage
export class LocalLibraryStore implements LibraryStore {
  private storageKey: string;
  private versionKey: string;
  private currentVersion: string;

  constructor(storageKey = 'chorde_songs', versionKey = 'chorde_version', currentVersion = '2.5') {
    this.storageKey = storageKey;
    this.versionKey = versionKey;
    this.currentVersion = currentVersion;
    this.initializeStorage();
  }

  private initializeStorage(): void {
    const stored = localStorage.getItem(this.storageKey);
    const storedVersion = localStorage.getItem(this.versionKey);
    if (!stored) {
      // Initialize with empty array if nothing stored
      localStorage.setItem(this.storageKey, JSON.stringify([]));
      localStorage.setItem(this.versionKey, this.currentVersion);
    } else if (storedVersion !== this.currentVersion) {
      // Version mismatch - we could run migrations here
      // For now, we'll just update the version and keep the data
      localStorage.setItem(this.versionKey, this.currentVersion);
    }
  }

  private getSongs(): Song[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private setSongs(songs: Song[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(songs));
  }

  listSongs(): Song[] {
    return this.getSongs();
  }

  getSong(id: string): Song | undefined {
    return this.getSongs().find(song => song.id === id);
  }

  upsertSong(song: Song): void {
    const songs = this.getSongs();
    const index = songs.findIndex(s => s.id === song.id);
    if (index >= 0) {
      songs[index] = song;
    } else {
      songs.push(song);
    }
    this.setSongs(songs);
  }

  deleteSong(id: string): void {
    const songs = this.getSongs().filter(song => song.id !== id);
    this.setSongs(songs);
  }

  bulkUpsert(songs: Song[]): void {
    const current = this.getSongs();
    const songMap = new Map<string, Song>();
    current.forEach(song => songMap.set(song.id, song));
    songs.forEach(song => songMap.set(song.id, song));
    this.setSongs(Array.from(songMap.values()));
  }

  exportSnapshot(): string {
    const songs = this.getSongs();
    const snapshot = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      songs: songs,
      setlists: [] // For future use
    };
    return JSON.stringify(snapshot, null, 2);
  }

  importSnapshot(snapshot: string): void {
    let parsed;
    try {
      parsed = JSON.parse(snapshot);
    } catch (e) {
      throw new Error('Invalid snapshot format');
    }

    // Validate schema version (for now, we only support version 1)
    if (!parsed.schemaVersion || parsed.schemaVersion !== 1) {
      throw new Error('Unsupported schema version');
    }

    if (!Array.isArray(parsed.songs)) {
      throw new Error('Invalid snapshot: missing songs array');
    }

    // Merge the snapshot songs into the current library
    this.bulkUpsert(parsed.songs);
  }
}