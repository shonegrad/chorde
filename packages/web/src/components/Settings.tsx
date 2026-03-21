import React, { useState, useEffect, useCallback } from 'react';
import type { Song } from '../types';
import {
    Box,
    Typography,
    Button,
    TextField,
    Stack,
    Divider,
    CircularProgress,
    Alert,
    Switch,
    FormControlLabel,
    Slider,
    Tooltip,
    Link,
} from '@mui/material';
import { LocalLibraryStore } from '../lib/libraryStore';
import { GoogleDriveService } from '../services/googleDrive';

// Simple hash function for content (in practice, you'd use a proper hashing library)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};

const SETTINGS_VERSION_KEY = 'chorde_settings_version';
const SETTINGS_STORAGE_KEY = 'chorde_settings';
const CURRENT_SETTINGS_VERSION = '1.0';

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
  // Add more settings sections as needed
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
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreInProgress, setRestoreInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleDriveService, setGoogleDriveService] = useState<GoogleDriveService | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    const storedVersion = localStorage.getItem(SETTINGS_VERSION_KEY);
    if (stored && storedVersion === CURRENT_SETTINGS_VERSION) {
      try {
        const parsed = JSON.parse(stored) as AppSettings;
        setSettings(parsed);
      } catch (e) {
        console.error('Failed to parse settings', e);
        // If parsing fails, we'll use defaults and overwrite the storage
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
        localStorage.setItem(SETTINGS_VERSION_KEY, CURRENT_SETTINGS_VERSION);
        setSettings(defaultSettings);
      }
    } else {
      // No stored settings or version mismatch, use defaults
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
      localStorage.setItem(SETTINGS_VERSION_KEY, CURRENT_SETTINGS_VERSION);
      setSettings(defaultSettings);
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    localStorage.setItem(SETTINGS_VERSION_KEY, CURRENT_SETTINGS_VERSION);
  }, []);

  // Initialize Google Drive service if credentials are available
  useEffect(() => {
    const clientId = import.meta.env.VITE_GDRIVE_CLIENT_ID;
    const apiKey = import.meta.env.VITE_GDRIVE_API_KEY;
    
    if (clientId && apiKey) {
      const service = new GoogleDriveService(clientId, apiKey);
      setGoogleDriveService(service);
    } else {
      setError('Google Drive credentials not found. Please set VITE_GDRIVE_CLIENT_ID and VITE_GDRIVE_API_KEY environment variables.');
      setGoogleDriveService(null);
    }
  }, []);

  // Handle connecting to Google Drive
  const handleConnect = useCallback(async () => {
    if (!googleDriveService) {
      setError('Google Drive service not initialized.');
      return;
    }
    
    setConnecting(true);
    setError(null);
    try {
      await googleDriveService.init();
      await googleDriveService.authenticate();
      setConnected(true);
    } catch (err) {
      setError(`Failed to connect to Google Drive: ${err instanceof Error ? err.message : String(err)}`);
      setConnected(false);
    } finally {
      setConnecting(false);
    }
  }, [googleDriveService]);

  // Handle signing out from Google Drive
  const handleSignOut = useCallback(async () => {
    if (!googleDriveService) return;
    
    try {
      await googleDriveService.signOut();
      setConnected(false);
    } catch (err) {
      setError(`Failed to sign out: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [googleDriveService]);

  // Handle backup to Google Drive
  const handleBackup = useCallback(async () => {
    if (!googleDriveService) {
      setError('Google Drive service not initialized.');
      return;
    }
    
    if (!connected) {
      setError('Please connect to Google Drive first.');
      return;
    }
    
    setBackupInProgress(true);
    setError(null);
    try {
      await googleDriveService.backup();
      // Update last backup time
      const now = new Date().toISOString();
      saveSettings(prev => ({
        ...prev,
        cloudSync: {
          ...prev.cloudSync,
          lastBackupAt: now,
        }
      }));
    } catch (err) {
      setError(`Backup failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBackupInProgress(false);
    }
  }, [googleDriveService, connected, saveSettings]);

  // Handle restore from Google Drive
  const handleRestore = useCallback(async () => {
    if (!googleDriveService) {
      setError('Google Drive service not initialized.');
      return;
    }
    
    if (!connected) {
      setError('Please connect to Google Drive first.');
      return;
    }
    
    setRestoreInProgress(true);
    setError(null);
    try {
      await googleDriveService.restore();
      // Update last restore time
      const now = new Date().toISOString();
      saveSettings(prev => ({
        ...prev,
        cloudSync: {
          ...prev.cloudSync,
          lastRestoreAt: now,
        }
      }));
    } catch (err) {
      setError(`Restore failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setRestoreInProgress(false);
    }
  }, [googleDriveService, connected, saveSettings]);

  // Handle stage mode settings changes
  const handleDefaultBpmChange = useCallback((value: number) => {
    saveSettings(prev => ({
      ...prev,
      stageMode: {
        ...prev.stageMode,
        defaultBpm: value,
      }
    }));
  }, [saveSettings]);

  const handleBeatsPerLineChange = useCallback((value: number) => {
    saveSettings(prev => ({
      ...prev,
      stageMode: {
        ...prev.stageMode,
        beatsPerLine: value,
      }
    }));
  }, [saveSettings]);

  const handleCountInBeatsChange = useCallback((value: number) => {
    saveSettings(prev => ({
      ...prev,
      stageMode: {
        ...prev.stageMode,
        countInBeats: value,
      }
    }));
  }, [saveSettings]);

  const handleClickSoundChange = useCallback((checked: boolean) => {
    saveSettings(prev => ({
      ...prev,
      stageMode: {
        ...prev.stageMode,
        clickSoundEnabled: checked,
      }
    }));
  }, [saveSettings]);

  const handleLockTempoChange = useCallback((checked: boolean) => {
    saveSettings(prev => ({
      ...prev,
      stageMode: {
        ...prev.stageMode,
        lockTempo: checked,
      }
    }));
  }, [saveSettings]);

  return (
    <Box sx={{ p: 3, width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
        <Button variant="contained" size="small" onClick={onBack}>
          ← Back
        </Button>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Settings
        </Typography>
        <Box sx={{ width: 36 }} /> {/* Spacer for alignment */}
      </Box>
      <Divider sx={{ my: 2 }} />
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pb: 3 }}>
        <Stack spacing={3}>
          {/* CloudSync Section */}
          <Box>
            <Typography variant="h6" component="h2" fontWeight="bold">
              CloudSync
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Backup and restore your song library to Google Drive.
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            {!googleDriveService ? (
              <Alert severity="warning">
                Google Drive integration is not configured. Please set the VITE_GDRIVE_CLIENT_ID and VITE_GDRIVE_API_KEY environment variables.
              </Alert>
            ) : (
              <>
                {!connected && !connecting ? (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<Link />} 
                    onClick={handleConnect}
                  >
                    Connect to Google Drive
                  </Button>
                ) : (
                  <>
                    {connecting && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CircularProgress size={24} />
                        <Typography sx={{ ml: 2 }}>Connecting to Google Drive...</Typography>
                      </Box>
                    )}
                    {!connecting && connected && (
                      <>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body1">Connected to Google Drive</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            disabled={backupInProgress}
                            onClick={handleBackup}
                          >
                            {backupInProgress ? 'Backing up...' : 'Backup Now'}
                          </Button>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            disabled={restoreInProgress}
                            onClick={handleRestore}
                          >
                            {restoreInProgress ? 'Restoring...' : 'Restore from Backup'}
                          </Button>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Last backup: 
                            {settings.cloudSync.lastBackupAt ? (
                              new Date(settings.cloudSync.lastBackupAt).toLocaleString()
                            ) : (
                              'Never'
                            )}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Last restore: 
                            {settings.cloudSync.lastRestoreAt ? (
                              new Date(settings.cloudSync.lastRestoreAt).toLocaleString()
                            ) : (
                              'Never'
                            )}
                          </Typography>
                        </Box>
                        
                        <Button 
                          variant="text" 
                          color="error" 
                          size="small" 
                          onClick={handleSignOut}
                        >
                          Disconnect from Google Drive
                        </Button>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </Box>
          
          {/* Stage Mode Section */}
          <Box>
            <Typography variant="h6" component="h2" fontWeight="bold">
              Stage Mode
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure settings for the performance view.
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 150 }}>Default BPM:</Typography>
                <Tooltip title="Beats per minute for songs without a specified BPM">
                  <Slider
                    value={settings.stageMode.defaultBpm}
                    onChange={(_, value) => handleDefaultBpmChange(value as number)}
                    min={40}
                    max={208}
                    step={1}
                    valueLabelDisplay="auto"
                    sx={{ width: 200 }}
                  />
                </Tooltip>
                <Typography sx={{ width: 50 }}>{settings.stageMode.defaultBpm}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 150 }}>Beats per Line:</Typography>
                <Tooltip title="Number of musical beats displayed per line of chords/lyrics">
                  <Slider
                    value={settings.stageMode.beatsPerLine}
                    onChange={(_, value) => handleBeatsPerLineChange(value as number)}
                    min={1}
                    max={8}
                    step={1}
                    valueLabelDisplay="auto"
                    sx={{ width: 200 }}
                  />
                </Tooltip>
                <Typography sx={{ width: 50 }}>{settings.stageMode.beatsPerLine}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 150 }}>Count-in Beats:</Typography>
                <Tooltip title="Number of beats to play before starting auto-scroll">
                  <Slider
                    value={settings.stageMode.countInBeats}
                    onChange={(_, value) => handleCountInBeatsChange(value as number)}
                    min={0}
                    max={8}
                    step={1}
                    valueLabelDisplay="auto"
                    sx={{ width: 200 }}
                  />
                </Tooltip>
                <Typography sx={{ width: 50 }}>{settings.stageMode.countInBeats}</Typography>
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.stageMode.clickSoundEnabled}
                    onChange={(e) => handleClickSoundChange(e.target.checked)}
                  />
                }
                label="Enable count-in click sound"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.stageMode.lockTempo}
                    onChange={(e) => handleLockTempoChange(e.target.checked)}
                  />
                }
                label="Lock tempo to prevent accidental changes"
              />
            </Stack>
          </Box>
          
          {/* About Section */}
          <Box>
            <Typography variant="h6" component="h2" fontWeight="bold">
              About
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              <Typography variant="body1">
                Chorde - Songbook for Musicians
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Version: 0.1.4
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Built with React, TypeScript, and MUI
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Local-first design with optional cloud sync
              </Typography>
              <Link href="https://github.com/anomalyco/opencode" target="_blank" rel="noopener">
                Powered by Opencode
              </Link>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};