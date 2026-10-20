import React from 'react';
import {
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
import { useAppSettings } from '../lib/settings';

export const Settings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [settings, updateSettings] = useAppSettings();

  return (
    <Box sx={{ p: 3, height: '100vh', overflowY: 'auto' }}>
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
    </Box>
  );
};
