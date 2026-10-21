/**
 * A setlist, written down.
 *
 * A setlist lives in the browser, and a browser is not somewhere a setlist
 * can be kept. A setlist can be written to a file, read back on another
 * device, and handed to somebody else.
 */

import type { Song } from '../types';
import type { Setlist } from '@chorde/shared';

export const SETLIST_FILE_FORMAT = 'chorde-setlist';
export const SETLIST_FILE_VERSION = 1;

export interface SetlistFileSong {
  /** The title of the song. */
  title: string;
  /** The writer of the song. */
  artist?: string;
  /** How many semitones the song is transposed by. */
  transpose?: number;
  /** The capo the song is played with. */
  capo?: number;
  /** A note for whoever is playing. */
  note?: string;
  /** The id of the song in the library, when it is there. */
  songId?: string;
}

export interface SetlistFile {
  format: typeof SETLIST_FILE_FORMAT;
  version: number;
  name: string;
  /** The key the whole set is played in. */
  targetKey?: string;
  songs: SetlistFileSong[];
  exportedAt: string;
}

/**
 * The setlist as a file.
 *
 * The title of every song is kept, and the id of the song in the library when
 * it is there, so that the set reads properly wherever it is opened.
 */
export const buildSetlistFile = (setlist: Setlist, songById: Map<string, Song>): SetlistFile => ({
  format: SETLIST_FILE_FORMAT,
  version: SETLIST_FILE_VERSION,
  name: setlist.name,
  targetKey: setlist.targetKey,
  exportedAt: new Date().toISOString(),
  songs: setlist.songs.map((entry) => {
    const song = songById.get(entry.songId);
    return {
      title: song?.title ?? entry.title ?? 'A song',
      artist: song?.artist ?? entry.artist,
      transpose: entry.transpose,
      capo: entry.capo,
      note: entry.note,
      songId: song ? entry.songId : undefined,
    };
  }),
});

const isFileSong = (value: unknown): value is SetlistFileSong => {
  if (!value || typeof value !== 'object') return false;
  const song = value as Partial<SetlistFileSong>;
  return typeof song.title === 'string' && song.title.trim().length > 0;
};

/**
 * Read a setlist from a file.
 *
 * A file that is not a setlist is refused, and says why.
 */
export const parseSetlistFile = (raw: string): SetlistFile => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('That file is not a setlist.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('That file is not a setlist.');
  }

  const file = parsed as Partial<SetlistFile>;
  if (file.format !== SETLIST_FILE_FORMAT) {
    throw new Error('That file is not a setlist.');
  }
  if (typeof file.version !== 'number' || file.version > SETLIST_FILE_VERSION) {
    throw new Error('That setlist was made by a newer version of the app.');
  }
  if (typeof file.name !== 'string' || !file.name.trim()) {
    throw new Error('That setlist has no name.');
  }
  if (!Array.isArray(file.songs)) {
    throw new Error('That setlist has no songs.');
  }

  return {
    format: SETLIST_FILE_FORMAT,
    version: file.version,
    name: file.name,
    targetKey: file.targetKey,
    exportedAt: file.exportedAt ?? new Date().toISOString(),
    songs: file.songs.filter(isFileSong),
  };
};

/**
 * The setlist as a setlist.
 *
 * A song that is in the library is linked to it. A song that is not is kept by
 * its title, so that the set still says what it is.
 */
export const setlistFromFile = (
  file: SetlistFile,
  songById: Map<string, Song>,
  createId: () => string
): Setlist => {
  const byTitle = new Map<string, Song>();
  songById.forEach((song) => {
    byTitle.set(song.title.trim().toLowerCase(), song);
  });

  return {
    id: createId(),
    name: file.name,
    targetKey: file.targetKey,
    createdAt: file.exportedAt,
    updatedAt: file.exportedAt,
    songs: file.songs.map((entry) => {
      const match = entry.songId
        ? songById.get(entry.songId)
        : byTitle.get(entry.title.trim().toLowerCase());

      return {
        songId: match?.id ?? createId(),
        title: match?.title ?? entry.title,
        artist: match?.artist ?? entry.artist,
        transpose: entry.transpose,
        capo: entry.capo,
        note: entry.note,
      };
    }),
  };
};

const sanitizeFilename = (value: string): string => value.replace(/[^a-z0-9]/gi, '_').toLowerCase();

/**
 * Write the setlist to a file the player can keep.
 */
export const downloadSetlistFile = (setlist: Setlist, songById: Map<string, Song>): void => {
  const file = buildSetlistFile(setlist, songById);
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `${sanitizeFilename(setlist.name) || 'setlist'}.chordset.json`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Read a setlist from a file the player has.
 */
export const readSetlistFile = async (file: File): Promise<SetlistFile> => {
  const text = await file.text();
  return parseSetlistFile(text);
};
