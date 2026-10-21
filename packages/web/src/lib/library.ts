/**
 * Arranging a library.
 *
 * A songbook is arranged, and a list of songs is not. The songs can be
 * grouped by artist, key or tag, sorted by the things a song has, and
 * transposed together.
 */

import type { Song } from '../types';
import { parseDuration } from './duration';
import { keyPrefersFlats, transposeChordProContent, transposeKey } from './music';

export type SortOrder =
  | 'title'
  | 'artist'
  | 'key'
  | 'recent'
  | 'favourite'
  | 'length'
  | 'tempo'
  | 'capo';

export type GroupBy = 'none' | 'artist' | 'key' | 'tag';

export interface SongGroup {
  /** A stable key for the group. */
  key: string;
  /** The name of the group, as it is shown. */
  label: string;
  songs: Song[];
}

/** Where a song goes when it has nothing to be grouped by. */
const NO_KEY = 'No key';
const NO_ARTIST = 'No artist';
const NO_TAG = 'No tag';

/**
 * The groups a song belongs to.
 *
 * A song with three tags is in three groups, because that is what a tag is
 * for. A song with no key is in the group of the songs that have no key.
 */
const labelsOf = (song: Song, groupBy: GroupBy): string[] => {
  if (groupBy === 'artist') return [song.artist?.trim() || NO_ARTIST];
  if (groupBy === 'key') return [song.key?.trim() || NO_KEY];

  const tags = (song.tags ?? []).map((tag) => tag.trim()).filter(Boolean);
  return tags.length > 0 ? tags : [NO_TAG];
};

/**
 * The songs in groups, with the groups in alphabetical order.
 */
export const groupSongs = (songs: Song[], groupBy: GroupBy): SongGroup[] => {
  if (groupBy === 'none') {
    return [{ key: 'all', label: '', songs }];
  }

  const groups = new Map<string, SongGroup>();

  songs.forEach((song) => {
    labelsOf(song, groupBy).forEach((label) => {
      const group = groups.get(label);
      if (group) {
        group.songs.push(song);
        return;
      }
      groups.set(label, { key: `${groupBy}-${label}`, label, songs: [song] });
    });
  });

  return Array.from(groups.values()).sort((a, b) => a.label.localeCompare(b.label));
};

/**
 * The songs in order.
 *
 * A song that does not have the thing being sorted by goes at the end, so
 * that the songs that do are together.
 */
export const sortSongs = (songs: Song[], order: SortOrder): Song[] => {
  const sorted = [...songs];

  sorted.sort((a, b) => {
    if (order === 'favourite') {
      const favourite = Number(Boolean(b.favorite)) - Number(Boolean(a.favorite));
      if (favourite !== 0) return favourite;
    }

    if (order === 'recent') {
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() ||
        a.title.localeCompare(b.title)
      );
    }

    if (order === 'length') {
      const first = parseDuration(a.duration);
      const second = parseDuration(b.duration);
      if (first === undefined && second !== undefined) return 1;
      if (second === undefined && first !== undefined) return -1;
      if (first !== undefined && second !== undefined && first !== second) return first - second;
      return a.title.localeCompare(b.title);
    }

    if (order === 'tempo') {
      const first = a.bpm;
      const second = b.bpm;
      if (first === undefined && second !== undefined) return 1;
      if (second === undefined && first !== undefined) return -1;
      if (first !== undefined && second !== undefined && first !== second) return first - second;
      return a.title.localeCompare(b.title);
    }

    if (order === 'capo') {
      const first = a.capo ?? 0;
      const second = b.capo ?? 0;
      if (first !== second) return first - second;
      return a.title.localeCompare(b.title);
    }

    if (order === 'key') {
      return (a.key ?? '~').localeCompare(b.key ?? '~') || a.title.localeCompare(b.title);
    }

    if (order === 'artist') {
      return a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title);
    }

    return a.title.localeCompare(b.title);
  });

  return sorted;
};

/**
 * A song, transposed for good.
 *
 * The chords in the song are moved, and the key it is in is moved with them,
 * so that the song still says the key it is in.
 */
export const transposeSong = (song: Song, semitones: number): Song => {
  if (semitones === 0) return song;

  const preferFlats = keyPrefersFlats(song.key);
  const content = transposeChordProContent(song.content, semitones, { preferFlats });
  const key = song.key ? transposeKey(song.key, semitones, { preferFlats }) : undefined;

  let next = content;
  if (key) {
    if (/\{(?:key|k):/i.test(next)) {
      next = next.replace(/\{(?:key|k):[^}]*\}/i, `{key: ${key}}`);
    } else if (/^\{title:[^\n]*\n/i.test(next)) {
      next = next.replace(/^(\{title:[^\n]*\n)/i, `$1{key: ${key}}\n`);
    } else {
      next = `{key: ${key}}\n${next}`;
    }
  }

  return {
    ...song,
    content: next,
    key: key ?? song.key,
    updatedAt: new Date().toISOString(),
  };
};
