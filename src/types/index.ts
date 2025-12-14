export interface Song {
    id: string;
    title: string;
    artist: string;
    content: string; // The raw ChordPro string
    capo?: number;
    tags?: string[];
    isCustom?: boolean;
    sections?: SongSection[];
    key?: string; // Musical key, e.g., "C", "Am", "F#m"
    tempo?: number; // BPM (beats per minute)
    createdAt: number;
    updatedAt: number;
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
