const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export const transposeChord = (chord: string, semitones: number): string => {
    if (!chord) return '';

    // Simple regex to split root from suffix (e.g. "Cmaj7/G" -> Root:C, Suffix:maj7/G)
    // This is a naive implementation for MVP.
    const rootMatch = chord.match(/^([A-G][#b]?)(.*)/);
    if (!rootMatch) return chord; // Return original if parse fails

    const root = rootMatch[1];
    const suffix = rootMatch[2];

    // Slash chord handling (e.g. /G)
    const slashParts = suffix.split('/');
    let newSuffix = slashParts[0];
    let bassNote = '';

    if (slashParts.length > 1) {
        bassNote = '/' + transposeNote(slashParts[1], semitones);
    }

    const newRoot = transposeNote(root, semitones);
    return newRoot + newSuffix + bassNote;
};

const transposeNote = (note: string, semitones: number): string => {
    let noteIndex = NOTES.indexOf(note);
    let useFlats = false;
    if (noteIndex === -1) {
        noteIndex = FLATS.indexOf(note);
        useFlats = true;
    }
    if (noteIndex === -1) return note; // validation guard

    let newIndex = (noteIndex + semitones) % 12;
    if (newIndex < 0) newIndex += 12;

    return useFlats ? FLATS[newIndex] : NOTES[newIndex];
}
