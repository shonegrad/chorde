import { resolveApiBaseUrl } from '../lib/features';
import type { SearchResult, SongContent, Source } from '../types';

export type { SearchResult, SongContent, Source };

export interface FailedSource {
  source: string;
  name: string;
  error: string;
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  failedSources?: FailedSource[];
}

const DEFAULT_TIMEOUT_MS = 15000;

class SearchApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = resolveApiBaseUrl()) {
    this.baseUrl = baseUrl;
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  private async request(path: string, init?: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    try {
      return await fetch(this.url(path), { ...init, signal: controller.signal });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Request timed out. The server took too long to respond.');
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async getSources(): Promise<Source[]> {
    const response = await this.request('/api/sources');
    if (!response.ok) {
      throw new Error('Failed to fetch sources');
    }
    return response.json();
  }

  async search(query: string, sources?: string[]): Promise<SearchResponse> {
    const params = new URLSearchParams({ q: query });
    if (sources && sources.length > 0) {
      params.append('sources', sources.join(','));
    }

    const response = await this.request(`/api/search?${params.toString()}`);
    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        throw new Error(
          `Too many requests. Please wait${retryAfter ? ` ${retryAfter}s` : ' a moment'} and try again.`
        );
      }
      throw new Error('Search failed');
    }
    return response.json();
  }

  async fetchSong(source: string, id: string): Promise<SongContent> {
    // Source ids are already URL-safe (the API encodes them when listing
    // results), so they are passed through unchanged to avoid double encoding.
    const response = await this.request(`/api/song/${encodeURIComponent(source)}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch song');
    }
    return response.json();
  }
}

export const searchApi = new SearchApiClient();
