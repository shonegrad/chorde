import { SourceAdapter, type SearchResult, type SongContent } from '../types.js';

// Abstract base class for source adapters
export abstract class BaseAdapter implements SourceAdapter {
  abstract id: string;
  abstract name: string;
  license: string = 'unknown';

  abstract search(query: string): Promise<SearchResult[]>;
  abstract fetchSong(id: string): Promise<SongContent>;

  /**
   * Optional: fill in details that only the song file knows, such as the
   * writer or the key. Only the first few results are usually enriched.
   */
  enrichResults?(results: SearchResult[]): Promise<SearchResult[]>;

  normalizeChordPro(content: string): string {
    // Ensure consistent ChordPro formatting
    return content.trim();
  }

  extractMetadata(chordPro: string): {
    title?: string;
    artist?: string;
    key?: string;
    capo?: number;
  } {
    const metadata: {
      title?: string;
      artist?: string;
      key?: string;
      capo?: number;
    } = {};

    const titleMatch = chordPro.match(/\{title?:\s*([^}]+)\}/i);
    if (titleMatch) metadata.title = titleMatch[1].trim();

    const artistMatch = chordPro.match(/\{(?:artist|subtitle):\s*([^}]+)\}/i);
    if (artistMatch) metadata.artist = artistMatch[1].trim();

    const keyMatch = chordPro.match(/\{key:\s*([^}]+)\}/i);
    if (keyMatch) metadata.key = keyMatch[1].trim();

    const capoMatch = chordPro.match(/\{capo:\s*(\d+)\}/i);
    if (capoMatch) metadata.capo = parseInt(capoMatch[1]);

    return metadata;
  }
}
