import { create } from 'zustand';
import type { DisplayMode } from '../types';

interface PlayerState {
  autoScroll: boolean;
  manualScrollSpeed: number | null;
  loopMode: boolean;
  loopSection: number | null;
  transpose: number;
  capo: number;
  displayMode: DisplayMode;
  fontSize: number;
  bpm: number | null;
  overrideBpm: number | null;
  lockTempo: boolean;
  countIn: number;
  setAutoScroll: (v: boolean) => void;
  setManualScrollSpeed: (v: number | null) => void;
  setLoopMode: (v: boolean) => void;
  setLoopSection: (v: number | null) => void;
  setTranspose: (v: number | ((prev: number) => number)) => void;
  setCapo: (v: number) => void;
  setDisplayMode: (v: DisplayMode) => void;
  setFontSize: (v: number | ((prev: number) => number)) => void;
  setBpm: (v: number | null | ((prev: number | null) => number | null)) => void;
  setOverrideBpm: (v: number | null) => void;
  setLockTempo: (v: boolean) => void;
  setCountIn: (v: number | ((prev: number) => number)) => void;
  reset: () => void;
}

const initialState = {
  autoScroll: false,
  manualScrollSpeed: null,
  loopMode: false,
  loopSection: null,
  transpose: 0,
  capo: 0,
  displayMode: 'chords' as DisplayMode,
  fontSize: 20,
  bpm: null,
  overrideBpm: null,
  lockTempo: false,
  countIn: 0,
};

export const usePlayerStore = create<PlayerState>((set) => ({
  ...initialState,
  setAutoScroll: (v) => set({ autoScroll: v }),
  setManualScrollSpeed: (v) => set({ manualScrollSpeed: v }),
  setLoopMode: (v) => set({ loopMode: v }),
  setLoopSection: (v) => set({ loopSection: v }),
  setTranspose: (v) => set((s) => ({ transpose: typeof v === 'function' ? v(s.transpose) : v })),
  setCapo: (v) => set({ capo: v }),
  setDisplayMode: (v) => set({ displayMode: v }),
  setFontSize: (v) => set((s) => ({ fontSize: typeof v === 'function' ? v(s.fontSize) : v })),
  setBpm: (v) => set((s) => ({ bpm: typeof v === 'function' ? v(s.bpm) : v })),
  setOverrideBpm: (v) => set({ overrideBpm: v }),
  setLockTempo: (v) => set({ lockTempo: v }),
  setCountIn: (v) => set((s) => ({ countIn: typeof v === 'function' ? v(s.countIn) : v })),
  reset: () => set({ ...initialState }),
}));
