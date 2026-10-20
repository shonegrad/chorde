import { create } from 'zustand';
import type { Song, ViewMode } from '../types';
import { IndexedDBLibraryStore } from '../lib/libraryStore';

export interface SongFilter {
  type: 'tag' | 'artist' | 'key';
  value: string;
}

interface LibraryState {
  songs: Song[];
  loading: boolean;
  /** False when the browser refused to give us persistent storage. */
  storageAvailable: boolean;
  viewMode: ViewMode;
  store: IndexedDBLibraryStore;
  loadSongs: () => Promise<void>;
  saveSong: (song: Song) => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteSongs: (ids: string[]) => Promise<void>;
  resetLibrary: () => Promise<void>;
  setViewMode: (mode: ViewMode) => void;
}

async function loadSeedSongs(): Promise<Song[]> {
  const [{ SEED_SONGS }, { ROCK_PACK }, { ROCK_PACK_2 }, { JAZZ_PACK }, { MIX_PACK }] =
    await Promise.all([
      import('../data/seedSongs'),
      import('../data/rockPack'),
      import('../data/rockPack2'),
      import('../data/jazzPack'),
      import('../data/mixPack'),
    ]);
  return [...SEED_SONGS, ...ROCK_PACK, ...ROCK_PACK_2, ...JAZZ_PACK, ...MIX_PACK];
}

const VIEW_MODE_KEY = 'chorde_view_mode';

export const useLibraryStore = create<LibraryState>((set, get) => ({
  songs: [],
  loading: true,
  storageAvailable: true,
  viewMode: ((): ViewMode => {
    const stored = localStorage.getItem(VIEW_MODE_KEY);
    return stored === 'list' || stored === 'grid' ? (stored as ViewMode) : 'grid';
  })(),
  store: new IndexedDBLibraryStore(),

  loadSongs: async () => {
    const store = get().store;
    try {
      const seedSongs = await loadSeedSongs();
      const stored = await store.listSongs();
      const storedIds = new Set(stored.map((s) => s.id));
      // Only write the seed songs that are missing, instead of rewriting the
      // whole library on every single start.
      const missing = seedSongs.filter((song) => !storedIds.has(song.id));

      if (missing.length > 0) {
        await store.bulkUpsert(missing);
      }

      set({ songs: [...stored, ...missing], loading: false, storageAvailable: true });
    } catch (e) {
      console.error('Failed to initialize library:', e);
      const seedSongs = await loadSeedSongs();
      set({ songs: seedSongs, loading: false, storageAvailable: false });
    }
  },

  saveSong: async (song) => {
    const store = get().store;
    await store.upsertSong(song);
    set((state) => ({ songs: [...state.songs.filter((s) => s.id !== song.id), song] }));
  },

  deleteSong: async (id) => {
    const store = get().store;
    await store.deleteSong(id);
    set((state) => ({ songs: state.songs.filter((s) => s.id !== id) }));
  },

  deleteSongs: async (ids) => {
    if (ids.length === 0) return;
    const store = get().store;
    for (const id of ids) {
      await store.deleteSong(id);
    }
    const removed = new Set(ids);
    set((state) => ({ songs: state.songs.filter((s) => !removed.has(s.id)) }));
  },

  resetLibrary: async () => {
    const store = get().store;
    const seedSongs = await loadSeedSongs();
    // Remove everything first so a reset really resets.
    const existing = await store.listSongs();
    const seedIds = new Set(seedSongs.map((song) => song.id));
    for (const song of existing) {
      if (!seedIds.has(song.id)) {
        await store.deleteSong(song.id);
      }
    }
    await store.bulkUpsert(seedSongs);
    set({ songs: seedSongs });
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
    localStorage.setItem(VIEW_MODE_KEY, mode);
  },
}));

// A change made in another tab is applied to this one too.
useLibraryStore.getState().store.subscribe((songs) => useLibraryStore.setState({ songs }));
