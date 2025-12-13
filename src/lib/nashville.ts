// Nashville Number System and music notation utilities

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLATS_TO_SHARPS: Record<string, string> = {
    'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
};

// Note names in standard notation (with sharps and flats)
const NOTE_DISPLAY_NAMES: Record<string, string> = {
    'C': 'C', 'C#': 'C♯', 'Db': 'D♭',
    'D': 'D', 'D#': 'D♯', 'Eb': 'E♭',
    'E': 'E',
    'F': 'F', 'F#': 'F♯', 'Gb': 'G♭',
    'G': 'G', 'G#': 'G♯', 'Ab': 'A♭',
    'A': 'A', 'A#': 'A♯', 'Bb': 'B♭',
    'B': 'B'
};

export type DisplayMode = 'chords' | 'nashville' | 'notation';

export interface ChordAnalysis {
    root: string;
    quality: string; // '', 'm', '7', 'm7', 'maj7', 'sus2', 'sus4', 'dim', 'aug', etc.
    bass?: string; // For slash chords like C/G
    original: string;
}

// Parse a chord into its components
export function analyzeChord(chord: string): ChordAnalysis {
    // Safety check for empty or invalid input
    if (!chord || typeof chord !== 'string' || chord.trim() === '') {
        return {
            root: 'C',
            quality: '',
            original: chord || ''
        };
    }

    // Handle slash chords (e.g., C/G)
    const slashParts = chord.split('/');
    const mainChord = slashParts[0];
    const bass = slashParts[1];

    // Safety check for empty mainChord
    if (!mainChord || mainChord.length === 0) {
        return {
            root: 'C',
            quality: '',
            original: chord
        };
    }

    // Extract root note (1-2 characters)
    let root = mainChord[0];
    if (mainChord[1] && (mainChord[1] === '#' || mainChord[1] === 'b')) {
        root += mainChord[1];
    }

    // Normalize flats to sharps for consistency
    if (FLATS_TO_SHARPS[root]) {
        root = FLATS_TO_SHARPS[root];
    }

    // Extract quality (everything after the root)
    const quality = mainChord.substring(root.length);

    return {
        root,
        quality,
        bass,
        original: chord
    };
}

// Convert chord to Nashville number
export function chordToNashville(chord: string, key: string): string {
    const analysis = analyzeChord(chord);
    const keyAnalysis = analyzeChord(key);

    // Normalize key root
    let keyRoot = keyAnalysis.root;
    if (FLATS_TO_SHARPS[keyRoot]) {
        keyRoot = FLATS_TO_SHARPS[keyRoot];
    }

    // Find the interval between the key and the chord root
    const keyIndex = NOTE_NAMES.indexOf(keyRoot);
    const chordIndex = NOTE_NAMES.indexOf(analysis.root);

    if (keyIndex === -1 || chordIndex === -1) {
        return chord; // Return original if we can't parse
    }

    const interval = (chordIndex - keyIndex + 12) % 12;

    // Map interval to scale degree
    const intervalToNumber: Record<number, string> = {
        0: '1',   // Root
        2: '2',   // Major 2nd
        4: '3',   // Major 3rd
        5: '4',   // Perfect 4th
        7: '5',   // Perfect 5th
        9: '6',   // Major 6th
        11: '7',  // Major 7th
        // Common alterations
        1: 'b2',
        3: 'b3',
        6: 'b5',
        8: 'b6',
        10: 'b7'
    };

    let number = intervalToNumber[interval] || '?';

    // Determine if the chord is minor/diminished based on quality
    let suffix = analysis.quality;

    if (analysis.quality.startsWith('m') && !analysis.quality.startsWith('maj')) {
        // Minor chord - use lowercase Roman numeral equivalent
        const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];
        const degreeNum = parseInt(number.replace(/[^0-9]/g, ''));
        if (degreeNum >= 1 && degreeNum <= 7) {
            number = romanNumerals[degreeNum - 1];
        }
        suffix = analysis.quality.substring(1); // Remove 'm'
    }

    // Handle slash chords
    if (analysis.bass) {
        const bassInterval = (NOTE_NAMES.indexOf(analysis.bass) - keyIndex + 12) % 12;
        const bassNumber = intervalToNumber[bassInterval] || '?';
        return `${number}${suffix}/${bassNumber}`;
    }

    return `${number}${suffix}`;
}

// Convert chord to musical notation (showing the notes that make up the chord)
export function chordToNotation(chord: string): string {
    const analysis = analyzeChord(chord);

    // Get the display name with proper sharp/flat symbols
    let rootDisplay = NOTE_DISPLAY_NAMES[analysis.root] || analysis.root;

    // For notation, we want to show which notes make up the chord
    // This helps users learn music theory and staff notation
    const quality = analysis.quality.toLowerCase();

    // Build the chord formula in parentheses
    let formula = '';

    if (quality === '' || quality === 'maj') {
        formula = '1-3-5'; // Major triad
    } else if (quality === 'm' || quality === 'min') {
        formula = '1-♭3-5'; // Minor triad
    } else if (quality === '7') {
        formula = '1-3-5-♭7'; // Dominant 7
    } else if (quality === 'm7' || quality === 'min7') {
        formula = '1-♭3-5-♭7'; // Minor 7
    } else if (quality === 'maj7') {
        formula = '1-3-5-7'; // Major 7
    } else if (quality === 'sus2') {
        formula = '1-2-5'; // Sus2
    } else if (quality === 'sus4') {
        formula = '1-4-5'; // Sus4
    } else if (quality === 'dim' || quality === 'o') {
        formula = '1-♭3-♭5'; // Diminished
    } else if (quality === 'aug' || quality === '+') {
        formula = '1-3-♯5'; // Augmented
    } else {
        // For other qualities, just show the root
        return `${rootDisplay}${analysis.quality}`;
    }

    return `${rootDisplay} (${formula})`;
}

// Get a user-friendly display name for each mode
export function getDisplayModeName(mode: DisplayMode): string {
    switch (mode) {
        case 'chords': return 'Chords';
        case 'nashville': return 'Nashville';
        case 'notation': return 'Notation';
    }
}
