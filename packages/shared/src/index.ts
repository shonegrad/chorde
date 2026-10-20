export type LicenseType =
  | 'public-domain' // CC0, PD
  | 'creative-commons-by' // CC BY 4.0
  | 'creative-commons-by-sa' // CC BY-SA 4.0 (share-alike)
  | 'creative-commons-nc' // CC NC
  | 'creative-commons-zero' // CC0
  | 'custom' // Custom license terms
  | 'unknown';

export interface SongAttribution {
  sourceName: string;
  sourceUrl: string;
  license: LicenseType;
  author?: string;
  notes?: string;
  copyright?: string; // Raw {copyright:} directive from ChordPro
  verifiedAt?: string; // ISO date of verification
  verifiedBy: 'auto' | 'manual';
}

/** Where a song came from. */
export type SongOrigin = 'builtin' | 'import' | 'user';

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
  /** How long the song takes, e.g. "4:28". */
  duration?: string;
  /** Notes for whoever is playing, e.g. "play quietly here". */
  notes?: string;
  /** Marked as a favourite, so it can be found again quickly. */
  favorite?: boolean;
  /** Whether this is one of the built-in songs, an import, or your own. */
  origin?: SongOrigin;
  attribution: SongAttribution;
  rightsStatus: 'open' | 'conditional' | 'unknown' | 'restricted';
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
  type: 'tag' | 'artist' | 'key' | 'favourite' | 'mine';
  value: string;
}

export interface Source {
  id: string;
  name: string;
  icon?: string;
  enabled: boolean;
  license?: LicenseType;
}

export interface SearchResult {
  id: string;
  source: string;
  title: string;
  artist: string;
  key?: string;
  preview?: string;
  hasChords?: boolean;
  /** License the source publishes its material under, when known. */
  license?: LicenseType;
}

export interface SongContent {
  chordPro: string;
  metadata: {
    title: string;
    artist: string;
    key?: string;
    capo?: number;
  };
  /** License the source publishes this particular song under, when known. */
  license?: LicenseType;
  /** Human readable name of the source, used for attribution. */
  sourceName?: string;
  sourceUrl?: string;
}

/** A song in a setlist, with how it should be played. */
export interface SetlistSong {
  songId: string;
  /** How many semitones to transpose this song when playing it. */
  transpose?: number;
  /** The capo to use for this song. */
  capo?: number;
  /** A note for whoever is playing. */
  note?: string;
}

export interface Setlist {
  id: string;
  name: string;
  songs: SetlistSong[];
  /** The key the whole set is played in. */
  targetKey?: string;
  /** A note for the set as a whole. */
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SourceAdapter {
  id: string;
  name: string;
  search(query: string): Promise<SearchResult[]>;
  fetchSong(id: string): Promise<SongContent>;
  /**
   * Optional: fill in details that only the song file knows, such as the
   * writer or the key. Only the first few results are usually enriched.
   */
  enrichResults?(results: SearchResult[]): Promise<SearchResult[]>;
}
