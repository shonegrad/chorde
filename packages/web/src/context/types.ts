import type { ReactNode } from 'react';
import type { Song, ViewMode } from '../types';

// Filter type
export interface SongFilter {
    type: 'tag' | 'artist' | 'key';
    value: string;
}

// View states
export type ViewState = 'LIST' | 'PLAY' | 'EDIT' | 'IMPORT' | 'CHORDS' | 'SETTINGS';

// Context shape
export interface AppContextType {
    // Song state
    songs: Song[];
    saveSong: (song: Song) => void;
    deleteSong: (id: string) => void;
    resetLibrary: () => void;

    // View state
    view: ViewState;
    setView: (view: ViewState) => void;
    activeSong: Song | undefined;
    setActiveSong: (song: Song | undefined) => void;

    // Filter state
    filter: SongFilter | null;
    setFilter: (filter: SongFilter | null) => void;

    // View mode (grid/list)
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
}

// Provider props
export interface AppProviderProps {
    children: ReactNode;
}