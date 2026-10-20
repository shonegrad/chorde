import React, { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Link,
  Slider,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useAppSettings } from '../lib/settings';
import { useLibraryStore } from '../store/libraryStore';
import { useSetlistStore } from '../store/setlistStore';
import { buildSnapshot, downloadSnapshot, readSnapshotFile } from '../lib/backup';
import { useNotification } from '../context/NotificationContext';
import { useThemeMode } from '../context/ThemeModeContext';

export const Settings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [settings, updateSettings] = useAppSettings();
  const { notifySuccess, notifyError } = useNotification();
  const { preference, setPreference, mode } = useThemeMode();

  const songs = useLibraryStore((s) => s.songs);
  const bulkUpsert = useLibraryStore((s) => s.bulkUpsert);
  const resetLibrary = useLibraryStore((s) => s.resetLibrary);
  const setlists = useSetlistStore((s) => s.setlists);
  const replaceSetlists = useSetlistStore((s) => s.replaceSetlists);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingRestore, setPendingRestore] = useState<Awaited<
    ReturnType<typeof readSnapshotFile>
  > | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleExport = () => {
    try {
      downloadSnapshot(buildSnapshot(songs, setlists));
      notifySuccess(`Exported ${songs.length} songs and ${setlists.length} setlists.`);
    } catch {
      notifyError('Could not export your library.');
    }
  };

  const handlePickFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Allow the same file to be picked again.
    event.target.value = '';
    if (!file) return;

    try {
      const snapshot = await readSnapshotFile(file);
      setPendingRestore(snapshot);
    } catch (error) {
      notifyError(error instanceof Error ? error.message : 'Could not read that backup.');
    }
  };

  const handleRestore = async () => {
    if (!pendingRestore) return;

    const snapshot = pendingRestore;
    setPendingRestore(null);

    try {
      // One transaction for the whole library rather than one per song.
      await bulkUpsert(snapshot.songs);
      if (snapshot.setlists.length > 0) {
        replaceSetlists(snapshot.setlists);
      }
      notifySuccess(
        `Restored ${snapshot.songs.length} songs${snapshot.setlists.length ? ` and ${snapshot.setlists.length} setlists` : ''}.`
      );
    } catch {
      notifyError('Could not restore that backup.');
    }
  };

  const handleReset = async () => {
    setConfirmReset(false);
    try {
      await resetLibrary();
      notifySuccess('Library reset to the built-in songs.');
    } catch {
      notifyError('Could not reset your library.');
    }
  };

  return (
    <Box sx={{ p: 3, height: 'var(--app-height)', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button variant="contained" size="small" onClick={onBack}>
          Back
        </Button>
        <Typography variant="h5" fontWeight="bold">
          Settings
        </Typography>
        <Box sx={{ width: 64 }} />
      </Box>

      <Stack spacing={4}>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Backup
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your library is stored in this browser only. Save a copy to a file so you can move it to
            another device or restore it if the browser data is cleared.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
              Export library
            </Button>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => fileInputRef.current?.click()}
            >
              Import library
            </Button>
            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="application/json,.json"
              onChange={handlePickFile}
            />
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {songs.length} songs · {setlists.length} setlists
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" fontWeight="bold">
            Appearance
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Chorde follows the system setting by default, and remembers your choice. Currently using
            the {mode} theme.
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={preference}
            onChange={(_event, value) => {
              if (value) setPreference(value);
            }}
            aria-label="Colour theme"
            size="small"
          >
            <ToggleButton value="light" aria-label="Light theme">
              <LightModeIcon sx={{ mr: 1 }} />
              Light
            </ToggleButton>
            <ToggleButton value="dark" aria-label="Dark theme">
              <DarkModeIcon sx={{ mr: 1 }} />
              Dark
            </ToggleButton>
            <ToggleButton value="system" aria-label="Follow the system theme">
              <SettingsBrightnessIcon sx={{ mr: 1 }} />
              System
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" fontWeight="bold">
            Stage Mode
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            These values are used when you open a song for playing: the starting tempo, how the
            auto-scroll is paced, and whether a count-in is played before scrolling starts.
          </Typography>
          <Stack spacing={3} sx={{ mt: 2, maxWidth: 420 }}>
            <Box>
              <Typography gutterBottom>Default BPM: {settings.stageMode.defaultBpm}</Typography>
              <Slider
                value={settings.stageMode.defaultBpm}
                min={40}
                max={208}
                aria-label="Default BPM"
                onChange={(_, value) =>
                  updateSettings({
                    ...settings,
                    stageMode: { ...settings.stageMode, defaultBpm: value as number },
                  })
                }
              />
            </Box>

            <Box>
              <Typography gutterBottom>
                Beats Per Line: {settings.stageMode.beatsPerLine}
              </Typography>
              <Slider
                value={settings.stageMode.beatsPerLine}
                min={1}
                max={8}
                step={1}
                aria-label="Beats per line"
                onChange={(_, value) =>
                  updateSettings({
                    ...settings,
                    stageMode: { ...settings.stageMode, beatsPerLine: value as number },
                  })
                }
              />
            </Box>

            <Box>
              <Typography gutterBottom>
                Count-In Beats: {settings.stageMode.countInBeats}
              </Typography>
              <Slider
                value={settings.stageMode.countInBeats}
                min={0}
                max={8}
                step={1}
                aria-label="Count-in beats"
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
                  inputProps={{ 'aria-label': 'Enable click sound' }}
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
                  inputProps={{ 'aria-label': 'Lock tempo by default' }}
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
          <Typography variant="h6" fontWeight="bold">
            Reset
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Remove every song you have added and go back to the built-in library. Export a backup
            first if you want to keep your songs.
          </Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<RestartAltIcon />}
            onClick={() => setConfirmReset(true)}
          >
            Reset library
          </Button>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" fontWeight="bold">
            About
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chorde is a local-first songbook. Your library is stored in this browser, so it stays
            private and works offline.
          </Typography>
          <Link
            href="https://github.com/shonegrad/chorde"
            target="_blank"
            rel="noreferrer"
            sx={{ mt: 1, display: 'inline-block' }}
          >
            Project repository
          </Link>
        </Box>
      </Stack>

      {/* Restore confirmation */}
      <Dialog open={!!pendingRestore} onClose={() => setPendingRestore(null)} maxWidth="sm">
        <DialogTitle>Restore this backup?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This backup contains {pendingRestore?.songs.length ?? 0} songs
            {pendingRestore?.setlists.length
              ? ` and ${pendingRestore.setlists.length} setlists`
              : ''}
            , taken on {pendingRestore?.exportedAt.slice(0, 10)}.
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            Songs in the backup are added to your library. Anything already in your library is kept.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingRestore(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleRestore}>
            Restore
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset confirmation */}
      <Dialog open={confirmReset} onClose={() => setConfirmReset(false)} maxWidth="sm">
        <DialogTitle>Reset your library?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Every song you have imported or created will be deleted, and the library will go back to
            the built-in songs. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmReset(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleReset}>
            Reset library
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
