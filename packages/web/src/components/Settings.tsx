import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Link,
  Slider,
  Stack,
  Switch,
  Typography,
} from '@mui/material';

const SETTINGS_STORAGE_KEY = 'chorde_settings';

interface AppSettings {
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

const defaultSettings: AppSettings = {
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

export const Settings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [driveConfigured, setDriveConfigured] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch {
        setSettings(defaultSettings);
      }
    }

    setDriveConfigured(Boolean(import.meta.env.VITE_GDRIVE_CLIENT_ID && import.meta.env.VITE_GDRIVE_API_KEY));
  }, []);

  const updateSettings = (next: AppSettings) => {
    setSettings(next);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <Box sx={{ p: 3, height: '100vh', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button variant="contained" size="small" onClick={onBack}>
          Back
        </Button>
        <Typography variant="h5" fontWeight="bold">Settings</Typography>
        <Box sx={{ width: 64 }} />
      </Box>

      <Stack spacing={4}>
        <Box>
          <Typography variant="h6" fontWeight="bold">CloudSync</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Google Drive backup wiring is scaffolded for Phase 1, but full connection flow still needs hardening.
          </Typography>
          {!driveConfigured ? (
            <Alert severity="info">
              Add `VITE_GDRIVE_CLIENT_ID` and `VITE_GDRIVE_API_KEY` to enable Drive setup.
            </Alert>
          ) : (
            <Alert severity="success">Google Drive credentials detected.</Alert>
          )}
          <Typography variant="body2" sx={{ mt: 2 }}>
            Last backup: {settings.cloudSync.lastBackupAt ?? 'Never'}
          </Typography>
          <Typography variant="body2">
            Last restore: {settings.cloudSync.lastRestoreAt ?? 'Never'}
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" fontWeight="bold">Stage Mode</Typography>
          <Stack spacing={3} sx={{ mt: 2, maxWidth: 420 }}>
            <Box>
              <Typography gutterBottom>Default BPM: {settings.stageMode.defaultBpm}</Typography>
              <Slider
                value={settings.stageMode.defaultBpm}
                min={40}
                max={208}
                onChange={(_, value) =>
                  updateSettings({
                    ...settings,
                    stageMode: { ...settings.stageMode, defaultBpm: value as number },
                  })
                }
              />
            </Box>

            <Box>
              <Typography gutterBottom>Beats Per Line: {settings.stageMode.beatsPerLine}</Typography>
              <Slider
                value={settings.stageMode.beatsPerLine}
                min={1}
                max={8}
                step={1}
                onChange={(_, value) =>
                  updateSettings({
                    ...settings,
                    stageMode: { ...settings.stageMode, beatsPerLine: value as number },
                  })
                }
              />
            </Box>

            <Box>
              <Typography gutterBottom>Count-In Beats: {settings.stageMode.countInBeats}</Typography>
              <Slider
                value={settings.stageMode.countInBeats}
                min={0}
                max={8}
                step={1}
                onChange={(_, value) =>
                  updateSettings({
                    ...settings,
                    stageMode: { ...settings.stageMode, countInBeats: value as number },
                  })
                }
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.stageMode.clickSoundEnabled}
                  onChange={(event) =>
                    updateSettings({
                      ...settings,
                      stageMode: { ...settings.stageMode, clickSoundEnabled: event.target.checked },
                    })
                  }
                />
              }
              label="Enable click sound"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.stageMode.lockTempo}
                  onChange={(event) =>
                    updateSettings({
                      ...settings,
                      stageMode: { ...settings.stageMode, lockTempo: event.target.checked },
                    })
                  }
                />
              }
              label="Lock tempo by default"
            />
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" fontWeight="bold">About</Typography>
          <Typography variant="body2" color="text.secondary">
            Chorde is a local-first songbook with import, search, sync scaffolding, and stage mode controls.
          </Typography>
          <Link href="https://github.com/shonegrad/chorde" target="_blank" rel="noreferrer" sx={{ mt: 1, display: 'inline-block' }}>
            Project repository
          </Link>
        </Box>
      </Stack>
    </Box>
  );
};
