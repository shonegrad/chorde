export interface Song {
  id: string;
  title: string;
  artist: string;
  content: string;
  format?: 'chordpro' | 'plaintext' | 'unknown';
  capo?: number;
  tags?: string[];
  sections?: SongSection[];
  key?: string;
  bpm?: number;
  timeSignature?: string;
  attribution?: {
    sourceName: string;
    sourceUrl: string;
    license: string;
    author?: string;
    notes?: string;
  };
  rightsStatus?: 'open' | 'unknown' | 'restricted';
  createdAt: string | number;
  updatedAt: string | number;
  hash?: string;
}

export interface SongSection {
  type: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'solo' | 'instrumental' | 'tab';
  label?: string;
  lineIndex: number;
  isTab?: boolean;
}

export interface ParsedLine {
  items: Array<{
    lyric: string;
    chord?: string;
  }>;
  section?: SongSection;
}

export type DisplayMode = 'chords' | 'tabs' | 'notation' | 'nashville';
export type ViewMode = 'grid' | 'list';
export type ParsedSong = ParsedLine[];

export interface SongFilter {
  type: 'tag' | 'artist' | 'key';
  value: string;
}

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
  chordPro: string;
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
