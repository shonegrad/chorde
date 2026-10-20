export interface Source {
  id: string;
  name: string;
  icon?: string;
  enabled: boolean;
  license?: string;
}

export type SourceLicense =
  | 'public-domain'
  | 'creative-commons-by'
  | 'creative-commons-by-sa'
  | 'creative-commons-nc'
  | 'unknown';

export interface SearchResult {
  id: string;
  source: string;
  title: string;
  artist: string;
  key?: string;
  preview?: string;
  hasChords?: boolean;
  license?: string;
}

export interface SongContent {
  chordPro: string;
  metadata: {
    title: string;
    artist: string;
    key?: string;
    capo?: number;
  };
  license?: string;
  sourceName?: string;
  sourceUrl?: string;
}

export interface SourceAdapter {
  id: string;
  name: string;
  search(query: string): Promise<SearchResult[]>;
  fetchSong(id: string): Promise<SongContent>;
}
