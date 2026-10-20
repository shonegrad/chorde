import type { Song } from '../types';
import type { Setlist } from '@chorde/shared';
import { buildSnapshot, parseSnapshot } from './backup';

export interface LibraryStore {
  listSongs(): Promise<Song[]>;
  listSongsSync(): Song[];
  getSong(id: string): Promise<Song | undefined>;
  upsertSong(song: Song): Promise<void>;
  deleteSong(id: string): Promise<void>;
  bulkUpsert(songs: Song[]): Promise<void>;
  exportSnapshot(setlists?: Setlist[]): string;
  importSnapshot(snapshot: string): Promise<void>;
  /** Notified when the library changes in another browser tab. */
  subscribe(listener: (songs: Song[]) => void): () => void;
}

const DB_NAME = 'chorde-library';
const DB_VERSION = 1;
const STORE_NAME = 'songs';
const MIGRATION_KEY = 'chorde_idb_migrated';
const SYNC_KEY = 'chorde_idb_sync';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('artist', 'artist', { unique: false });
        store.createIndex('key', 'key', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionComplete(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Transaction aborted'));
  });
}

export class IndexedDBLibraryStore implements LibraryStore {
  private memoryCache: Song[] = [];
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private listeners = new Set<(songs: Song[]) => void>();

  constructor() {
    this.initPromise = this.migrateFromLocalStorage().then(() => this.loadCache());
    this.setupSyncListener();
  }

  /**
   * Listen for changes made in another browser tab.
   *
   * The storage event only fires in the *other* tab, so the cache is reloaded
   * here and the listeners are told about the new library.
   */
  subscribe(listener: (songs: Song[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const songs = [...this.memoryCache];
    this.listeners.forEach((listener) => listener(songs));
  }

  private setupSyncListener(): void {
    if (typeof window === 'undefined' || !window.addEventListener) return;
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === SYNC_KEY) {
        void this.loadCache().then(() => this.notifyListeners());
      }
    };
    window.addEventListener('storage', handleStorageChange);
  }

  private notifySync(): void {
    try {
      localStorage.setItem(SYNC_KEY, String(Date.now()));
    } catch {
      // localStorage may be unavailable; sync is best-effort
    }
  }

  private async ensureInit(): Promise<void> {
    if (this.initialized) return;
    await this.initPromise;
  }

  private async migrateFromLocalStorage(): Promise<void> {
    const alreadyMigrated = localStorage.getItem(MIGRATION_KEY);
    if (alreadyMigrated) return;

    const lsKey = 'chorde_songs';
    const stored = localStorage.getItem(lsKey);
    if (!stored) {
      localStorage.setItem(MIGRATION_KEY, 'true');
      return;
    }

    try {
      const songs: Song[] = JSON.parse(stored);
      if (Array.isArray(songs) && songs.length > 0) {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        for (const song of songs) {
          store.put(song);
        }
        await transactionComplete(tx);
        db.close();
      }
    } catch (e) {
      console.error('Failed to migrate from localStorage:', e);
    }

    localStorage.setItem(MIGRATION_KEY, 'true');
  }

  private async loadCache(): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    this.memoryCache = await promisifyRequest(store.getAll());
    this.initialized = true;
    db.close();
  }

  private async persistSong(song: Song): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(song);
    await transactionComplete(tx);
    db.close();
    this.notifySync();
  }

  private async persistDelete(id: string): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    await transactionComplete(tx);
    db.close();
    this.notifySync();
  }

  async listSongs(): Promise<Song[]> {
    await this.ensureInit();
    return [...this.memoryCache];
  }

  listSongsSync(): Song[] {
    return [...this.memoryCache];
  }

  async getSong(id: string): Promise<Song | undefined> {
    await this.ensureInit();
    return this.memoryCache.find((s) => s.id === id);
  }

  async upsertSong(song: Song): Promise<void> {
    await this.ensureInit();
    await this.persistSong(song);
    const idx = this.memoryCache.findIndex((s) => s.id === song.id);
    if (idx >= 0) {
      this.memoryCache[idx] = song;
    } else {
      this.memoryCache.push(song);
    }
  }

  async deleteSong(id: string): Promise<void> {
    await this.ensureInit();
    await this.persistDelete(id);
    this.memoryCache = this.memoryCache.filter((s) => s.id !== id);
  }

  async bulkUpsert(songs: Song[]): Promise<void> {
    await this.ensureInit();
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const song of songs) {
      store.put(song);
    }
    await transactionComplete(tx);
    db.close();

    this.notifySync();

    const songMap = new Map<string, Song>();
    this.memoryCache.forEach((s) => songMap.set(s.id, s));
    songs.forEach((s) => songMap.set(s.id, s));
    this.memoryCache = Array.from(songMap.values());
  }

  exportSnapshot(setlists: Setlist[] = []): string {
    return JSON.stringify(buildSnapshot(this.memoryCache, setlists), null, 2);
  }

  async importSnapshot(snapshot: string): Promise<void> {
    const parsed = parseSnapshot(snapshot);
    await this.bulkUpsert(parsed.songs);
  }
}
