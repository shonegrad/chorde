import type { ReactNode } from 'react';
import type { Song, ViewMode } from '../types';

export interface SongFilter {
  type: 'tag' | 'artist' | 'key';
  value: string;
}

export interface AppContextType {
  songs: Song[];
  saveSong: (song: Song) => void;
  deleteSong: (id: string) => void;
  resetLibrary: () => void;
  filter: SongFilter | null;
  setFilter: (filter: SongFilter | null) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export interface AppProviderProps {
  children: ReactNode;
}
