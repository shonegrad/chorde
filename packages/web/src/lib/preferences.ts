import type { DisplayMode } from '../types';

export const VIEWER_PREFS_KEY = 'chorde_viewer_prefs';
export const SONG_PREFS_KEY = 'chorde_song_prefs';

/** Preferences that apply to every song. */
export interface ViewerPreferences {
  fontSize: number;
  displayMode: DisplayMode;
}

/** Preferences that are remembered per song. */
export interface SongPreferences {
  transpose: number;
  capo: number;
}

export const DEFAULT_VIEWER_PREFERENCES: ViewerPreferences = {
  fontSize: 20,
  displayMode: 'chords',
};

export const MIN_FONT_SIZE = 12;
export const MAX_FONT_SIZE = 48;

const readJson = <T>(key: string): T | null => {
  if (typeof localStorage === 'undefined') return null;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : null;
  } catch {
    return null;
  }
};

const writeJson = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Best effort only; preferences are a convenience, not critical state.
  }
};

export const loadViewerPreferences = (): ViewerPreferences => {
  const stored = readJson<Partial<ViewerPreferences>>(VIEWER_PREFS_KEY);
  if (!stored) return DEFAULT_VIEWER_PREFERENCES;

  const fontSize =
    typeof stored.fontSize === 'number' &&
    stored.fontSize >= MIN_FONT_SIZE &&
    stored.fontSize <= MAX_FONT_SIZE
      ? stored.fontSize
      : DEFAULT_VIEWER_PREFERENCES.fontSize;

  const displayMode: DisplayMode =
    stored.displayMode === 'chords' ||
    stored.displayMode === 'nashville' ||
    stored.displayMode === 'tabs' ||
    stored.displayMode === 'notation'
      ? stored.displayMode
      : DEFAULT_VIEWER_PREFERENCES.displayMode;

  return { fontSize, displayMode };
};

export const saveViewerPreferences = (preferences: ViewerPreferences): void => {
  writeJson(VIEWER_PREFS_KEY, preferences);
};

export const loadSongPreferences = (songId: string): SongPreferences => {
  const all = readJson<Record<string, Partial<SongPreferences>>>(SONG_PREFS_KEY) ?? {};
  const stored = all[songId] ?? {};
  return {
    transpose: typeof stored.transpose === 'number' ? stored.transpose : 0,
    capo: typeof stored.capo === 'number' ? stored.capo : 0,
  };
};

export const saveSongPreferences = (songId: string, preferences: SongPreferences): void => {
  const all = readJson<Record<string, Partial<SongPreferences>>>(SONG_PREFS_KEY) ?? {};
  all[songId] = preferences;
  writeJson(SONG_PREFS_KEY, all);
};
