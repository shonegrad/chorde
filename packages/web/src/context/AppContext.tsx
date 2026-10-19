/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react';
import type { Song, ViewMode } from '../types';
import type { AppContextType, AppProviderProps, SongFilter } from './types';
import { IndexedDBLibraryStore } from '../lib/libraryStore';

const VIEW_MODE_KEY = 'chorde_view_mode';

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

const store = new IndexedDBLibraryStore();

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: AppProviderProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filter, setFilter] = useState<SongFilter | null>(null);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const stored = localStorage.getItem(VIEW_MODE_KEY);
    return stored === 'list' || stored === 'grid' ? (stored as ViewMode) : 'grid';
  });

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
  };

  const seedSongsRef = useCallback(() => loadSeedSongs(), []);

  useEffect(() => {
    (async () => {
      try {
        const seedSongs = await seedSongsRef();
        const stored = await store.listSongs();
        if (stored.length === 0) {
          await store.bulkUpsert(seedSongs);
          setSongs(seedSongs);
        } else {
          const storedIds = new Set(stored.map((s) => s.id));
          const merged = [...stored, ...seedSongs.filter((s) => !storedIds.has(s.id))];
          await store.bulkUpsert(merged);
          setSongs(merged);
        }
      } catch (e) {
        console.error('Failed to initialize library:', e);
        const seedSongs = await seedSongsRef();
        setSongs(seedSongs);
      } finally {
        setLoading(false);
      }
    })();
  }, [seedSongsRef]);

  const saveSong = useCallback(async (song: Song) => {
    await store.upsertSong(song);
    setSongs((prev) => [...prev.filter((s) => s.id !== song.id), song]);
  }, []);

  const deleteSong = useCallback(async (id: string) => {
    await store.deleteSong(id);
    setSongs((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const resetLibrary = useCallback(async () => {
    const seedSongs = await seedSongsRef();
    await store.bulkUpsert(seedSongs);
    setSongs(seedSongs);
  }, [seedSongsRef]);

  const value: AppContextType = {
    songs,
    saveSong,
    deleteSong,
    resetLibrary,
    filter,
    setFilter,
    viewMode,
    setViewMode,
  };

  if (loading) {
    return null;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
