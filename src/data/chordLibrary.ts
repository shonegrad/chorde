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
            { frets: ['x', 3, 5, 5, 5, 3], fingers: ['x', 1, 3, 3, 3, 1], barres: [3], suffix: 'barre (A-shape)' },
            { frets: [8, 10, 10, 9, 8, 8], fingers: [1, 3, 4, 2, 1, 1], barres: [8], suffix: 'barre (E-shape)' },
        ]
    },
    'D': {
        name: 'D',
        fullName: 'D Major',
        variations: [
            { frets: ['x', 'x', 0, 2, 3, 2], fingers: ['x', 'x', 0, 1, 3, 2], suffix: 'open' },
            { frets: ['x', 5, 7, 7, 7, 5], fingers: ['x', 1, 3, 3, 3, 1], barres: [5], suffix: 'barre (A-shape)' },
            { frets: [10, 12, 12, 11, 10, 10], fingers: [1, 3, 4, 2, 1, 1], barres: [10], suffix: 'barre (E-shape)' },
        ]
    },
    'E': {
        name: 'E',
        fullName: 'E Major',
        variations: [
            { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], suffix: 'open' },
            { frets: ['x', 7, 9, 9, 9, 7], fingers: ['x', 1, 3, 3, 3, 1], barres: [7], suffix: 'barre (A-shape)' },
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
            { frets: [3, 5, 5, 4, 3, 3], fingers: [1, 3, 4, 2, 1, 1], barres: [3], suffix: 'barre (E-shape)' },
            { frets: ['x', 10, 12, 12, 12, 10], fingers: ['x', 1, 3, 3, 3, 1], barres: [10], suffix: 'barre (A-shape)' },
        ]
    },
    'A': {
        name: 'A',
        fullName: 'A Major',
        variations: [
            { frets: ['x', 0, 2, 2, 2, 0], fingers: ['x', 0, 1, 2, 3, 0], suffix: 'open' },
            { frets: [5, 7, 7, 6, 5, 5], fingers: [1, 3, 4, 2, 1, 1], barres: [5], suffix: 'barre (E-shape)' },
            { frets: ['x', 0, 7, 6, 5, 5], fingers: ['x', 0, 3, 2, 1, 1], suffix: 'triad variant' },
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
            { frets: [9, 11, 11, 9, 9, 9], fingers: [1, 3, 4, 1, 1, 1], barres: [9], suffix: 'barre' },
        ]
    },

    // 7TH CHORDS
    'G7': {
        name: 'G7',
        fullName: 'G Dominant 7th',
        variations: [
            { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], suffix: 'open' },
            { frets: [3, 5, 3, 4, 3, 3], fingers: [1, 3, 1, 2, 1, 1], barres: [3], suffix: 'barre' },
        ]
    },
    'D7': {
        name: 'D7',
        fullName: 'D Dominant 7th',
        variations: [
            { frets: ['x', 'x', 0, 2, 1, 2], fingers: ['x', 'x', 0, 2, 1, 3], suffix: 'open' },
            { frets: ['x', 5, 7, 5, 7, 5], fingers: ['x', 1, 3, 1, 4, 1], barres: [5], suffix: 'barre' },
        ]
    },
    'A7': {
        name: 'A7',
        fullName: 'A Dominant 7th',
        variations: [
            { frets: ['x', 0, 2, 0, 2, 0], fingers: ['x', 0, 2, 0, 3, 0], suffix: 'open' },
            { frets: [5, 7, 5, 6, 5, 5], fingers: [1, 3, 1, 2, 1, 1], barres: [5], suffix: 'barre' },
        ]
    },
    'E7': {
        name: 'E7',
        fullName: 'E Dominant 7th',
        variations: [
            { frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], suffix: 'open' },
            { frets: ['x', 7, 9, 7, 9, 7], fingers: ['x', 1, 3, 1, 4, 1], barres: [7], suffix: 'barre' },
        ]
    },
    'B7': {
        name: 'B7',
        fullName: 'B Dominant 7th',
        variations: [
            { frets: ['x', 2, 1, 2, 0, 2], fingers: ['x', 2, 1, 3, 0, 4], suffix: 'open' },
            { frets: [7, 9, 7, 8, 7, 7], fingers: [1, 3, 1, 2, 1, 1], barres: [7], suffix: 'barre' },
        ]
    },

    // MINOR 7TH
    'Am7': {
        name: 'Am7',
        fullName: 'A Minor 7th',
        variations: [
            { frets: ['x', 0, 2, 0, 1, 0], fingers: ['x', 0, 1, 0, 2, 0], suffix: 'open' },
            { frets: [5, 7, 5, 5, 5, 5], fingers: [1, 3, 1, 1, 1, 1], barres: [5], suffix: 'barre' },
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
            { frets: ['x', 5, 7, 5, 6, 5], fingers: ['x', 1, 3, 1, 2, 1], barres: [5], suffix: 'barre' },
        ]
    },

    // MAJOR 7TH
    'Cmaj7': {
        name: 'Cmaj7',
        fullName: 'C Major 7th',
        variations: [
            { frets: ['x', 3, 2, 0, 0, 0], fingers: ['x', 3, 2, 0, 0, 0], suffix: 'open' },
            { frets: ['x', 3, 5, 4, 5, 3], fingers: ['x', 1, 3, 2, 4, 1], barres: [3], suffix: 'barre' },
        ]
    },
    'Gmaj7': {
        name: 'Gmaj7',
        fullName: 'G Major 7th',
        variations: [
            { frets: [3, 2, 0, 0, 0, 2], fingers: [3, 2, 0, 0, 0, 4], suffix: 'open' },
            { frets: ['x', 'x', 5, 7, 7, 7], fingers: ['x', 'x', 1, 3, 3, 3], barres: [7], suffix: 'partial' },
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
            { frets: ['x', 9, 10, 9, 10, 'x'], fingers: ['x', 1, 3, 2, 4, 'x'], suffix: 'movable' },
        ]
    },
    'Bm7b5': {
        name: 'Bm7b5',
        fullName: 'B Half-Diminished 7th',
        variations: [
            { frets: ['x', 2, 3, 2, 3, 'x'], fingers: ['x', 1, 2, 1, 3, 'x'], suffix: 'partial' },
            { frets: [7, 8, 7, 7, 'x', 'x'], fingers: [1, 2, 1, 1, 'x', 'x'], barres: [7], suffix: 'movable' },
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
            { frets: ['x', 7, 9, 9, 'x', 'x'], fingers: ['x', 1, 3, 4, 'x', 'x'], barres: [7], suffix: 'moveable' },
        ]
    },
    'D5': {
        name: 'D5',
        fullName: 'D Power Chord',
        variations: [
            { frets: ['x', 'x', 0, 2, 3, 'x'], fingers: ['x', 'x', 0, 1, 2, 'x'], suffix: 'open' },
            { frets: ['x', 5, 7, 7, 'x', 'x'], fingers: ['x', 1, 3, 4, 'x', 'x'], barres: [5], suffix: 'moveable' },
        ]
    },

    // JAZZ COMMON
    'Cadd9': {
        name: 'Cadd9',
        fullName: 'C Add 9',
        variations: [
            { frets: ['x', 3, 2, 0, 3, 0], fingers: ['x', 2, 1, 0, 3, 0], suffix: 'open' },
            { frets: ['x', 3, 2, 0, 3, 3], fingers: ['x', 2, 1, 0, 3, 4], suffix: 'open alt' },
        ]
    },

    // TOP 20 MOST COMMON MISSING CHORDS (by frequency in song library)
    'Bb': {
        name: 'Bb',
        fullName: 'B♭ Major',
        variations: [
            { frets: ['x', 1, 3, 3, 3, 1], fingers: ['x', 1, 3, 3, 3, 1], barres: [1, 3], suffix: 'barre' },
            { frets: [6, 8, 8, 7, 6, 6], fingers: [1, 3, 4, 2, 1, 1], barres: [6], suffix: 'barre' },
        ]
    },
    'F#': {
        name: 'F#',
        fullName: 'F# Major',
        variations: [
            { frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], barres: [2], suffix: 'barre' },
            { frets: ['x', 'x', 4, 3, 2, 2], fingers: ['x', 'x', 4, 3, 1, 1], suffix: 'partial' },
        ]
    },
    'C7': {
        name: 'C7',
        fullName: 'C Dominant 7th',
        variations: [
            { frets: ['x', 3, 2, 3, 1, 0], fingers: ['x', 3, 2, 4, 1, 0], suffix: 'open' },
            { frets: [8, 10, 10, 9, 8, 8], fingers: [1, 3, 4, 2, 1, 1], barres: [8], suffix: 'barre' },
        ]
    },
    'Bb7': {
        name: 'Bb7',
        fullName: 'B♭ Dominant 7th',
        variations: [
            { frets: ['x', 1, 3, 1, 3, 1], fingers: ['x', 1, 3, 1, 4, 1], barres: [1], suffix: 'barre' },
            { frets: [6, 8, 6, 7, 6, 6], fingers: [1, 3, 1, 2, 1, 1], barres: [6], suffix: 'barre' },
        ]
    },
    'F7': {
        name: 'F7',
        fullName: 'F Dominant 7th',
        variations: [
            { frets: [1, 3, 1, 2, 1, 1], fingers: [1, 3, 1, 2, 1, 1], barres: [1], suffix: 'barre' },
            { frets: ['x', 'x', 3, 2, 4, 5], fingers: ['x', 'x', 1, 0, 2, 3], suffix: 'partial' },
        ]
    },
    'Bm': {
        name: 'Bm',
        fullName: 'B Minor',
        variations: [
            { frets: ['x', 2, 4, 4, 3, 2], fingers: ['x', 1, 3, 4, 2, 1], barres: [2], suffix: 'barre' },
            { frets: [7, 9, 9, 7, 7, 7], fingers: [1, 3, 4, 1, 1, 1], barres: [7], suffix: 'barre' },
        ]
    },
    'Fm7': {
        name: 'Fm7',
        fullName: 'F Minor 7th',
        variations: [
            { frets: [1, 3, 1, 1, 1, 1], fingers: [1, 3, 1, 1, 1, 1], barres: [1], suffix: 'barre' },
            { frets: ['x', 'x', 3, 1, 1, 1], fingers: ['x', 'x', 3, 1, 1, 1], suffix: 'partial' },
        ]
    },
    'Ebm7': {
        name: 'Ebm7',
        fullName: 'E♭ Minor 7th',
        variations: [
            { frets: ['x', 6, 8, 6, 7, 6], fingers: ['x', 1, 3, 1, 2, 1], barres: [6], suffix: 'barre' },
            { frets: [11, 13, 11, 11, 11, 11], fingers: [1, 3, 1, 1, 1, 1], barres: [11], suffix: 'barre' },
        ]
    },
    'Cm7': {
        name: 'Cm7',
        fullName: 'C Minor 7th',
        variations: [
            { frets: ['x', 3, 5, 3, 4, 3], fingers: ['x', 1, 3, 1, 2, 1], barres: [3], suffix: 'barre' },
            { frets: [8, 10, 8, 8, 8, 8], fingers: [1, 3, 1, 1, 1, 1], barres: [8], suffix: 'barre' },
        ]
    },
    'Gm7': {
        name: 'Gm7',
        fullName: 'G Minor 7th',
        variations: [
            { frets: [3, 5, 3, 3, 3, 3], fingers: [1, 3, 1, 1, 1, 1], barres: [3], suffix: 'barre' },
            { frets: ['x', 'x', 3, 3, 3, 3], fingers: ['x', 'x', 1, 1, 1, 1], suffix: 'partial' },
        ]
    },
    'Cm': {
        name: 'Cm',
        fullName: 'C Minor',
        variations: [
            { frets: ['x', 3, 5, 5, 4, 3], fingers: ['x', 1, 3, 4, 2, 1], barres: [3], suffix: 'barre' },
            { frets: [8, 10, 10, 8, 8, 8], fingers: [1, 3, 4, 1, 1, 1], barres: [8], suffix: 'barre' },
        ]
    },
    'Bbm7': {
        name: 'Bbm7',
        fullName: 'B♭ Minor 7th',
        variations: [
            { frets: ['x', 1, 3, 1, 2, 1], fingers: ['x', 1, 3, 1, 2, 1], barres: [1], suffix: 'barre' },
            { frets: [6, 8, 6, 6, 6, 6], fingers: [1, 3, 1, 1, 1, 1], barres: [6], suffix: 'barre' },
        ]
    },
    'Asus4': {
        name: 'Asus4',
        fullName: 'A Suspended 4th',
        variations: [
            { frets: ['x', 0, 2, 2, 3, 0], fingers: ['x', 0, 1, 1, 2, 0], suffix: 'open' },
            { frets: [5, 7, 7, 7, 5, 5], fingers: [1, 3, 3, 3, 1, 1], barres: [5], suffix: 'barre' },
        ]
    },
    'F#m': {
        name: 'F#m',
        fullName: 'F# Minor',
        variations: [
            { frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1], barres: [2], suffix: 'barre' },
            { frets: ['x', 'x', 4, 2, 2, 2], fingers: ['x', 'x', 4, 1, 1, 1], suffix: 'partial' },
        ]
    },
    'G6': {
        name: 'G6',
        fullName: 'G Major 6th',
        variations: [
            { frets: [3, 2, 0, 0, 0, 0], fingers: [3, 2, 0, 0, 0, 0], suffix: 'open' },
            { frets: [3, 'x', 2, 4, 3, 'x'], fingers: [1, 'x', 2, 4, 3, 'x'], suffix: 'partial' },
        ]
    },
    'Eb7': {
        name: 'Eb7',
        fullName: 'E♭ Dominant 7th',
        variations: [
            { frets: ['x', 6, 8, 6, 8, 6], fingers: ['x', 1, 3, 1, 4, 1], barres: [6], suffix: 'barre' },
            { frets: [11, 13, 11, 12, 11, 11], fingers: [1, 3, 1, 2, 1, 1], barres: [11], suffix: 'barre' },
        ]
    },
    'Gm': {
        name: 'Gm',
        fullName: 'G Minor',
        variations: [
            { frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], barres: [3], suffix: 'barre' },
            { frets: ['x', 'x', 5, 3, 3, 3], fingers: ['x', 'x', 4, 1, 1, 1], suffix: 'partial' },
        ]
    },
    'Emaj7': {
        name: 'Emaj7',
        fullName: 'E Major 7th',
        variations: [
            { frets: [0, 2, 1, 1, 0, 0], fingers: [0, 2, 1, 1, 0, 0], suffix: 'open' },
            { frets: [7, 9, 8, 8, 7, 7], fingers: [1, 4, 2, 3, 1, 1], barres: [7], suffix: 'barre' },
        ]
    },
    'Ebmaj7': {
        name: 'Ebmaj7',
        fullName: 'E♭ Major 7th',
        variations: [
            { frets: ['x', 6, 8, 7, 8, 6], fingers: ['x', 1, 3, 2, 4, 1], barres: [6], suffix: 'barre' },
            { frets: [11, 13, 12, 12, 11, 11], fingers: [1, 4, 2, 3, 1, 1], barres: [11], suffix: 'barre' },
        ]
    },
    'Eb': {
        name: 'Eb',
        fullName: 'E♭ Major',
        variations: [
            { frets: ['x', 6, 8, 8, 8, 6], fingers: ['x', 1, 3, 3, 3, 1], barres: [6, 8], suffix: 'barre' },
            { frets: [11, 13, 13, 12, 11, 11], fingers: [1, 3, 4, 2, 1, 1], barres: [11], suffix: 'barre' },
        ]
    },

    // SECOND BATCH - Next 20 most common chords
    'Ab': {
        name: 'Ab',
        fullName: 'A♭ Major',
        variations: [
            { frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1], barres: [4], suffix: 'barre' },
            { frets: ['x', 'x', 6, 5, 4, 4], fingers: ['x', 'x', 3, 2, 1, 1], suffix: 'partial' },
        ]
    },
    'Am6': {
        name: 'Am6',
        fullName: 'A Minor 6th',
        variations: [
            { frets: ['x', 0, 2, 2, 1, 2], fingers: ['x', 0, 2, 3, 1, 4], suffix: 'open' },
            { frets: [5, 7, 7, 5, 5, 5], fingers: [1, 3, 4, 1, 1, 1], barres: [5], suffix: 'barre' },
        ]
    },
    'Fsus2': {
        name: 'Fsus2',
        fullName: 'F Suspended 2nd',
        variations: [
            { frets: ['x', 'x', 3, 0, 1, 1], fingers: ['x', 'x', 3, 0, 1, 1], suffix: 'open' },
            { frets: [1, 3, 3, 0, 1, 1], fingers: [1, 3, 4, 0, 1, 1], suffix: 'open' },
        ]
    },
    'Db7': {
        name: 'Db7',
        fullName: 'D♭ Dominant 7th',
        variations: [
            { frets: ['x', 4, 6, 4, 6, 4], fingers: ['x', 1, 3, 1, 4, 1], barres: [4], suffix: 'barre' },
            { frets: [9, 11, 9, 10, 9, 9], fingers: [1, 3, 1, 2, 1, 1], barres: [9], suffix: 'barre' },
        ]
    },
    'Ab7': {
        name: 'Ab7',
        fullName: 'A♭ Dominant 7th',
        variations: [
            { frets: [4, 6, 4, 5, 4, 4], fingers: [1, 3, 1, 2, 1, 1], barres: [4], suffix: 'barre' },
            { frets: ['x', 'x', 6, 5, 7, 8], fingers: ['x', 'x', 1, 0, 2, 3], suffix: 'partial' },
        ]
    },
    'Dsus4': {
        name: 'Dsus4',
        fullName: 'D Suspended 4th',
        variations: [
            { frets: ['x', 'x', 0, 2, 3, 3], fingers: ['x', 'x', 0, 1, 3, 4], suffix: 'open' },
            { frets: [5, 5, 7, 7, 8, 5], fingers: [1, 1, 2, 3, 4, 1], barres: [5], suffix: 'barre' },
        ]
    },
    'D7sus4': {
        name: 'D7sus4',
        fullName: 'D7 Suspended 4th',
        variations: [
            { frets: ['x', 'x', 0, 2, 1, 3], fingers: ['x', 'x', 0, 2, 1, 3], suffix: 'open' },
            { frets: [5, 5, 7, 5, 8, 5], fingers: [1, 1, 3, 1, 4, 1], barres: [5], suffix: 'barre' },
        ]
    },
    'Db': {
        name: 'Db',
        fullName: 'D♭ Major',
        variations: [
            { frets: ['x', 4, 6, 6, 6, 4], fingers: ['x', 1, 3, 3, 3, 1], barres: [4, 6], suffix: 'barre' },
            { frets: [9, 11, 11, 10, 9, 9], fingers: [1, 3, 4, 2, 1, 1], barres: [9], suffix: 'barre' },
        ]
    },
    'D#maj7': {
        name: 'D#maj7',
        fullName: 'D# Major 7th',
        variations: [
            { frets: ['x', 6, 8, 7, 8, 6], fingers: ['x', 1, 3, 2, 4, 1], barres: [6], suffix: 'barre' },
            { frets: [11, 13, 12, 12, 11, 11], fingers: [1, 4, 2, 3, 1, 1], barres: [11], suffix: 'barre' },
        ]
    },
    'D/F#': {
        name: 'D/F#',
        fullName: 'D Major over F#',
        variations: [
            { frets: [2, 'x', 0, 2, 3, 2], fingers: [1, 'x', 0, 2, 4, 3], suffix: 'bass variant' },
            { frets: [2, 0, 0, 2, 3, 2], fingers: [1, 0, 0, 2, 4, 3], suffix: 'open' },
        ]
    },
    'Abmaj7': {
        name: 'Abmaj7',
        fullName: 'A♭ Major 7th',
        variations: [
            { frets: [4, 6, 5, 5, 4, 4], fingers: [1, 4, 2, 3, 1, 1], barres: [4], suffix: 'barre' },
            { frets: ['x', 'x', 6, 5, 4, 3], fingers: ['x', 'x', 4, 3, 2, 1], suffix: 'partial' },
        ]
    },
    'G#m': {
        name: 'G#m',
        fullName: 'G# Minor',
        variations: [
            { frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1], barres: [4], suffix: 'barre' },
            { frets: ['x', 'x', 6, 4, 4, 4], fingers: ['x', 'x', 4, 1, 1, 1], suffix: 'partial' },
        ]
    },
    'G#': {
        name: 'G#',
        fullName: 'G# Major',
        variations: [
            { frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1], barres: [4], suffix: 'barre' },
            { frets: ['x', 'x', 6, 5, 4, 4], fingers: ['x', 'x', 3, 2, 1, 1], suffix: 'partial' },
        ]
    },
    'Dm6': {
        name: 'Dm6',
        fullName: 'D Minor 6th',
        variations: [
            { frets: ['x', 'x', 0, 2, 0, 1], fingers: ['x', 'x', 0, 2, 0, 1], suffix: 'open' },
            { frets: ['x', 5, 3, 4, 3, 'x'], fingers: ['x', 4, 1, 3, 2, 'x'], suffix: 'partial' },
        ]
    },
    'Dbmaj7': {
        name: 'Dbmaj7',
        fullName: 'D♭ Major 7th',
        variations: [
            { frets: ['x', 4, 6, 5, 6, 4], fingers: ['x', 1, 3, 2, 4, 1], barres: [4], suffix: 'barre' },
            { frets: [9, 11, 10, 10, 9, 9], fingers: [1, 4, 2, 3, 1, 1], barres: [9], suffix: 'barre' },
        ]
    },
    'C9': {
        name: 'C9',
        fullName: 'C Dominant 9th',
        variations: [
            { frets: ['x', 3, 2, 3, 3, 3], fingers: ['x', 2, 1, 3, 3, 3], suffix: 'partial' },
            { frets: [8, 10, 8, 9, 10, 8], fingers: [1, 3, 1, 2, 4, 1], barres: [8], suffix: 'barre' },
        ]
    },
    'C#': {
        name: 'C#',
        fullName: 'C# Major',
        variations: [
            { frets: ['x', 4, 6, 6, 6, 4], fingers: ['x', 1, 3, 3, 3, 1], barres: [4, 6], suffix: 'barre' },
            { frets: [9, 11, 11, 10, 9, 9], fingers: [1, 3, 4, 2, 1, 1], barres: [9], suffix: 'barre' },
        ]
    },
    'G/B': {
        name: 'G/B',
        fullName: 'G Major over B',
        variations: [
            { frets: ['x', 2, 0, 0, 0, 3], fingers: ['x', 1, 0, 0, 0, 2], suffix: 'bass variant' },
            { frets: ['x', 2, 0, 0, 3, 3], fingers: ['x', 1, 0, 0, 2, 3], suffix: 'open' },
        ]
    },
    'Dm7b5': {
        name: 'Dm7b5',
        fullName: 'D Half-Diminished 7th',
        variations: [
            { frets: ['x', 'x', 0, 1, 1, 1], fingers: ['x', 'x', 0, 1, 1, 1], suffix: 'open' },
            { frets: ['x', 5, 6, 5, 6, 4], fingers: ['x', 2, 3, 2, 4, 1], suffix: 'partial' },
        ]
    },
    'G#/C': {
        name: 'G#/C',
        fullName: 'G# Major over C',
        variations: [
            { frets: ['x', 3, 6, 5, 4, 4], fingers: ['x', 1, 4, 3, 1, 1], barres: [4], suffix: 'bass variant' },
            { frets: [8, 11, 11, 10, 8, 8], fingers: [1, 4, 4, 3, 1, 1], barres: [8], suffix: 'barre' },
        ]
    },
    'G7alt': {
        name: 'G7alt',
        fullName: 'G7 Altered',
        variations: [
            { frets: [3, 'x', 3, 4, 2, 'x'], fingers: [2, 'x', 3, 4, 1, 'x'], suffix: 'altered' },
            { frets: ['x', 'x', 5, 6, 6, 7], fingers: ['x', 'x', 1, 2, 3, 4], suffix: 'partial' },
        ]
    },

    // THIRD BATCH - Final 20 most common chords
    'Bb6': {
        name: 'Bb6',
        fullName: 'B♭ Major 6th',
        variations: [
            { frets: ['x', 1, 3, 3, 3, 3], fingers: ['x', 1, 2, 2, 2, 2], suffix: 'partial' },
            { frets: [6, 8, 8, 7, 8, 6], fingers: [1, 3, 4, 2, 4, 1], barres: [6], suffix: 'barre' },
        ]
    },
    'Gb': {
        name: 'Gb',
        fullName: 'G♭ Major',
        variations: [
            { frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], barres: [2], suffix: 'barre' },
            { frets: ['x', 'x', 4, 3, 2, 2], fingers: ['x', 'x', 4, 3, 1, 1], suffix: 'partial' },
        ]
    },
    'F#7': {
        name: 'F#7',
        fullName: 'F# Dominant 7th',
        variations: [
            { frets: [2, 4, 2, 3, 2, 2], fingers: [1, 3, 1, 2, 1, 1], barres: [2], suffix: 'barre' },
            { frets: ['x', 'x', 4, 3, 5, 6], fingers: ['x', 'x', 1, 0, 2, 3], suffix: 'partial' },
        ]
    },
    'Em7b5': {
        name: 'Em7b5',
        fullName: 'E Half-Diminished 7th',
        variations: [
            { frets: [0, 1, 2, 0, 3, 'x'], fingers: [0, 1, 2, 0, 3, 'x'], suffix: 'open' },
            { frets: ['x', 'x', 2, 3, 3, 3], fingers: ['x', 'x', 1, 2, 2, 2], suffix: 'partial' },
        ]
    },
    'Edim7': {
        name: 'Edim7',
        fullName: 'E Diminished 7th',
        variations: [
            { frets: ['x', 'x', 2, 3, 2, 3], fingers: ['x', 'x', 1, 3, 2, 4], suffix: 'partial' },
            { frets: [0, 1, 2, 0, 2, 0], fingers: [0, 1, 3, 0, 2, 0], suffix: 'open' },
        ]
    },
    'D#m': {
        name: 'D#m',
        fullName: 'D# Minor',
        variations: [
            { frets: ['x', 6, 8, 8, 7, 6], fingers: ['x', 1, 3, 4, 2, 1], barres: [6], suffix: 'barre' },
            { frets: [11, 13, 13, 11, 11, 11], fingers: [1, 3, 4, 1, 1, 1], barres: [11], suffix: 'barre' },
        ]
    },
    'Cm6': {
        name: 'Cm6',
        fullName: 'C Minor 6th',
        variations: [
            { frets: ['x', 3, 1, 2, 1, 3], fingers: ['x', 3, 1, 2, 1, 4], suffix: 'partial' },
            { frets: [8, 10, 10, 8, 8, 8], fingers: [1, 3, 4, 1, 1, 1], barres: [8], suffix: 'barre' },
        ]
    },
    'Cb': {
        name: 'Cb',
        fullName: 'C♭ Major (B)',
        variations: [
            { frets: ['x', 2, 4, 4, 4, 2], fingers: ['x', 1, 3, 3, 3, 1], barres: [2, 4], suffix: 'barre' },
            { frets: [7, 9, 9, 8, 7, 7], fingers: [1, 3, 4, 2, 1, 1], barres: [7], suffix: 'barre' },
        ]
    },
    'C#m7': {
        name: 'C#m7',
        fullName: 'C# Minor 7th',
        variations: [
            { frets: ['x', 4, 6, 4, 5, 4], fingers: ['x', 1, 3, 1, 2, 1], barres: [4], suffix: 'barre' },
            { frets: [9, 11, 9, 9, 9, 9], fingers: [1, 3, 1, 1, 1, 1], barres: [9], suffix: 'barre' },
        ]
    },
    'C/G': {
        name: 'C/G',
        fullName: 'C Major over G',
        variations: [
            { frets: [3, 3, 2, 0, 1, 0], fingers: [3, 4, 2, 0, 1, 0], suffix: 'bass variant' },
            { frets: [3, 3, 2, 0, 1, 3], fingers: [2, 3, 1, 0, 0, 4], suffix: 'open' },
        ]
    },
    'Bmaj7': {
        name: 'Bmaj7',
        fullName: 'B Major 7th',
        variations: [
            { frets: ['x', 2, 4, 3, 4, 2], fingers: ['x', 1, 3, 2, 4, 1], barres: [2], suffix: 'barre' },
            { frets: [7, 9, 8, 8, 7, 7], fingers: [1, 4, 2, 3, 1, 1], barres: [7], suffix: 'barre' },
        ]
    },
    'Gb7': {
        name: 'Gb7',
        fullName: 'G♭ Dominant 7th',
        variations: [
            { frets: [2, 4, 2, 3, 2, 2], fingers: [1, 3, 1, 2, 1, 1], barres: [2], suffix: 'barre' },
            { frets: ['x', 'x', 4, 3, 2, 0], fingers: ['x', 'x', 4, 3, 2, 0], suffix: 'partial' },
        ]
    },
    'Fm': {
        name: 'Fm',
        fullName: 'F Minor',
        variations: [
            { frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], barres: [1], suffix: 'barre' },
            { frets: ['x', 'x', 3, 1, 1, 1], fingers: ['x', 'x', 3, 1, 1, 1], suffix: 'partial' },
        ]
    },
    'F9': {
        name: 'F9',
        fullName: 'F Dominant 9th',
        variations: [
            { frets: [1, 3, 1, 2, 1, 3], fingers: [1, 3, 1, 2, 1, 4], barres: [1], suffix: 'barre' },
            { frets: ['x', 'x', 3, 2, 4, 3], fingers: ['x', 'x', 2, 1, 4, 3], suffix: 'partial' },
        ]
    },
    'F7alt': {
        name: 'F7alt',
        fullName: 'F7 Altered',
        variations: [
            { frets: [1, 2, 1, 2, 'x', 'x'], fingers: [1, 2, 1, 3, 'x', 'x'], suffix: 'altered' },
            { frets: ['x', 'x', 3, 4, 4, 5], fingers: ['x', 'x', 1, 2, 3, 4], suffix: 'partial' },
        ]
    },
    'Em/B': {
        name: 'Em/B',
        fullName: 'E Minor over B',
        variations: [
            { frets: ['x', 2, 2, 0, 0, 0], fingers: ['x', 1, 2, 0, 0, 0], suffix: 'bass variant' },
            { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 1, 2, 0, 0, 0], suffix: 'open' },
        ]
    },
    'E+': {
        name: 'E+',
        fullName: 'E Augmented',
        variations: [
            { frets: [0, 3, 2, 1, 'x', 'x'], fingers: [0, 4, 3, 1, 'x', 'x'], suffix: 'partial' },
            { frets: ['x', 'x', 2, 1, 1, 0], fingers: ['x', 'x', 3, 1, 2, 0], suffix: 'partial' },
        ]
    },
    'Dmaj7': {
        name: 'Dmaj7',
        fullName: 'D Major 7th',
        variations: [
            { frets: ['x', 'x', 0, 2, 2, 2], fingers: ['x', 'x', 0, 1, 1, 1], suffix: 'open' },
            { frets: [5, 5, 7, 6, 7, 5], fingers: [1, 1, 4, 2, 3, 1], barres: [5], suffix: 'barre' },
        ]
    },
    'D7alt': {
        name: 'D7alt',
        fullName: 'D7 Altered',
        variations: [
            { frets: ['x', 'x', 0, 1, 1, 2], fingers: ['x', 'x', 0, 1, 1, 2], suffix: 'altered' },
            { frets: ['x', 'x', 0, 1, 2, 1], fingers: ['x', 'x', 0, 1, 3, 2], suffix: 'partial' },
        ]
    },
    'G#5': {
        name: 'G#5',
        fullName: 'G# Power Chord',
        variations: [
            { frets: [4, 6, 6, 'x', 'x', 'x'], fingers: [1, 3, 4, 'x', 'x', 'x'], suffix: 'moveable' },
            { frets: ['x', 'x', 6, 4, 'x', 'x'], fingers: ['x', 'x', 3, 1, 'x', 'x'], suffix: 'partial' },
        ]
    },

    // JAZZ PACK ADDITIONS
    'Bm7': {
        name: 'Bm7',
        fullName: 'B Minor 7th',
        variations: [
            { frets: ['x', 2, 4, 2, 3, 2], fingers: ['x', 1, 3, 1, 2, 1], barres: [2], suffix: 'barre' },
            { frets: [7, 9, 7, 7, 7, 7], fingers: [1, 3, 1, 1, 1, 1], barres: [7], suffix: 'barre' }
        ]
    },
    'F#m7': {
        name: 'F#m7',
        fullName: 'F# Minor 7th',
        variations: [
            { frets: [2, 4, 2, 2, 2, 2], fingers: [1, 3, 1, 1, 1, 1], barres: [2], suffix: 'barre' },
            { frets: ['x', 9, 11, 9, 10, 9], fingers: ['x', 1, 3, 1, 2, 1], barres: [9], suffix: 'barre' }
        ]
    },
    'Bbmaj7': {
        name: 'Bbmaj7',
        fullName: 'Bb Major 7th',
        variations: [
            { frets: ['x', 1, 3, 2, 3, 1], fingers: ['x', 1, 3, 2, 4, 1], barres: [1], suffix: 'barre' },
            { frets: [6, 8, 7, 7, 6, 6], fingers: [1, 4, 2, 3, 1, 1], barres: [6], suffix: 'barre' }
        ]
    },
    'Gbmaj7': {
        name: 'Gbmaj7',
        fullName: 'Gb Major 7th',
        variations: [
            { frets: [2, 4, 3, 3, 2, 2], fingers: [1, 4, 2, 3, 1, 1], barres: [2], suffix: 'barre' },
            { frets: ['x', 9, 11, 10, 11, 9], fingers: ['x', 1, 3, 2, 4, 1], barres: [9], suffix: 'barre' }
        ]
    },
    'Am7b5': {
        name: 'Am7b5',
        fullName: 'A Half-Diminished 7th',
        variations: [
            { frets: ['x', 0, 1, 0, 1, 'x'], fingers: ['x', 0, 1, 0, 2, 'x'], suffix: 'open' },
            { frets: [5, 'x', 5, 5, 4, 'x'], fingers: [2, 'x', 3, 4, 1, 'x'], suffix: 'partial' }
        ]
    },
    'Cm7b5': {
        name: 'Cm7b5',
        fullName: 'C Half-Diminished 7th',
        variations: [
            { frets: ['x', 3, 4, 3, 4, 'x'], fingers: ['x', 1, 2, 1, 3, 'x'], suffix: 'partial' },
            { frets: [8, 'x', 8, 8, 7, 'x'], fingers: [2, 'x', 3, 4, 1, 'x'], suffix: 'partial' }
        ]
    },
    'Abdim7': {
        name: 'Abdim7',
        fullName: 'Ab Diminished 7th',
        variations: [
            { frets: [4, 'x', 3, 4, 3, 'x'], fingers: [2, 'x', 1, 3, 1, 'x'], suffix: 'partial' }
        ]
    },
    'Adim': {
        name: 'Adim',
        fullName: 'A Diminished',
        variations: [
            { frets: ['x', 0, 1, 2, 1, 'x'], fingers: ['x', 0, 1, 3, 2, 'x'], suffix: 'open' }
        ]
    },
    'Bdim7': {
        name: 'Bdim7',
        fullName: 'B Diminished 7th',
        variations: [
            { frets: ['x', 2, 3, 1, 3, 'x'], fingers: ['x', 2, 3, 1, 4, 'x'], suffix: 'open' },
            { frets: [7, 'x', 6, 7, 6, 'x'], fingers: [2, 'x', 1, 3, 1, 'x'], suffix: 'partial' }
        ]
    },
    'Bdim': {
        name: 'Bdim',
        fullName: 'B Diminished',
        variations: [
            { frets: ['x', 2, 4, 4, 3, 'x'], fingers: ['x', 1, 3, 4, 2, 'x'], suffix: 'barre' }
        ]
    },
    'C#dim7': {
        name: 'C#dim7',
        fullName: 'C# Diminished 7th',
        variations: [
            { frets: ['x', 4, 5, 3, 5, 'x'], fingers: ['x', 2, 3, 1, 4, 'x'], suffix: 'partial' }
        ]
    },
    'C#dim': {
        name: 'C#dim',
        fullName: 'C# Diminished',
        variations: [
            { frets: ['x', 4, 2, 0, 'x', 'x'], fingers: ['x', 3, 1, 0, 'x', 'x'], suffix: 'open' }
        ]
    },
    'Ddim7': {
        name: 'Ddim7',
        fullName: 'D Diminished 7th',
        variations: [
            { frets: ['x', 'x', 0, 1, 0, 1], fingers: ['x', 'x', 0, 1, 0, 2], suffix: 'open' },
            { frets: ['x', 5, 6, 4, 6, 'x'], fingers: ['x', 2, 3, 1, 4, 'x'], suffix: 'partial' }
        ]
    },
    'Dbdim7': {
        name: 'Dbdim7',
        fullName: 'Db Diminished 7th',
        variations: [
            { frets: ['x', 4, 5, 3, 5, 'x'], fingers: ['x', 2, 3, 1, 4, 'x'], suffix: 'partial' }
        ]
    },
    'Edim': {
        name: 'Edim',
        fullName: 'E Diminished',
        variations: [
            { frets: [0, 1, 2, 0, 'x', 'x'], fingers: [0, 1, 2, 0, 'x', 'x'], suffix: 'open' }
        ]
    },
    'Fdim7': {
        name: 'Fdim7',
        fullName: 'F Diminished 7th',
        variations: [
            { frets: [1, 'x', 0, 1, 0, 'x'], fingers: [2, 'x', 0, 3, 1, 'x'], suffix: 'partial' }
        ]
    },
    'Gbdim7': {
        name: 'Gbdim7',
        fullName: 'Gb Diminished 7th',
        variations: [
            { frets: [2, 'x', 1, 2, 1, 'x'], fingers: [2, 'x', 1, 3, 1, 'x'], suffix: 'partial' }
        ]
    },
    'Ab6': {
        name: 'Ab6',
        fullName: 'Ab Major 6th',
        variations: [
            { frets: [4, 6, 4, 5, 6, 4], fingers: [1, 3, 1, 2, 4, 1], barres: [4], suffix: 'barre' }
        ]
    },
    'Bbm6': {
        name: 'Bbm6',
        fullName: 'Bb Minor 6th',
        variations: [
            { frets: ['x', 1, 3, 0, 2, 1], fingers: ['x', 1, 3, 0, 2, 1], suffix: 'open' },
            { frets: [6, 8, 8, 6, 8, 6], fingers: [1, 3, 4, 1, 4, 1], barres: [6], suffix: 'barre' }
        ]
    },
    'Fm6': {
        name: 'Fm6',
        fullName: 'F Minor 6th',
        variations: [
            { frets: [1, 3, 1, 1, 3, 1], fingers: [1, 3, 1, 1, 4, 1], barres: [1], suffix: 'barre' }
        ]
    },
    'Gm6': {
        name: 'Gm6',
        fullName: 'G Minor 6th',
        variations: [
            { frets: [3, 5, 3, 3, 5, 3], fingers: [1, 3, 1, 1, 4, 1], barres: [3], suffix: 'barre' }
        ]
    },
    'C/Bb': {
        name: 'C/Bb',
        fullName: 'C Major over Bb',
        variations: [
            { frets: ['x', 1, 2, 0, 1, 0], fingers: ['x', 1, 2, 0, 1, 0], suffix: 'bass variant' }
        ]
    },
    'C7/G': {
        name: 'C7/G',
        fullName: 'C7 over G',
        variations: [
            { frets: [3, 3, 2, 3, 1, 0], fingers: [3, 4, 2, 4, 1, 0], suffix: 'bass variant' }
        ]
    },
    'Dm/C': {
        name: 'Dm/C',
        fullName: 'D Minor over C',
        variations: [
            { frets: ['x', 3, 0, 2, 3, 1], fingers: ['x', 3, 0, 2, 4, 1], suffix: 'bass variant' }
        ]
    },
    'Eb/Bb': {
        name: 'Eb/Bb',
        fullName: 'Eb Major over Bb',
        variations: [
            { frets: ['x', 1, 1, 3, 4, 3], fingers: ['x', 1, 1, 2, 4, 3], barres: [1], suffix: 'bass variant' }
        ]
    },
    'Ebm7/Ab': {
        name: 'Ebm7/Ab',
        fullName: 'Ebm7 over Ab',
        variations: [
            { frets: [4, 6, 4, 6, 4, 4], fingers: [1, 3, 1, 4, 1, 1], barres: [4], suffix: 'Ab9sus4 equiv' }
        ]
    },
    'F/A': {
        name: 'F/A',
        fullName: 'F Major over A',
        variations: [
            { frets: ['x', 0, 3, 2, 1, 1], fingers: ['x', 0, 3, 2, 1, 1], suffix: 'open' }
        ]
    },
    'Fm/Ab': {
        name: 'Fm/Ab',
        fullName: 'F Minor over Ab',
        variations: [
            { frets: [4, 3, 3, 5, 'x', 'x'], fingers: [2, 1, 1, 3, 'x', 'x'], suffix: 'open' }
        ]
    },
    'G7/B': {
        name: 'G7/B',
        fullName: 'G7 over B',
        variations: [
            { frets: ['x', 2, 0, 0, 0, 1], fingers: ['x', 2, 0, 0, 0, 1], suffix: 'open' }
        ]
    },
    'A7alt': {
        name: 'A7alt',
        fullName: 'A7 Altered',
        variations: [
            { frets: ['x', 0, 5, 6, 6, 6], fingers: ['x', 0, 1, 2, 3, 4], suffix: 'partial' }
        ]
    },
    'C7alt': {
        name: 'C7alt',
        fullName: 'C7 Altered',
        variations: [
            { frets: ['x', 3, 2, 3, 4, 'x'], fingers: ['x', 2, 1, 3, 4, 'x'], suffix: '#9' }
        ]
    },
    'Db7alt': {
        name: 'Db7alt',
        fullName: 'Db7 Altered',
        variations: [
            { frets: ['x', 4, 3, 4, 5, 'x'], fingers: ['x', 2, 1, 3, 4, 'x'], suffix: '#9' }
        ]
    },
    'B7b13': {
        name: 'B7b13',
        fullName: 'B7 Flat 13',
        variations: [
            { frets: [7, 'x', 7, 8, 8, 'x'], fingers: [1, 'x', 2, 3, 4, 'x'], suffix: 'barre' }
        ]
    },
    'B7b9': {
        name: 'B7b9',
        fullName: 'B7 Flat 9',
        variations: [
            { frets: ['x', 2, 1, 2, 1, 'x'], fingers: ['x', 2, 1, 3, 1, 'x'], suffix: 'open' }
        ]
    },
    'C7b9': {
        name: 'C7b9',
        fullName: 'C7 Flat 9',
        variations: [
            { frets: ['x', 3, 2, 3, 2, 'x'], fingers: ['x', 2, 1, 3, 1, 'x'], suffix: 'open' }
        ]
    },
    'D7b5': {
        name: 'D7b5',
        fullName: 'D7 Flat 5',
        variations: [
            { frets: ['x', 5, 6, 5, 7, 'x'], fingers: ['x', 1, 2, 1, 3, 'x'], suffix: 'jazz' }
        ]
    },
    'A7b5': {
        name: 'A7b5',
        fullName: 'A7 Flat 5',
        variations: [
            { frets: ['x', 0, 5, 6, 4, 'x'], fingers: ['x', 0, 2, 3, 1, 'x'], suffix: 'open' }
        ]
    },
    'Am11': { // Was Cm11 in missing list, wait, Cm11 is missing.
        name: 'Am11',
        fullName: 'A Minor 11',
        variations: [
            { frets: [5, 'x', 5, 5, 3, 'x'], fingers: [2, 'x', 3, 4, 1, 'x'], suffix: 'jazz' }
        ]
    },
    'Cm11': {
        name: 'Cm11',
        fullName: 'C Minor 11',
        variations: [
            { frets: [8, 'x', 8, 8, 6, 'x'], fingers: [2, 'x', 3, 4, 1, 'x'], barres: [8], suffix: 'jazz' }
        ]
    },
    'Fm11': {
        name: 'Fm11',
        fullName: 'F Minor 11',
        variations: [
            { frets: [1, 'x', 1, 1, 4, 'x'], fingers: [1, 'x', 1, 1, 4, 'x'], barres: [1], suffix: 'jazz' }
        ]
    },
    'C7sus4': {
        name: 'C7sus4',
        fullName: 'C7 Suspended 4th',
        variations: [
            { frets: ['x', 3, 3, 3, 1, 'x'], fingers: ['x', 2, 3, 4, 1, 'x'], suffix: 'partial' }
        ]
    },
    'D9sus4': {
        name: 'D9sus4',
        fullName: 'D9 Suspended 4th',
        variations: [
            { frets: ['x', 5, 5, 5, 5, 5], fingers: ['x', 1, 1, 1, 1, 1], barres: [5], suffix: 'barre' }
        ]
    },
    'Db9': {
        name: 'Db9',
        fullName: 'Db Dominant 9th',
        variations: [
            { frets: ['x', 4, 3, 4, 4, 4], fingers: ['x', 2, 1, 3, 3, 3], barres: [4], suffix: 'barre' }
        ]
    },
    'Db9sus4': {
        name: 'Db9sus4',
        fullName: 'Db9 Suspended 4th',
        variations: [
            { frets: ['x', 4, 4, 4, 4, 4], fingers: ['x', 1, 1, 1, 1, 1], barres: [4], suffix: 'barre' }
        ]
    },
    'Eb9': {
        name: 'Eb9',
        fullName: 'Eb Dominant 9th',
        variations: [
            { frets: ['x', 6, 5, 6, 6, 6], fingers: ['x', 2, 1, 3, 3, 3], barres: [6], suffix: 'barre' }
        ]
    },
    'Eb9sus4': {
        name: 'Eb9sus4',
        fullName: 'Eb9 Suspended 4th',
        variations: [
            { frets: ['x', 6, 6, 6, 6, 6], fingers: ['x', 1, 1, 1, 1, 1], barres: [6], suffix: 'barre' }
        ]
    },
    'F9sus4': {
        name: 'F9sus4',
        fullName: 'F9 Suspended 4th',
        variations: [
            { frets: ['x', 8, 8, 8, 8, 8], fingers: ['x', 1, 1, 1, 1, 1], barres: [8], suffix: 'barre' }
        ]
    },
    'Fm9': {
        name: 'Fm9',
        fullName: 'F Minor 9th',
        variations: [
            { frets: ['x', 8, 6, 8, 8, 8], fingers: ['x', 2, 1, 3, 3, 3], barres: [8], suffix: 'barre' }
        ]
    },
    'Dm9': {
        name: 'Dm9',
        fullName: 'D Minor 9th',
        variations: [
            { frets: ['x', 5, 3, 5, 5, 5], fingers: ['x', 2, 1, 3, 3, 3], barres: [5], suffix: 'barre' }
        ]
    },
    'CmMaj7': {
        name: 'CmMaj7',
        fullName: 'C Minor Major 7th',
        variations: [
            { frets: ['x', 3, 5, 4, 4, 3], fingers: ['x', 1, 3, 2, 2, 1], barres: [3], suffix: 'barre' }
        ]
    },
    'Bbm(maj7)': {
        name: 'Bbm(maj7)',
        fullName: 'Bb Minor Major 7th',
        variations: [
            { frets: ['x', 1, 3, 2, 2, 1], fingers: ['x', 1, 3, 2, 2, 1], barres: [1], suffix: 'barre' }
        ]
    },
    'BbmMaj7': { // Alias
        name: 'BbmMaj7',
        fullName: 'Bb Minor Major 7th',
        variations: [
            { frets: ['x', 1, 3, 2, 2, 1], fingers: ['x', 1, 3, 2, 2, 1], barres: [1], suffix: 'barre' }
        ]
    },

};

export function getChord(chordName: string): ChordDefinition | null {
    // Normalize the chord name (basic)
    const normalized = chordName.trim();
    return CHORD_LIBRARY[normalized] || null;
}

