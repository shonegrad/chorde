import { create } from 'zustand';
import { createId } from '../lib/id';

export interface Setlist {
  id: string;
  name: string;
  songIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface SetlistState {
  setlists: Setlist[];
  loadSetlists: () => void;
  createSetlist: (name: string) => Setlist;
  renameSetlist: (id: string, name: string) => void;
  deleteSetlist: (id: string) => void;
  addSong: (setlistId: string, songId: string) => void;
  removeSong: (setlistId: string, songId: string) => void;
  reorderSongs: (setlistId: string, songIds: string[]) => void;
  getSetlist: (id: string) => Setlist | undefined;
  /** Replace every setlist, used when restoring a library backup. */
  replaceSetlists: (setlists: Setlist[]) => void;
}

const STORAGE_KEY = 'chorde_setlists';

function loadFromStorage(): Setlist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
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

export const useSetlistStore = create<SetlistState>((set, get) => ({
  setlists: loadFromStorage(),

  loadSetlists: () => set({ setlists: loadFromStorage() }),

  createSetlist: (name) => {
    const now = new Date().toISOString();
    const setlist: Setlist = {
      id: createId(),
      name,
      songIds: [],
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
      const next = state.setlists.map((s) =>
        s.id === id ? { ...s, name, updatedAt: new Date().toISOString() } : s
      );
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
        if (s.songIds.includes(songId)) return s;
        return { ...s, songIds: [...s.songIds, songId], updatedAt: new Date().toISOString() };
      });
      saveToStorage(next);
      return { setlists: next };
    });
  },

  removeSong: (setlistId, songId) => {
    set((state) => {
      const next = state.setlists.map((s) => {
        if (s.id !== setlistId) return s;
        return {
          ...s,
          songIds: s.songIds.filter((id) => id !== songId),
          updatedAt: new Date().toISOString(),
        };
      });
      saveToStorage(next);
      return { setlists: next };
    });
  },

  reorderSongs: (setlistId, songIds) => {
    set((state) => {
      const next = state.setlists.map((s) => {
        if (s.id !== setlistId) return s;
        return { ...s, songIds, updatedAt: new Date().toISOString() };
      });
      saveToStorage(next);
      return { setlists: next };
    });
  },

  getSetlist: (id) => get().setlists.find((s) => s.id === id),

  replaceSetlists: (setlists) => {
    set({ setlists });
    saveToStorage(setlists);
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
