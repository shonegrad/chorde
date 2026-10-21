/**
 * The chords of a song as a MIDI file.
 *
 * A MIDI file is what another program can play: a recording studio, a
 * keyboard, a backing track. The app can work out what a chord sounds like,
 * so it can write down the changes of a song for somebody else to play along
 * with.
 */

import type { Song } from '../types';
import { parseChordPro } from './chordPro';
import { extractProgression } from './progression';
import { transposeChord } from './music';
import { midiOfFrequency, voicingForChord } from './voicings';

/** The ticks in a quarter note. The usual number. */
const TICKS_PER_QUARTER = 480;

const writeUint32 = (value: number): number[] => [
  (value >>> 24) & 0xff,
  (value >>> 16) & 0xff,
  (value >>> 8) & 0xff,
  value & 0xff,
];

const writeUint16 = (value: number): number[] => [(value >>> 8) & 0xff, value & 0xff];

/**
 * A number as a MIDI file writes it: seven bits at a time, with the top bit
 * saying that there is more to come.
 */
const writeVariable = (value: number): number[] => {
  let buffer = value & 0x7f;
  const bytes: number[] = [];

  while ((value >>= 7)) {
    buffer <<= 8;
    buffer |= value & 0x7f;
  }

  for (;;) {
    bytes.push(buffer & 0xff);
    if (buffer & 0x80) {
      buffer >>= 8;
    } else {
      break;
    }
  }

  return bytes;
};

/** The four letters that say what a chunk is. */
const writeChunkId = (value: string): number[] => Array.from(new TextEncoder().encode(value));

/** Some text, with its length in front of it. */
const writeText = (value: string): number[] => {
  const bytes = Array.from(new TextEncoder().encode(value));
  return [...writeVariable(bytes.length), ...bytes];
};

export interface MidiOptions {
  /** The beats a minute. */
  bpm?: number;
  /** The beats in a bar. */
  beatsPerBar?: number;
  /** The capo, which moves every note up. */
  capo?: number;
  /** How many semitones to move every chord. */
  transpose?: number;
  /** The name of the track. */
  name?: string;
}

/**
 * The MIDI numbers of the notes of a chord.
 *
 * The shape the library knows is used, so the file sounds the way the song is
 * played. A chord the app cannot work out is left out rather than guessed at.
 */
const midiNotesOf = (chord: string, options: MidiOptions): number[] => {
  const name = transposeChord(chord, options.transpose ?? 0);
  const voicing = voicingForChord(name, { capo: options.capo ?? 0 });

  if (!voicing) return [];

  return voicing
    .map((note) => midiOfFrequency(note.frequency))
    .filter((midi) => midi >= 0 && midi <= 127)
    .sort((a, b) => a - b);
};

/**
 * The MIDI file for a set of chords.
 *
 * The changes are played, one chord to a bar, at the tempo that is given.
 */
export const buildMidi = (chords: string[], options: MidiOptions = {}): Uint8Array => {
  const bpm = Math.max(20, Math.round(options.bpm ?? 120));
  const beatsPerBar = Math.max(1, Math.round(options.beatsPerBar ?? 4));
  const ticksPerBar = TICKS_PER_QUARTER * beatsPerBar;

  // The microseconds in a quarter note, which is how a MIDI file says the tempo.
  const microseconds = Math.round(60000000 / bpm);
  const tempo: number[] = [
    (microseconds >>> 16) & 0xff,
    (microseconds >>> 8) & 0xff,
    microseconds & 0xff,
  ];

  const events: number[] = [];

  // The name of the track.
  if (options.name) {
    events.push(...writeVariable(0), 0xff, 0x03, ...writeText(options.name));
  }

  // The tempo.
  events.push(...writeVariable(0), 0xff, 0x51, 0x03, ...tempo);

  // The time signature: the beats in a bar, and the power of two for the beat.
  const denominator = Math.round(Math.log2(beatsPerBar));
  events.push(...writeVariable(0), 0xff, 0x58, 0x04, beatsPerBar, Math.pow(2, denominator), 24, 8);

  chords.forEach((chord) => {
    const notes = midiNotesOf(chord, options);

    // The notes are struck one after another, the way a hand strums.
    notes.forEach((note, index) => {
      events.push(...writeVariable(index * 20), 0x90, note, 64);
    });

    // And they are let go at the end of the bar.
    const last = Math.max(0, (notes.length - 1) * 20);
    notes.forEach((note, index) => {
      const wait = index === 0 ? ticksPerBar - last : 20;
      events.push(...writeVariable(wait), 0x80, note, 0);
    });
  });

  // The end of the track.
  events.push(...writeVariable(0), 0xff, 0x2f, 0x00);

  const track = [...writeUint32(events.length), ...events];
  const header = [
    ...writeChunkId('MThd'),
    ...writeUint32(6),
    ...writeUint16(0),
    ...writeUint16(1),
    ...writeUint16(TICKS_PER_QUARTER),
  ];

  return new Uint8Array([...header, ...writeChunkId('MTrk'), ...track]);
};

/**
 * The MIDI file for a song.
 */
export const buildSongMidi = (song: Song, options: MidiOptions = {}): Uint8Array => {
  const chords = extractProgression(parseChordPro(song.content));
  const timeSignature = song.timeSignature ?? '4/4';
  const beatsPerBar = Number(timeSignature.split('/')[0]) || 4;

  return buildMidi(chords, {
    bpm: song.bpm ?? options.bpm,
    beatsPerBar,
    capo: options.capo,
    transpose: options.transpose,
    name: song.title,
  });
};

const sanitizeFilename = (value: string): string => value.replace(/[^a-z0-9]/gi, '_').toLowerCase();

/**
 * Write the chords of a song to a MIDI file.
 */
export const downloadMidi = (song: Song, options: MidiOptions = {}): void => {
  const data = buildSongMidi(song, options);
  const blob = new Blob([data as BlobPart], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `${sanitizeFilename(song.title) || 'song'}.mid`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
