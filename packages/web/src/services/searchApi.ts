// API client for search functionality

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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class SearchApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getSources(): Promise<Source[]> {
    const response = await fetch(`${this.baseUrl}/api/sources`);
    if (!response.ok) {
      throw new Error('Failed to fetch sources');
    }
    return response.json();
  }

  async search(
    query: string,
    sources?: string[]
  ): Promise<{ results: SearchResult[]; totalCount: number }> {
    const params = new URLSearchParams({ q: query });
    if (sources && sources.length > 0) {
      params.append('sources', sources.join(','));
    }

    const response = await fetch(`${this.baseUrl}/api/search?${params}`);
    if (!response.ok) {
      throw new Error('Search failed');
    }
    return response.json();
  }

  async fetchSong(source: string, id: string): Promise<SongContent> {
    const response = await fetch(`${this.baseUrl}/api/song/${source}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch song');
    }
    return response.json();
  }
}

export const searchApi = new SearchApiClient();
