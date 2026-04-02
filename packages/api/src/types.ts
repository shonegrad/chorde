// Shared types for search functionality

export interface Source {
  id: string;
  name: string;
  icon?: string;
  enabled: boolean;
}

export interface SearchResult {
  id: string;
  source: string;
  title: string;
  artist: string;
  key?: string;
  preview?: string;
  hasChords?: boolean;
}

export interface SongContent {
  chordPro: string; // Full ChordPro content
  metadata: {
    title: string;
    artist: string;
    key?: string;
    capo?: number;
  };
}

export interface SourceAdapter {
  id: string;
  name: string;
  search(query: string): Promise<SearchResult[]>;
  fetchSong(id: string): Promise<SongContent>;
}
