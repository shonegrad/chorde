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
  Chip,
} from '@mui/material';

export interface LegalNoticeSong {
  title: string;
  artist: string;
  license: string;
  copyright?: string;
  sourceName?: string;
}

interface LegalNoticeProps {
  isOpen: boolean;
  onClose: () => void;
  songs: LegalNoticeSong[];
  onConfirm: () => void;
}

const LICENSE_LABELS: Record<string, string> = {
  'public-domain': 'Public domain',
  'creative-commons-by': 'Creative Commons (CC BY)',
  'creative-commons-by-sa': 'Creative Commons (CC BY-SA)',
  'creative-commons-nc': 'Creative Commons (CC BY-NC)',
  'creative-commons-zero': 'Creative Commons (CC0)',
  custom: 'Custom terms',
  unknown: 'Unknown',
};

export const LegalNoticeModal: React.FC<LegalNoticeProps> = ({
  isOpen,
  onClose,
  songs,
  onConfirm,
}) => {
  if (!isOpen || songs.length === 0) return null;

  const single = songs.length === 1;

  return (
    <Dialog open={isOpen} maxWidth="sm" onClose={onClose}>
      <DialogContent sx={{ px: 2, pb: 3 }}>
        <DialogTitle>
          {single ? 'Legal Notice' : `Legal Notice — ${songs.length} songs`}
        </DialogTitle>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {single
            ? 'Before importing this song'
            : 'These songs have no confirmed public-domain licence. Review them before importing.'}
        </Typography>

        <Stack spacing={2} sx={{ mb: 2, maxHeight: 320, overflowY: 'auto' }}>
          {songs.map((song) => (
            <Box
              key={`${song.title}-${song.artist}`}
              sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}
            >
              <Typography variant="h6" component="h5" sx={{ mb: 0.5 }}>
                {song.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                by {song.artist}
                {song.sourceName ? ` · ${song.sourceName}` : ''}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: song.copyright ? 1 : 0 }}>
                <Chip
                  label={LICENSE_LABELS[song.license] ?? song.license}
                  size="small"
                  color={song.license === 'public-domain' ? 'success' : 'warning'}
                  variant="outlined"
                />
              </Stack>
              {song.copyright && (
                <Typography variant="body2" color="text.secondary">
                  {song.copyright}
                </Typography>
              )}
            </Box>
          ))}

          <Alert severity="warning" sx={{ p: 2 }}>
            These songs may be subject to copyright. Only import songs you have the rights to use.
            Chorde places responsibility for copyright compliance on you, for your personal library.
          </Alert>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="contained">
            {single ? 'Import Anyway' : `Import ${songs.length} Songs`}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
