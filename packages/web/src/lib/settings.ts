import { useCallback, useEffect, useState } from 'react';

export const SETTINGS_STORAGE_KEY = 'chorde_settings';

export interface AppSettings {
  cloudSync: {
    lastBackupAt: string | null;
    lastRestoreAt: string | null;
  };
  stageMode: {
    defaultBpm: number;
    beatsPerLine: number;
    countInBeats: number;
    clickSoundEnabled: boolean;
    lockTempo: boolean;
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  cloudSync: {
    lastBackupAt: null,
    lastRestoreAt: null,
  },
  stageMode: {
    defaultBpm: 120,
    beatsPerLine: 4,
    countInBeats: 4,
    clickSoundEnabled: true,
    lockTempo: false,
  },
};

const readStoredSettings = (): AppSettings => {
  if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;

  const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!stored) return DEFAULT_SETTINGS;

  try {
    const parsed = JSON.parse(stored) as Partial<AppSettings>;
    return {
      cloudSync: { ...DEFAULT_SETTINGS.cloudSync, ...parsed.cloudSync },
      stageMode: { ...DEFAULT_SETTINGS.stageMode, ...parsed.stageMode },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const loadSettings = (): AppSettings => readStoredSettings();

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage may be unavailable (private mode, quota). Settings stay in memory.
  }
};

/**
 * App-wide settings, kept in sync across browser tabs.
 */
export const useAppSettings = (): [AppSettings, (next: AppSettings) => void] => {
  const [settings, setSettings] = useState<AppSettings>(readStoredSettings);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === SETTINGS_STORAGE_KEY) {
        setSettings(readStoredSettings());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const update = useCallback((next: AppSettings) => {
    setSettings(next);
    saveSettings(next);
  }, []);

  return [settings, update];
};
