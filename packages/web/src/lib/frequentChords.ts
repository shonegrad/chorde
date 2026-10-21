/**
 * The chords a player reaches for most.
 *
 * The library knows what was played and when, so it knows which chords the
 * player plays and how often. A player has their own handful of chords, and
 * that is the list they want in front of them.
 */

import type { Song } from '../types';
import { parseChordPro } from './chordPro';

export interface ChordUsage {
  /** The chord, as it is written. */
  chord: string;
  /** How many times a song that uses this chord has been played. */
  count: number;
}

/**
 * The chords of a song, each one once.
 */
const chordsOfSong = (song: Song): string[] => {
  const chords: string[] = [];

  parseChordPro(song.content).forEach((line) => {
    line.items.forEach((item) => {
      const name = item.chord?.trim();
      if (!name || chords.includes(name)) return;
      chords.push(name);
    });
  });

  return chords;
};

/**
 * The chords the player reaches for most, the one they reach for most first.
 *
 * A song that has never been played says nothing about what the player
 * reaches for, so it does not count.
 */
export const chordsByUse = (songs: Song[]): ChordUsage[] => {
  const counts = new Map<string, number>();

  songs.forEach((song) => {
    const plays = song.playCount ?? 0;
    if (plays <= 0) return;

    chordsOfSong(song).forEach((chord) => {
      counts.set(chord, (counts.get(chord) ?? 0) + plays);
    });
  });

  return Array.from(counts.entries())
    .map(([chord, count]) => ({ chord, count }))
    .sort((a, b) => b.count - a.count || a.chord.localeCompare(b.chord));
};

/**
 * The names of the chords the player reaches for most.
 */
export const frequentChordNames = (songs: Song[], limit = 12): string[] =>
  chordsByUse(songs)
    .slice(0, limit)
    .map((usage) => usage.chord);
