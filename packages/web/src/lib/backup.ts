import type { Song } from '../types';
import type { Setlist } from '@chorde/shared';

export const SNAPSHOT_SCHEMA_VERSION = 1;

export interface LibrarySnapshot {
  schemaVersion: number;
  exportedAt: string;
  songs: Song[];
  setlists: Setlist[];
}

/**
 * Build a backup of the whole library.
 *
 * Setlists live in their own store, so they are passed in explicitly - an
 * earlier version of this file left them out, which silently dropped them on
 * every restore.
 */
export const buildSnapshot = (songs: Song[], setlists: Setlist[] = []): LibrarySnapshot => ({
  schemaVersion: SNAPSHOT_SCHEMA_VERSION,
  exportedAt: new Date().toISOString(),
  songs,
  setlists,
});

export const parseSnapshot = (raw: string): LibrarySnapshot => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('That file is not a valid Chorde backup.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('That file is not a valid Chorde backup.');
  }

  const candidate = parsed as Partial<LibrarySnapshot>;
  if (!candidate.schemaVersion) {
    throw new Error('That file is not a Chorde backup.');
  }
  if (candidate.schemaVersion !== SNAPSHOT_SCHEMA_VERSION) {
    throw new Error(
      `That backup uses format version ${candidate.schemaVersion}, but this version of Chorde reads version ${SNAPSHOT_SCHEMA_VERSION}.`
    );
  }
  if (!Array.isArray(candidate.songs)) {
    throw new Error('That backup does not contain any songs.');
  }

  return {
    schemaVersion: candidate.schemaVersion,
    exportedAt: candidate.exportedAt ?? new Date().toISOString(),
    songs: candidate.songs,
    setlists: Array.isArray(candidate.setlists) ? candidate.setlists : [],
  };
};

const sanitizeFilename = (value: string): string =>
  value
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

/** Offer a snapshot to the user as a download. */
export const downloadSnapshot = (snapshot: LibrarySnapshot): void => {
  const date = snapshot.exportedAt.slice(0, 10);
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `${sanitizeFilename(`chorde-library-${date}`)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/** Read and validate a backup file the user picked. */
export const readSnapshotFile = async (file: File): Promise<LibrarySnapshot> => {
  const text = await file.text();
  return parseSnapshot(text);
};
