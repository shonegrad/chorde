import { BaseAdapter } from './base.js';
import type { SearchResult, SongContent } from '../types.js';

interface HymnIndex {
  title: string;
  artist: string;
  key: string;
  filename: string;
  path: string;
}

export class OpenHymnalAdapter extends BaseAdapter {
  id = 'openhymnal';
  name = 'OpenHymnal';

  private baseUrl = 'https://raw.githubusercontent.com/mattgraham/worship/master';
  indexCache: HymnIndex[] | null = null;
  cacheTimestamp: number = 0;
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  private async fetchIndex(): Promise<HymnIndex[]> {
    if (this.indexCache && Date.now() - this.cacheTimestamp < this.CACHE_TTL) {
      return this.indexCache;
    }

    try {
      const response = await fetch(
        'https://api.github.com/repos/mattgraham/worship/git/trees/master?recursive=1'
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = (await response.json()) as { tree?: { type: string; path: string }[] };
      const files =
        data.tree?.filter(
          (item: { type: string; path: string }) =>
            item.type === 'blob' &&
            (item.path.endsWith('.onsong') || item.path.endsWith('.chordpro'))
        ) || [];

      const index: HymnIndex[] = [];

      for (const file of files) {
        const title = file.path.replace(/\.(onsong|chordpro)$/, '').replace(/_/g, ' ');

        index.push({
          title,
          artist: '',
          key: '',
          filename: file.path,
          path: file.path,
        });
      }

      this.indexCache = index;
      this.cacheTimestamp = Date.now();
      return index;
    } catch (error) {
      console.error('Failed to fetch OpenHymnal index:', error);
      return [];
    }
  }

  async search(query: string): Promise<SearchResult[]> {
    const index = await this.fetchIndex();
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) return [];

    const results: SearchResult[] = [];

    for (const hymn of index) {
      const titleMatch = hymn.title.toLowerCase().includes(lowerQuery);
      const artistMatch = hymn.artist.toLowerCase().includes(lowerQuery);

      if (titleMatch || artistMatch) {
        results.push({
          id: encodeURIComponent(hymn.filename),
          source: this.id,
          title: hymn.title,
          artist: hymn.artist || 'Unknown',
          key: hymn.key || undefined,
        });
      }
    }

    return results.slice(0, 50);
  }

  async fetchSong(id: string): Promise<SongContent> {
    const filename = decodeURIComponent(id);
    const url = `${this.baseUrl}/${encodeURIComponent(filename)}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch song: ${response.status}`);
      }

      const rawContent = await response.text();
      const chordPro = this.convertOnSongToChordPro(rawContent, filename);
      const metadata = this.extractMetadata(chordPro);

      return {
        chordPro,
        metadata: {
          title: metadata.title ?? 'Unknown',
          artist: metadata.artist ?? 'Unknown',
          ...metadata,
        },
      };
    } catch (error) {
      console.error(`Error fetching song ${filename}:`, error);
      return {
        chordPro: `{title: ${filename.replace(/\.(onsong|chordpro)$/, '')}}\n{artist: Unknown}\n\nSong content unavailable.`,
        metadata: { title: filename.replace(/\.(onsong|chordpro)$/, ''), artist: 'Unknown' },
      };
    }
  }

  private convertOnSongToChordPro(content: string, filename: string): string {
    const lines = content.split('\n');
    const chordProLines: string[] = [];
    let inMetadata = true;
    let title = '';
    let artist = '';
    let key = '';
    let capo = '';
    let currentSection = '';

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed) continue;

      if (inMetadata) {
        if (trimmed.startsWith('Title:')) {
          title = trimmed.substring(6).trim();
          continue;
        }
        if (trimmed.startsWith('Artist:')) {
          artist = trimmed.substring(7).trim();
          continue;
        }
        if (trimmed.startsWith('Key:')) {
          key = trimmed.substring(4).trim().replace(/\[|\]/g, '');
          continue;
        }
        if (trimmed.startsWith('Capo:')) {
          capo = trimmed.substring(5).trim();
          continue;
        }
        if (
          trimmed.startsWith('CCLI:') ||
          trimmed.startsWith('Original Key:') ||
          trimmed.startsWith('Notes:') ||
          trimmed.startsWith('Book:')
        ) {
          continue;
        }

        if (trimmed.includes(':') && !trimmed.match(/\[.*\]/)) {
          continue;
        }

        if (trimmed.match(/\[.*\]/) || trimmed.match(/\w/)) {
          inMetadata = false;
        }
      }

      if (!inMetadata) {
        if (trimmed.match(/^(Verse|Chorus|Bridge|Pre-Chorus|Intro|Outro|Interlude|Tag)\s*\d*:?/i)) {
          const sectionMatch = trimmed.match(
            /^(Verse|Chorus|Bridge|Pre-Chorus|Intro|Outro|Interlude|Tag)\s*(\d*)/i
          );
          if (sectionMatch) {
            const sectionType = sectionMatch[1].toLowerCase().replace('-', '_');
            const num = sectionMatch[2];

            if (currentSection) {
              chordProLines.push(`{end_of_${currentSection}}`);
            }

            currentSection = num ? `${sectionType}${num}` : sectionType;
            chordProLines.push(`{start_of_${currentSection}}`);
            continue;
          }
        }

        const chordProLine = this.convertLine(trimmed);
        if (chordProLine) {
          chordProLines.push(chordProLine);
        }
      }
    }

    if (currentSection) {
      chordProLines.push(`{end_of_${currentSection}}`);
    }

    const titleFromFilename = filename.replace(/\.(onsong|chordpro)$/, '').replace(/_/g, ' ');

    const header: string[] = [];
    header.push(`{title: ${title || titleFromFilename}}`);
    if (artist) header.push(`{artist: ${artist}}`);
    if (key) header.push(`{key: ${key}}`);
    if (capo) header.push(`{capo: ${capo}}`);
    header.push('');

    return [...header, ...chordProLines].join('\n');
  }

  private convertLine(line: string): string {
    if (!line.match(/\[.*?\]/)) {
      return line;
    }

    return line.replace(/\[(.*?)\]/g, '[$1]');
  }
}
