/**
 * The chords of a song, in the order they are played.
 *
 * A song repeats its chords a lot, and the point of the progression is what
 * the song does, not every single time a chord is struck. Chords that follow
 * each other are therefore kept once, and the list reads like the changes of
 * the song.
 */

import type { ParsedSong } from '../types';
import { voicingForChord, type VoicingNote } from './voicings';

export interface ProgressionChord {
  /** The chord as it was written in the song. */
  name: string;
  /** The notes it plays, from the lowest string to the highest. */
  notes: VoicingNote[];
}

/**
 * The chords of a song, in order.
 *
 * A chord repeated straight after itself is only kept once, but a chord that
 * comes back later is kept, because that is a chord the song comes back to.
 */
export const extractProgression = (lines: ParsedSong): string[] => {
  const chords: string[] = [];

  lines.forEach((line) => {
    line.items.forEach((item) => {
      const name = item.chord?.trim();
      if (!name) return;
      if (chords[chords.length - 1] === name) return;
      chords.push(name);
    });
  });

  return chords;
};

/**
 * The chords of a song with the notes each one plays.
 *
 * A chord the app cannot work out is left out rather than guessed at, so the
 * progression only ever contains chords that sound like what they say.
 */
export const buildProgression = (
  lines: ParsedSong,
  options?: { capo?: number }
): ProgressionChord[] => {
  const capo = options?.capo ?? 0;

  return extractProgression(lines).reduce<ProgressionChord[]>((chords, name) => {
    const notes = voicingForChord(name, { capo });
    if (notes && notes.length > 0) {
      chords.push({ name, notes });
    }
    return chords;
  }, []);
};

/**
 * How many beats are in a bar of the song.
 *
 * A song that does not say is taken to be in four four.
 */
export const beatsPerBar = (timeSignature?: string): number => {
  if (!timeSignature) return 4;

  const match = timeSignature.trim().match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!match) return 4;

  const beats = Number(match[1]);
  return Number.isFinite(beats) && beats > 0 ? beats : 4;
};
