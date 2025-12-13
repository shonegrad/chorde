import { analyzeChord } from './nashville';
// ChordAnalysis type is not needed if we don't prefer to use it explicitly in the return type that's not exported
// If we needed it we would use: import type { ChordAnalysis } from './nashville';

interface StaffNote {
    position: number; // 0 = Middle C (C4), 1 = D4, 2 = E4 (1st line), etc.
    accidental: '' | 'sharp' | 'flat' | 'natural';
}

const NOTES_MAP: Record<string, number> = {
    'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6
};

// Returns relative positions from C4 (Middle C)
export function getChordNotes(chord: string): StaffNote[] {
    const analysis = analyzeChord(chord);
    const root = analysis.root; // e.g., "C", "F#", "Bb"

    // Safety check for empty root
    if (!root || root.length === 0) {
        return [];
    }

    // 1. Determine Root Position
    let rootLetter = root.charAt(0).toUpperCase();
    let rootAccidental: StaffNote['accidental'] = '';

    if (root.length > 1) {
        if (root.includes('#')) rootAccidental = 'sharp';
        if (root.includes('b')) rootAccidental = 'flat';
    }

    let rootBase = NOTES_MAP[rootLetter];

    // Safety check: if root letter is not in map, default to C (0)
    if (rootBase === undefined) {
        console.warn(`Unknown root letter: ${rootLetter}, defaulting to C`);
        rootBase = 0;
    }

    const notes: StaffNote[] = [];

    // Add Root
    notes.push({ position: rootBase, accidental: rootAccidental });

    const q = analysis.quality;

    // 3rd
    if (q.includes('m') && !q.includes('maj')) {
        // Minor 3rd: +2 steps, flattened relative to major scale of root
        // Actually, simple lookup might be better.
        // Let's calculate the target semitone and fit it to the step.
        addRelativeNote(root, rootBase, 3, 'minor', notes);
    } else if (q === 'sus2') {
        addRelativeNote(root, rootBase, 2, 'major', notes);
    } else if (q === 'sus4') {
        addRelativeNote(root, rootBase, 4, 'perfect', notes);
    } else {
        // Major 3rd (default)
        addRelativeNote(root, rootBase, 3, 'major', notes);
    }

    // 5th
    if (q.includes('dim')) {
        addRelativeNote(root, rootBase, 5, 'diminished', notes);
    } else if (q.includes('aug') || q.includes('+')) {
        addRelativeNote(root, rootBase, 5, 'augmented', notes);
    } else {
        addRelativeNote(root, rootBase, 5, 'perfect', notes);
    }

    // 7th
    if (q.includes('maj7')) {
        addRelativeNote(root, rootBase, 7, 'major', notes);
    } else if (q.includes('7')) {
        addRelativeNote(root, rootBase, 7, 'minor', notes); // Dom7 has minor 7 interval
    } else if (q.includes('6')) {
        addRelativeNote(root, rootBase, 6, 'major', notes);
    }

    return notes;
}

// Logic to determine accidental of a target interval note
// Root: string (e.g. "C", "F#")
// RootPos: number (C=0)
// Interval: number (3 = third, 5 = fifth)
// Quality: 'major' | 'minor' | 'perfect' | 'diminished' | 'augmented'
function addRelativeNote(root: string, rootPos: number, intervalNum: number, quality: string, notes: StaffNote[]) {
    // Diatonic steps from root (C=1). 3rd is +2 steps. 5th is +4 steps.
    const stepsOffset = intervalNum - 1;
    let targetPos = rootPos + stepsOffset;

    // Calculate expected Semitones for the quality
    let expectedSemitones = 0;
    if (intervalNum === 2) expectedSemitones = 2; // Maj2
    if (intervalNum === 3) expectedSemitones = (quality === 'minor' ? 3 : 4);
    if (intervalNum === 4) expectedSemitones = 5; // P4
    if (intervalNum === 5) expectedSemitones = (quality === 'diminished' ? 6 : (quality === 'augmented' ? 8 : 7));
    if (intervalNum === 6) expectedSemitones = 9; // Maj6
    if (intervalNum === 7) expectedSemitones = (quality === 'minor' ? 10 : 11); // m7 vs Maj7

    // Get root semitone index
    const semitonesMap: Record<string, number> = {
        'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };

    const rootSemitone = semitonesMap[root] ?? 0;
    const targetSemitone = (rootSemitone + expectedSemitones) % 12;

    // Determine natural note at target position
    // targetPos is pure step index (e.g. C=0, E=2)
    // We need to know what the natural note is at that step to decide accidental.
    // Sequence of naturals: C(0), D(2), E(4), F(5), G(7), A(9), B(11), C(12)...
    const naturalSemitones = [0, 2, 4, 5, 7, 9, 11]; // Indices for C, D, E...
    const naturalNoteIndex = targetPos % 7; // 0=C, 1=D
    const naturalNoteSemitone = naturalSemitones[naturalNoteIndex];

    let diff = targetSemitone - naturalNoteSemitone;
    // Fix wrap around (e.g. B to C is 11 to 0)
    if (diff < -6) diff += 12;
    if (diff > 6) diff -= 12;

    let acc: StaffNote['accidental'] = '';
    if (diff === 1) acc = 'sharp';
    if (diff === 2) acc = 'sharp'; // Double sharp (map to sharp for visual simplicity or handle properly)
    if (diff === -1) acc = 'flat';
    if (diff === -2) acc = 'flat';

    // Simplification: if the root key prefers sharps/flats, try to respect it, 
    // but the Note calculation above is absolute based on the interval.
    // e.g. F# Major 3rd -> A# (A natural is 9. F# is 6. 6+4=10. A# is 10. A natural is 9. Diff +1 -> Sharp).

    notes.push({
        position: targetPos,
        accidental: acc
    });
}
