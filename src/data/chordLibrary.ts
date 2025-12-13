export interface ChordVariation {
    frets: (number | 'x')[]; // Fret numbers for each string (low E to high e), 'x' for muted
    fingers: (number | 'x')[]; // Finger numbers (0=open, 1-4=fingers, x=muted)
    barres?: number[]; // Fret numbers where barre is applied
    suffix?: string; // "open", "barre", "moveable", etc.
}

export interface ChordDefinition {
    name: string;
    fullName: string;
    variations: ChordVariation[];
}

export const CHORD_LIBRARY: Record<string, ChordDefinition> = {
    // MAJOR CHORDS
    'C': {
        name: 'C',
        fullName: 'C Major',
        variations: [
            { frets: ['x', 3, 2, 0, 1, 0], fingers: ['x', 3, 2, 0, 1, 0], suffix: 'open' },
            { frets: [3, 3, 5, 5, 5, 3], fingers: [1, 1, 3, 3, 3, 1], barres: [3], suffix: 'barre' },
        ]
    },
    'D': {
        name: 'D',
        fullName: 'D Major',
        variations: [
            { frets: ['x', 'x', 0, 2, 3, 2], fingers: ['x', 'x', 0, 1, 3, 2], suffix: 'open' },
            { frets: [5, 5, 7, 7, 7, 5], fingers: [1, 1, 3, 3, 3, 1], barres: [5], suffix: 'barre' },
        ]
    },
    'E': {
        name: 'E',
        fullName: 'E Major',
        variations: [
            { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], suffix: 'open' },
            { frets: [7, 7, 9, 9, 9, 7], fingers: [1, 1, 3, 3, 3, 1], barres: [7], suffix: 'barre' },
        ]
    },
    'F': {
        name: 'F',
        fullName: 'F Major',
        variations: [
            { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], barres: [1], suffix: 'barre' },
            { frets: ['x', 'x', 3, 2, 1, 1], fingers: ['x', 'x', 3, 2, 1, 1], suffix: 'partial' },
        ]
    },
    'G': {
        name: 'G',
        fullName: 'G Major',
        variations: [
            { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], suffix: 'open' },
            { frets: [3, 5, 5, 4, 3, 3], fingers: [1, 3, 4, 2, 1, 1], barres: [3], suffix: 'barre' },
        ]
    },
    'A': {
        name: 'A',
        fullName: 'A Major',
        variations: [
            { frets: ['x', 0, 2, 2, 2, 0], fingers: ['x', 0, 1, 2, 3, 0], suffix: 'open' },
            { frets: [5, 7, 7, 6, 5, 5], fingers: [1, 3, 4, 2, 1, 1], barres: [5], suffix: 'barre' },
        ]
    },
    'B': {
        name: 'B',
        fullName: 'B Major',
        variations: [
            { frets: ['x', 2, 4, 4, 4, 2], fingers: ['x', 1, 3, 3, 3, 1], barres: [2, 4], suffix: 'barre' },
            { frets: [7, 9, 9, 8, 7, 7], fingers: [1, 3, 4, 2, 1, 1], barres: [7], suffix: 'barre' },
        ]
    },

    // MINOR CHORDS
    'Am': {
        name: 'Am',
        fullName: 'A Minor',
        variations: [
            { frets: ['x', 0, 2, 2, 1, 0], fingers: ['x', 0, 2, 3, 1, 0], suffix: 'open' },
            { frets: [5, 7, 7, 5, 5, 5], fingers: [1, 3, 4, 1, 1, 1], barres: [5], suffix: 'barre' },
        ]
    },
    'Dm': {
        name: 'Dm',
        fullName: 'D Minor',
        variations: [
            { frets: ['x', 'x', 0, 2, 3, 1], fingers: ['x', 'x', 0, 2, 3, 1], suffix: 'open' },
            { frets: [5, 6, 7, 7, 6, 5], fingers: [1, 2, 3, 4, 2, 1], suffix: 'barre' },
        ]
    },
    'Em': {
        name: 'Em',
        fullName: 'E Minor',
        variations: [
            { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 1, 2, 0, 0, 0], suffix: 'open' },
            { frets: [7, 7, 9, 9, 8, 7], fingers: [1, 1, 3, 4, 2, 1], barres: [7], suffix: 'barre' },
        ]
    },
    'C#m': {
        name: 'C#m',
        fullName: 'C# Minor',
        variations: [
            { frets: ['x', 4, 6, 6, 5, 4], fingers: ['x', 1, 3, 4, 2, 1], barres: [4], suffix: 'barre' },
        ]
    },

    // 7TH CHORDS
    'G7': {
        name: 'G7',
        fullName: 'G Dominant 7th',
        variations: [
            { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], suffix: 'open' },
        ]
    },
    'D7': {
        name: 'D7',
        fullName: 'D Dominant 7th',
        variations: [
            { frets: ['x', 'x', 0, 2, 1, 2], fingers: ['x', 'x', 0, 2, 1, 3], suffix: 'open' },
        ]
    },
    'A7': {
        name: 'A7',
        fullName: 'A Dominant 7th',
        variations: [
            { frets: ['x', 0, 2, 0, 2, 0], fingers: ['x', 0, 2, 0, 3, 0], suffix: 'open' },
        ]
    },
    'E7': {
        name: 'E7',
        fullName: 'E Dominant 7th',
        variations: [
            { frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], suffix: 'open' },
        ]
    },
    'B7': {
        name: 'B7',
        fullName: 'B Dominant 7th',
        variations: [
            { frets: ['x', 2, 1, 2, 0, 2], fingers: ['x', 2, 1, 3, 0, 4], suffix: 'open' },
        ]
    },

    // MINOR 7TH
    'Am7': {
        name: 'Am7',
        fullName: 'A Minor 7th',
        variations: [
            { frets: ['x', 0, 2, 0, 1, 0], fingers: ['x', 0, 2, 0, 1, 0], suffix: 'open' },
        ]
    },
    'Em7': {
        name: 'Em7',
        fullName: 'E Minor 7th',
        variations: [
            { frets: [0, 2, 0, 0, 0, 0], fingers: [0, 2, 0, 0, 0, 0], suffix: 'open' },
            { frets: [0, 2, 2, 0, 3, 0], fingers: [0, 1, 2, 0, 3, 0], suffix: 'open alt' },
        ]
    },
    'Dm7': {
        name: 'Dm7',
        fullName: 'D Minor 7th',
        variations: [
            { frets: ['x', 'x', 0, 2, 1, 1], fingers: ['x', 'x', 0, 2, 1, 1], suffix: 'open' },
        ]
    },

    // MAJOR 7TH
    'Cmaj7': {
        name: 'Cmaj7',
        fullName: 'C Major 7th',
        variations: [
            { frets: ['x', 3, 2, 0, 0, 0], fingers: ['x', 3, 2, 0, 0, 0], suffix: 'open' },
        ]
    },
    'Gmaj7': {
        name: 'Gmaj7',
        fullName: 'G Major 7th',
        variations: [
            { frets: [3, 2, 0, 0, 0, 2], fingers: [3, 2, 0, 0, 0, 4], suffix: 'open' },
        ]
    },
    'Fmaj7': {
        name: 'Fmaj7',
        fullName: 'F Major 7th',
        variations: [
            { frets: ['x', 'x', 3, 2, 1, 0], fingers: ['x', 'x', 3, 2, 1, 0], suffix: 'partial' },
            { frets: [1, 3, 2, 2, 1, 0], fingers: [1, 3, 2, 2, 1, 0], suffix: 'full' },
        ]
    },

    // SUSPENDED
    'Asus2': {
        name: 'Asus2',
        fullName: 'A Suspended 2nd',
        variations: [
            { frets: ['x', 0, 2, 2, 0, 0], fingers: ['x', 0, 2, 3, 0, 0], suffix: 'open' },
        ]
    },
    'Dsus2': {
        name: 'Dsus2',
        fullName: 'D Suspended 2nd',
        variations: [
            { frets: ['x', 'x', 0, 2, 3, 0], fingers: ['x', 'x', 0, 1, 2, 0], suffix: 'open' },
        ]
    },

    // DIMINISHED / HALF-DIMINISHED
    'F#m7b5': {
        name: 'F#m7b5',
        fullName: 'F# Half-Diminished 7th',
        variations: [
            { frets: [2, 0, 2, 2, 1, 0], fingers: [2, 0, 3, 4, 1, 0], suffix: 'open' },
        ]
    },
    'Bm7b5': {
        name: 'Bm7b5',
        fullName: 'B Half-Diminished 7th',
        variations: [
            { frets: ['x', 2, 3, 2, 3, 'x'], fingers: ['x', 1, 2, 1, 3, 'x'], suffix: 'partial' },
        ]
    },

    // USEFUL GRUNGE/ROCK POWER CHORDS (implied root + 5th)
    'A5': {
        name: 'A5',
        fullName: 'A Power Chord',
        variations: [
            { frets: ['x', 0, 2, 2, 'x', 'x'], fingers: ['x', 0, 1, 1, 'x', 'x'], suffix: 'open' },
            { frets: [5, 7, 7, 'x', 'x', 'x'], fingers: [1, 3, 4, 'x', 'x', 'x'], suffix: 'moveable' },
        ]
    },
    'E5': {
        name: 'E5',
        fullName: 'E Power Chord',
        variations: [
            { frets: [0, 2, 2, 'x', 'x', 'x'], fingers: [0, 1, 1, 'x', 'x', 'x'], suffix: 'open' },
        ]
    },
    'D5': {
        name: 'D5',
        fullName: 'D Power Chord',
        variations: [
            { frets: ['x', 'x', 0, 2, 3, 'x'], fingers: ['x', 'x', 0, 1, 2, 'x'], suffix: 'open' },
        ]
    },

    // JAZZ COMMON
    'Cadd9': {
        name: 'Cadd9',
        fullName: 'C Add 9',
        variations: [
            { frets: ['x', 3, 2, 0, 3, 0], fingers: ['x', 2, 1, 0, 3, 0], suffix: 'open' },
        ]
    },
};

export function getChord(chordName: string): ChordDefinition | null {
    // Normalize the chord name (basic)
    const normalized = chordName.trim();
    return CHORD_LIBRARY[normalized] || null;
}
