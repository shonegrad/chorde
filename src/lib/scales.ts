// Scale definitions and music theory utilities

export interface Scale {
    name: string;
    fullName: string;
    intervals: number[]; // Semitones from root
    degrees: string[]; // Scale degree names (1, 2, b3, etc.)
}

// Note names
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export const FLAT_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const;

export type NoteName = typeof NOTES[number];
export type FlatNoteName = typeof FLAT_NOTES[number];

// Scale type definitions
export const SCALE_TYPES: Record<string, Scale> = {
    'major': {
        name: 'Major',
        fullName: 'Major (Ionian)',
        intervals: [0, 2, 4, 5, 7, 9, 11],
        degrees: ['1', '2', '3', '4', '5', '6', '7']
    },
    'minor': {
        name: 'Minor',
        fullName: 'Natural Minor (Aeolian)',
        intervals: [0, 2, 3, 5, 7, 8, 10],
        degrees: ['1', '2', 'b3', '4', '5', 'b6', 'b7']
    },
    'minor-harmonic': {
        name: 'Harmonic Minor',
        fullName: 'Harmonic Minor',
        intervals: [0, 2, 3, 5, 7, 8, 11],
        degrees: ['1', '2', 'b3', '4', '5', 'b6', '7']
    },
    'minor-melodic': {
        name: 'Melodic Minor',
        fullName: 'Melodic Minor',
        intervals: [0, 2, 3, 5, 7, 9, 11],
        degrees: ['1', '2', 'b3', '4', '5', '6', '7']
    },
    'pentatonic-major': {
        name: 'Major Pentatonic',
        fullName: 'Major Pentatonic',
        intervals: [0, 2, 4, 7, 9],
        degrees: ['1', '2', '3', '5', '6']
    },
    'pentatonic-minor': {
        name: 'Minor Pentatonic',
        fullName: 'Minor Pentatonic',
        intervals: [0, 3, 5, 7, 10],
        degrees: ['1', 'b3', '4', '5', 'b7']
    },
    'blues': {
        name: 'Blues',
        fullName: 'Blues Scale',
        intervals: [0, 3, 5, 6, 7, 10],
        degrees: ['1', 'b3', '4', 'b5', '5', 'b7']
    },
    'dorian': {
        name: 'Dorian',
        fullName: 'Dorian Mode',
        intervals: [0, 2, 3, 5, 7, 9, 10],
        degrees: ['1', '2', 'b3', '4', '5', '6', 'b7']
    },
    'phrygian': {
        name: 'Phrygian',
        fullName: 'Phrygian Mode',
        intervals: [0, 1, 3, 5, 7, 8, 10],
        degrees: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7']
    },
    'lydian': {
        name: 'Lydian',
        fullName: 'Lydian Mode',
        intervals: [0, 2, 4, 6, 7, 9, 11],
        degrees: ['1', '2', '3', '#4', '5', '6', '7']
    },
    'mixolydian': {
        name: 'Mixolydian',
        fullName: 'Mixolydian Mode',
        intervals: [0, 2, 4, 5, 7, 9, 10],
        degrees: ['1', '2', '3', '4', '5', '6', 'b7']
    },
    'locrian': {
        name: 'Locrian',
        fullName: 'Locrian Mode',
        intervals: [0, 1, 3, 5, 6, 8, 10],
        degrees: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7']
    }
};

/**
 * Generate scale notes from a root note and scale type
 */
export function generateScale(root: string, scaleType: string, useFlats = false): string[] {
    const scale = SCALE_TYPES[scaleType];
    if (!scale) {
        throw new Error(`Unknown scale type: ${scaleType}`);
    }

    const noteArray = useFlats ? FLAT_NOTES : NOTES;
    const rootIndex = noteArray.indexOf(root as any);
    if (rootIndex === -1) {
        throw new Error(`Invalid root note: ${root}`);
    }

    return scale.intervals.map(interval => {
        const noteIndex = (rootIndex + interval) % 12;
        return noteArray[noteIndex];
    });
}

/**
 * Get chords that fit in a given key
 */
export function getChordsInKey(root: string, scaleType: string = 'major'): string[] {
    const scale = SCALE_TYPES[scaleType];
    if (!scale) return [];

    const scaleNotes = generateScale(root, scaleType);

    if (scaleType === 'major') {
        // I, ii, iii, IV, V, vi, vii°
        return [
            scaleNotes[0],              // I (major)
            `${scaleNotes[1]}m`,        // ii (minor)
            `${scaleNotes[2]}m`,        // iii (minor)
            scaleNotes[3],              // IV (major)
            scaleNotes[4],              // V (major)
            `${scaleNotes[5]}m`,        // vi (minor)
            `${scaleNotes[6]}dim`,      // vii° (diminished)
        ];
    } else if (scaleType === 'minor') {
        // i, ii°, III, iv, v, VI, VII
        return [
            `${scaleNotes[0]}m`,        // i (minor)
            `${scaleNotes[1]}dim`,      // ii° (diminished)
            scaleNotes[2],              // III (major)
            `${scaleNotes[3]}m`,        // iv (minor)
            `${scaleNotes[4]}m`,        // v (minor)
            scaleNotes[5],              // VI (major)
            scaleNotes[6],              // VII (major)
        ];
    }

    return scaleNotes; // Fallback
}

/**
 * Convert note name to MIDI note number (C4 = 60)
 */
export function noteToMidi(noteName: string, octave: number = 4): number {
    const noteIndex = NOTES.indexOf(noteName as NoteName);
    if (noteIndex === -1) {
        const flatIndex = FLAT_NOTES.indexOf(noteName as FlatNoteName);
        if (flatIndex === -1) {
            throw new Error(`Invalid note name: ${noteName}`);
        }
        return 12 + (octave * 12) + flatIndex;
    }
    return 12 + (octave * 12) + noteIndex;
}

/**
 * Convert MIDI note number to frequency in Hz
 */
export function midiToFrequency(midiNote: number): number {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
}

/**
 * Get frequency for a note name
 */
export function noteToFrequency(noteName: string, octave: number = 4): number {
    const midi = noteToMidi(noteName, octave);
    return midiToFrequency(midi);
}

/**
 * Detect key from chord progression (basic heuristic)
 */
export function detectKey(chords: string[]): { key: string; confidence: number } | null {
    if (chords.length === 0) return null;

    // Count chord occurrences
    const chordCounts: Record<string, number> = {};
    chords.forEach(chord => {
        const root = chord.replace(/[^A-G#b]/g, ''); // Extract root note
        chordCounts[root] = (chordCounts[root] || 0) + 1;
    });

    // Most common chord is likely the tonic
    const sortedChords = Object.entries(chordCounts).sort((a, b) => b[1] - a[1]);
    const likelyTonic = sortedChords[0][0];

    // Check if progression suggests major or minor
    const hasMinor = chords.some(c => c.includes('m') && !c.includes('maj'));
    const key = hasMinor ? `${likelyTonic}m` : likelyTonic;

    // Confidence based on how dominant the tonic is
    const confidence = sortedChords[0][1] / chords.length;

    return { key, confidence };
}
