/**
 * Turning a chord name into something a guitar can play.
 *
 * A chord in a song is a name, not a shape: "Am7" says which notes belong
 * together but not where the hand goes. Where the app can, it uses a shape
 * from the chord library, because that is what a player would actually use.
 * For the chords the library does not have, the notes are worked out from
 * the chord itself and placed in a register a guitar can reach.
 */

import { getChord } from '../data/chordLibrary';
import { notesOfShape, pitchClassOf } from './guitar';
import { tonesOfQuality } from './chordTones';

export interface VoicingNote {
  frequency: number;
  /**
   * The order the string is strummed in.
   *
   * The lowest string is 0, so a chord is heard from the bottom up.
   */
  order: number;
}

export const frequencyOfMidi = (midi: number): number => 440 * Math.pow(2, (midi - 69) / 12);

/** The MIDI number of a note, from its pitch class and octave. */
export const midiOf = (pitchClass: number, octave: number): number =>
  12 * (octave + 1) + pitchClass;

/** The MIDI number of a note, from its frequency. */
export const midiOfFrequency = (frequency: number): number =>
  Math.round(69 + 12 * Math.log2(frequency / 440));

/**
 * Where a chord is put when it has to be worked out rather than looked up.
 *
 * The root is kept between A2 and G#3, which is the part of the neck a
 * guitarist plays in, and keeps a progression from jumping about in pitch.
 */
const ROOT_MIDI_LOW = 45;
const ROOT_MIDI_HIGH = 56;
const ROOT_MIDI_TARGET = 50;

const rootMidiFor = (pitchClass: number): number => {
  const candidates = [midiOf(pitchClass, 2), midiOf(pitchClass, 3)];
  const inRange = candidates.filter((midi) => midi >= ROOT_MIDI_LOW && midi <= ROOT_MIDI_HIGH);
  if (inRange.length > 0) return inRange[0];

  return candidates.reduce((best, midi) =>
    Math.abs(midi - ROOT_MIDI_TARGET) < Math.abs(best - ROOT_MIDI_TARGET) ? midi : best
  );
};

export interface ParsedChord {
  /** The pitch class of the root. */
  root: number;
  /** The root as it was written, for example "Bb". */
  rootName: string;
  /** The notes of the chord, in semitones from the root. */
  tones: number[];
  /** How many letter steps above the root each note is. */
  steps: number[];
  /** The note in the bass, for a chord such as D/F#. */
  bass?: number;
}

/**
 * Read a chord name.
 *
 * Returns null for anything that is not a chord, such as "N.C.".
 */
export const parseChordName = (name: string): ParsedChord | null => {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^([A-G][#b]?)([^/]*)(?:\/(.+))?$/);
  if (!match) return null;

  const root = pitchClassOf(match[1]);
  if (root < 0) return null;

  const tones = tonesOfQuality(match[2]);
  if (!tones) return null;

  let bass: number | undefined;
  if (match[3]) {
    const bassPitch = pitchClassOf(match[3]);
    if (bassPitch >= 0) bass = bassPitch;
  }

  return { root, rootName: match[1], tones: tones.semitones, steps: tones.steps, bass };
};

/**
 * The notes of a chord, as a guitar plays them.
 *
 * The order is from the lowest string to the highest, so a strum sounds the
 * way a hand moves.
 */
export const voicingForChord = (
  chordName: string,
  options?: { capo?: number }
): VoicingNote[] | null => {
  const capo = options?.capo ?? 0;
  const parsed = parseChordName(chordName);
  if (!parsed) return null;

  const fromLibrary = voicingFromLibrary(chordName, capo);
  if (fromLibrary) {
    // A slash chord has its own note in the bass, which the shape does not
    // have, so it is added underneath.
    if (parsed.bass === undefined) return fromLibrary;
    return withBassNote(fromLibrary, parsed.bass);
  }

  const rootMidi = rootMidiFor(parsed.root);
  const midis = parsed.tones.map((tone) => rootMidi + tone);
  const voicing = toVoicing(midis);

  // A slash chord puts its bass note underneath the chord.
  if (parsed.bass === undefined) return voicing;
  return withBassNote(voicing, parsed.bass);
};

/**
 * The shape from the chord library, played as the notes it plays.
 *
 * This is what a guitarist would reach for, so it is preferred over a shape
 * worked out from the chord name.
 */
const voicingFromLibrary = (chordName: string, capo: number): VoicingNote[] | null => {
  const chord = getChord(chordName);
  const variation = chord?.variations[0];
  if (!chord || !variation) return null;

  const notes = notesOfShape(variation.frets);
  if (notes.length === 0) return null;

  return notes.map((note, index) => ({
    frequency: frequencyOfMidi(midiOf(note.pitchClass, note.octave) + capo),
    order: index,
  }));
};

/** Put a note underneath a voicing, for a chord such as D/F#. */
const withBassNote = (voicing: VoicingNote[], pitchClass: number): VoicingNote[] => {
  const midis = voicing.map((note) => midiOfFrequency(note.frequency));
  const lowest = Math.min(...midis);

  // The shape may already have the note in the bass, and then it is left alone.
  if (lowest % 12 === pitchClass) return toVoicing(midis);

  const difference = (((lowest - pitchClass) % 12) + 12) % 12;
  return toVoicing([...midis, lowest - difference]);
};

/** Sort the notes from the lowest to the highest and number them. */
const toVoicing = (midis: number[]): VoicingNote[] => {
  const sorted = [...midis].sort((a, b) => a - b);

  return sorted.map((midi, index) => ({
    frequency: frequencyOfMidi(midi),
    order: index,
  }));
};
