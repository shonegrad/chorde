export interface Song {
    id: string;
    title: string;
    artist: string;
    content: string; // normalized body, ChordPro if available
    format?: 'chordpro' | 'plaintext' | 'unknown';
    capo?: number;
    tags?: string[];
    sections?: SongSection[];
    key?: string;
    bpm?: number; // BPM (beats per minute)
    timeSignature?: string; // default "4/4"
    attribution?: {
        sourceName: string;
        sourceUrl: string;
        license: string; // e.g. "CC BY-SA 4.0", "CC0", "Public Domain"
        author?: string;
        notes?: string;
    };
    rightsStatus?: 'open' | 'unknown' | 'restricted';
    createdAt: string | number; // ISO timestamp, legacy numbers supported
    updatedAt: string | number; // ISO timestamp, legacy numbers supported
    hash?: string; // content hash for sync/dedupe
}

export interface ParsedLine {
    items: Array<{
        lyric: string;
        chord?: string;
    }>;
    section?: SongSection; // Section marker if this line starts a new section
}

export interface SongSection {
    type: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'solo' | 'instrumental';
    label?: string; // e.g., "Verse 1", "Chorus", etc.
    lineIndex: number; // Index in the parsed song array
}

export type DisplayMode = 'chords' | 'tabs' | 'notation' | 'nashville';

export type ViewMode = 'grid' | 'list';

export type ParsedSong = ParsedLine[];
