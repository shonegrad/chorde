import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';

interface LegalNoticeProps {
  isOpen: boolean;
  onClose: () => void;
  song?: {
    title: string;
    artist: string;
    license: string;
    copyright?: string;
  };
  onConfirm: () => void;
}

export const LegalNoticeModal: React.FC<LegalNoticeProps> = ({
  isOpen,
  onClose,
  song,
  onConfirm,
}) => {
  const handleImport = () => {
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} maxWidth="sm" onClose={onClose}>
      <DialogContent sx={{ px: 2, pb: 3 }}>
        <DialogTitle>Legal Notice</DialogTitle>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Before importing this song
        </Typography>

        <Stack spacing={3} sx={{ mb: 2 }}>
          {song && (
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" component="h5" sx={{ mb: 1 }}>
                {song.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                by {song.artist}
              </Typography>
              {song.copyright && (
                <Typography variant="body2" color="text.secondary">
                  {song.copyright}
                </Typography>
              )}
              {song.license !== 'public-domain' && (
                <Alert severity="warning" sx={{ p: 2 }}>
                  ⚠️ This song may be subject to copyright. Only import songs you have rights to
                  share. This places responsibility of copyright compliance on the end-user for
                  their personal library.
                </Alert>
              )}
            </Box>
          )}

          {!song && (
            <Typography variant="body2" color="text.secondary">
              Review the license information before importing.
            </Typography>
          )}
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleImport} disabled={!song}>
            Import Anyway
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
