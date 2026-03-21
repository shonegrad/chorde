import { SourceAdapter } from '../types.js';

// Abstract base class for source adapters
export abstract class BaseAdapter implements SourceAdapter {
  abstract id: string;
  abstract name: string;
  
  abstract search(query: string): Promise<any[]>;
  abstract fetchSong(id: string): Promise<any>;
  
  protected normalizeChordPro(content: string): string {
    // Ensure consistent ChordPro formatting
    return content.trim();
  }
  
  protected extractMetadata(chordPro: string): {
    title?: string;
    artist?: string;
    key?: string;
    capo?: number;
  } {
    const metadata: any = {};
    
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
