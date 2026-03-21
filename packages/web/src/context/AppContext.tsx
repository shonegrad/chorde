import { createContext, useState, useEffect } from 'react';
import type { Song, ViewMode } from '../types';
import type { AppContextType, AppProviderProps, SongFilter, ViewState } from './types';
import { LocalLibraryStore } from '../lib/libraryStore';

import { SEED_SONGS } from '../data/seedSongs';
import { ROCK_PACK } from '../data/rockPack';
import { ROCK_PACK_2 } from '../data/rockPack2';
import { JAZZ_PACK } from '../data/jazzPack';
import { MIX_PACK } from '../data/mixPack';
import { EXTERNAL_248_PACK } from '../data/external_248';

const STORAGE_KEY = 'chorde_songs';
const VERSION_KEY = 'chorde_version';
const VIEW_MODE_KEY = 'chorde_view_mode';
const CURRENT_VERSION = '2.5';

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: AppProviderProps) {
  const defaultSongs = [
    ...SEED_SONGS,
    ...ROCK_PACK,
    ...ROCK_PACK_2,
    ...JAZZ_PACK,
    ...MIX_PACK,
    ...(EXTERNAL_248_PACK ?? [])
  ];

  const libraryStore = new LocalLibraryStore(STORAGE_KEY, VERSION_KEY, CURRENT_VERSION);
  const [songs, setSongs] = useState<Song[]>([]);
  const [view, setView] = useState<ViewState>('LIST');
  const [activeSong, setActiveSong] = useState<Song | undefined>(undefined);
  const [filter, setFilter] = useState<SongFilter | null>(null);

  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const stored = localStorage.getItem(VIEW_MODE_KEY);
    return (stored === 'list' || stored === 'grid') ? (stored as ViewMode) : 'grid';
  });
  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
  };

  // Initialize library from storage
  useEffect(() => {
    // Load initial songs from library store
    const storedSongs = libraryStore.listSongs();
    const seedSet = new Set<string>(defaultSongs.map(s => s.id));
    
    if (storedSongs.length === 0) {
      // No stored data, use default songs
      libraryStore.bulkUpsert(defaultSongs);
      setSongs(defaultSongs);
    } else {
      // Check if we need to merge with default songs (for new default songs)
      const merged = [...defaultSongs, ...storedSongs.filter(s => !seedSet.has(s.id))];
      libraryStore.bulkUpsert(merged);
      setSongs(merged);
    }
  }, []);

  const saveSong = (song: Song) => {
    libraryStore.upsertSong(song);
    setSongs(prev => [...prev, song]);
  };
  
  const deleteSong = (id: string) => {
    libraryStore.deleteSong(id);
    setSongs(prev => prev.filter(s => s.id !== id));
  };
  
  const resetLibrary = () => {
    libraryStore.bulkUpsert(defaultSongs);
    setSongs(defaultSongs);
  };

  const value: AppContextType = {
    songs,
    saveSong,
    deleteSong,
    resetLibrary,
    view,
    setView,
    activeSong,
    setActiveSong,
    filter,
    setFilter,
    viewMode,
    setViewMode,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
