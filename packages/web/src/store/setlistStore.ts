import { create } from 'zustand';
import type { Setlist, SetlistSong } from '@chorde/shared';
import { createId } from '../lib/id';
import { keyShift } from '../lib/keys';

export type { Setlist, SetlistSong } from '@chorde/shared';

interface SetlistState {
  setlists: Setlist[];
  loadSetlists: () => void;
  createSetlist: (name: string) => Setlist;
  renameSetlist: (id: string, name: string) => void;
  deleteSetlist: (id: string) => void;
  addSong: (setlistId: string, songId: string) => void;
  removeSong: (setlistId: string, songId: string) => void;
  reorderSongs: (setlistId: string, songIds: string[]) => void;
  /** Change how one song in the set is played. */
  updateSong: (setlistId: string, songId: string, changes: Partial<SetlistSong>) => void;
  /** The key the whole set is played in. */
  setTargetKey: (setlistId: string, key: string | undefined) => void;
  /** Set every song so the set lands in one key. */
  playInKey: (setlistId: string, key: string, keys: Record<string, string | undefined>) => void;
  getSetlist: (id: string) => Setlist | undefined;
  /** Replace every setlist, used when restoring a library backup. */
  replaceSetlists: (setlists: Setlist[]) => void;
}

const STORAGE_KEY = 'chorde_setlists';

/**
 * Read the setlists, bringing any that were saved in an older shape up to date.
 *
 * Setlists used to be a plain list of song ids. They now carry how each song
 * should be played, so the old ones are given an empty setting for each song.
 */
export const migrateSetlists = (raw: unknown): Setlist[] => {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter(
      (entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === 'object'
    )
    .map((entry) => {
      if (Array.isArray(entry.songs)) {
        return entry as unknown as Setlist;
      }

      // The old shape: a list of song ids.
      const songIds = Array.isArray(entry.songIds) ? entry.songIds : [];
      const migrated = { ...entry } as Record<string, unknown>;
      delete migrated.songIds;
      migrated.songs = songIds.map((songId) => ({ songId }));

      return migrated as unknown as Setlist;
    });
};

function loadFromStorage(): Setlist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return migrateSetlists(JSON.parse(raw));
  } catch {
    return [];
  }
}

function saveToStorage(setlists: Setlist[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(setlists));
  } catch {
    // ignore
  }
}

const touch = (setlist: Setlist): Setlist => ({ ...setlist, updatedAt: new Date().toISOString() });

export const useSetlistStore = create<SetlistState>((set, get) => ({
  setlists: loadFromStorage(),

  loadSetlists: () => set({ setlists: loadFromStorage() }),

  createSetlist: (name) => {
    const now = new Date().toISOString();
    const setlist: Setlist = {
      id: createId(),
      name,
      songs: [],
      createdAt: now,
      updatedAt: now,
    };
    set((state) => {
      const next = [...state.setlists, setlist];
      saveToStorage(next);
      return { setlists: next };
    });
    return setlist;
  },

  renameSetlist: (id, name) => {
    set((state) => {
      const next = state.setlists.map((s) => (s.id === id ? touch({ ...s, name }) : s));
      saveToStorage(next);
      return { setlists: next };
    });
  },

  deleteSetlist: (id) => {
    set((state) => {
      const next = state.setlists.filter((s) => s.id !== id);
      saveToStorage(next);
      return { setlists: next };
    });
  },

  addSong: (setlistId, songId) => {
    set((state) => {
      const next = state.setlists.map((s) => {
        if (s.id !== setlistId) return s;
        if (s.songs.some((song) => song.songId === songId)) return s;
        return touch({ ...s, songs: [...s.songs, { songId }] });
      });
      saveToStorage(next);
      return { setlists: next };
    });
  },

  removeSong: (setlistId, songId) => {
    set((state) => {
      const next = state.setlists.map((s) => {
        if (s.id !== setlistId) return s;
        return touch({ ...s, songs: s.songs.filter((song) => song.songId !== songId) });
      });
      saveToStorage(next);
      return { setlists: next };
    });
  },

  reorderSongs: (setlistId, songIds) => {
    set((state) => {
      const next = state.setlists.map((s) => {
        if (s.id !== setlistId) return s;
        const byId = new Map(s.songs.map((song) => [song.songId, song]));
        const reordered = songIds
          .map((songId) => byId.get(songId))
          .filter((song): song is SetlistSong => Boolean(song));
        // Anything not in the given order is kept at the end.
        const kept = s.songs.filter((song) => !songIds.includes(song.songId));
        return touch({ ...s, songs: [...reordered, ...kept] });
      });
      saveToStorage(next);
      return { setlists: next };
    });
  },

  updateSong: (setlistId, songId, changes) => {
    set((state) => {
      const next = state.setlists.map((s) => {
        if (s.id !== setlistId) return s;
        return touch({
          ...s,
          songs: s.songs.map((song) => (song.songId === songId ? { ...song, ...changes } : song)),
        });
      });
      saveToStorage(next);
      return { setlists: next };
    });
  },

  setTargetKey: (setlistId, key) => {
    set((state) => {
      const next = state.setlists.map((s) =>
        s.id === setlistId ? touch({ ...s, targetKey: key }) : s
      );
      saveToStorage(next);
      return { setlists: next };
    });
  },

  playInKey: (setlistId, key, keys) => {
    set((state) => {
      const next = state.setlists.map((s) => {
        if (s.id !== setlistId) return s;

        const songs = s.songs.map((song) => {
          const writtenKey = keys[song.songId];
          if (!writtenKey) return song;
          const shift = keyShift(writtenKey, key);
          return { ...song, transpose: shift };
        });

        return touch({ ...s, songs, targetKey: key });
      });
      saveToStorage(next);
      return { setlists: next };
    });
  },

  getSetlist: (id) => get().setlists.find((s) => s.id === id),

  replaceSetlists: (setlists) => {
    const migrated = migrateSetlists(setlists);
    set({ setlists: migrated });
    saveToStorage(migrated);
  },
}));

// Keep the setlists in step with other browser tabs.
if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      useSetlistStore.setState({ setlists: loadFromStorage() });
    }
  });
}
