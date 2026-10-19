import { BaseAdapter } from './base.js';
import type { SearchResult, SongContent } from '../types.js';

interface SessionTune {
  abc_id: number;
  title: string;
  collector?: string;
  composer?: string;
  key?: string;
  meter?: string;
  parts: Array<{
    part?: string;
    measure?: string;
    music?: string;
  }>;
  fields: Record<string, string>;
  headers: Record<string, string>;
}

const SESSION_API_BASE = 'https://thesession.org';

export class SessionAdapter extends BaseAdapter {
  id = 'session';
  name = 'The Session';
  license = 'creative-commons-by-sa'; // The Session tunes are CC-BY-SA 4.0

  async search(query: string): Promise<SearchResult[]> {
    try {
      const response = await fetch(`${SESSION_API_BASE}/search/${encodeURIComponent(query)}`);

      if (!response.ok) {
        console.error('The Session search failed:', response.status);
        return [];
      }

      const data = (await response.json()) as { tunes: SessionTune[] };
      const results: SearchResult[] = [];

      for (const tune of data.tunes.slice(0, 20)) {
        // Check license - The Session tunes are typically CC-BY-SA or public domain
        const license = tune.fields.license || 'unknown';

        results.push({
          id: tune.abc_id.toString(),
          source: this.id,
          title: tune.title,
          artist: tune.composer || 'Traditional',
          key: tune.key || undefined,
          preview: tune.fields.transcription ? undefined : '',
          hasChords: false,
          license,
        });
      }

      return results;
    } catch (error) {
      console.error('Error searching The Session:', error);
      return [];
    }
  }

  async fetchSong(id: string): Promise<SongContent> {
    const abcId = parseInt(id, 10);

    try {
      const response = await fetch(`${SESSION_API_BASE}/abc/${abcId}`);

      if (!response.ok) {
        throw new Error(`The Session fetch failed: ${response.status}`);
      }

      const abcContent = await response.text();
      const chordPro = this.convertABCToChordPro(abcContent);
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
      console.error(`Error fetching The Session tune ${abcId}:`, error);
      return {
        chordPro: `{title: Tune Not Found}\n{artist: Unknown}\n\nTune content not available.`,
        metadata: { title: 'Tune Not Found', artist: 'Unknown' },
      };
    }
  }

  private convertABCToChordPro(abc: string): string {
    // This is a simplified version - full conversion would need ABCJS or similar
    const lines = abc.split('\n');
    const chordProLines: string[] = [];
    let inMetadata = true;
    let title = '';
    let composer = '';
    let key = '';

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed) {
        if (!inMetadata) {
          chordProLines.push('');
        }
        continue;
      }

      if (inMetadata) {
        // Extract title
        if (trimmed.startsWith('X:') || trimmed.startsWith('M:') || trimmed.startsWith('L:')) {
          // Skip ABC header lines for now
        }

        // Look for X: field (tune ID) - end metadata
        if (trimmed.startsWith('X:')) {
          inMetadata = false;
          continue;
        }

        // Look for T: (title) field
        const titleMatch = trimmed.match(/^T:\s*(.+)$/);
        if (titleMatch && !title) {
          title = titleMatch[1].trim();
          continue;
        }

        // Look for C: (composer) field
        const composerMatch = trimmed.match(/^C:\s*(.+)$/);
        if (composerMatch && !composer) {
          composer = composerMatch[1].trim();
          continue;
        }

        // Look K: (key) field
        const keyMatch = trimmed.match(/^K:\s*(.+)$/);
        if (keyMatch) {
          key = keyMatch[1].trim();
          continue;
        }

        // Look for M: (meter) field
        const meterMatch = trimmed.match(/^M:\s*(.+)$/);
        if (meterMatch) {
          // Skip meter for now
        }
      }

      if (!inMetadata) {
        // This is music content
        // ABC format: [C] means chord C, but in ABC it's different from ChordPro
        // For now, just pass through the lyrics/chords as-is
        // A full conversion would require ABC notation parsing

        // Check if line contains note/chord patterns
        if (trimmed.match(/[A-Ga-g][,/]?[']?[0-9]/) || trimmed.match(/[A-Ga-g]-/)) {
          // This looks like ABC music notation - convert basic elements
          const converted = trimmed;

          // Simple chord placeholder - in full conversion, map ABC chords to ChordPro
          // [C], [G], [Am] etc. in ABC need to be converted to [C], [G], [Am] in ChordPro
          // For now, just wrap anything that looks like a chord in brackets

          // Check if line has chord symbols (capital letter followed by lowercase)
          const chordConversion = converted.replace(/\[([A-Ga-g])([,/]?[']?[0-9]*)\]/g, '[$1]');

          if (chordConversion !== converted) {
            chordProLines.push(chordConversion);
            continue;
          }
        }

        chordProLines.push(trimmed);
      }
    }

    // Add metadata header
    const header: string[] = [];
    if (title) header.push(`{title: ${title}}`);
    if (composer) header.push(`{artist: ${composer}}`);
    if (key) header.push(`{key: ${key}}`);
    header.push('');

    return [...header, ...chordProLines].join('\n');
  }

  extractMetadata(chordPro: string): {
    title?: string;
    artist?: string;
    key?: string;
  } {
    const metadata: {
      title?: string;
      artist?: string;
      key?: string;
    } = {};

    const titleMatch = chordPro.match(/\{title:\s*([^}]+)\}/i);
    if (titleMatch) metadata.title = titleMatch[1].trim();

    const artistMatch = chordPro.match(/\{artist:\s*([^}]+)\}/i);
    if (artistMatch) metadata.artist = artistMatch[1].trim();

    const keyMatch = chordPro.match(/\{key:\s*([^}]+)\}/i);
    if (keyMatch) metadata.key = keyMatch[1].trim();

    return metadata;
  }
}
