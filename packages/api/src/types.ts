// Shared types — re-exported from @chorde/shared for consistency
export type { Source, SearchResult, SongContent } from '@chorde/shared/src/index';

// API-specific interface (not shared with web)
export interface SourceAdapter {
  id: string;
  name: string;
  search(query: string): Promise<SearchResult[]>;
  fetchSong(id: string): Promise<SongContent>;
}
