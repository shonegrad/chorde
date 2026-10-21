import React, { useMemo } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { parseChordPro } from '../lib/chordPro';
import type { SharedSong } from '../lib/shareLink';
import { SongBody } from './SongBody';

interface SharedSongDialogProps {
  /** The song that was shared, if there is one. */
  song?: SharedSong;
  open: boolean;
  onClose: () => void;
  /** Called when the song is added to the library. */
  onAdd: (song: SharedSong) => void;
}

/**
 * A song somebody sent you.
 *
 * The link carries the song with it, so there is nothing to look up: the song
 * is here, and it can be added to the library or thrown away.
 */
export const SharedSongDialog: React.FC<SharedSongDialogProps> = ({
  song,
  open,
  onClose,
  onAdd,
}) => {
  const lines = useMemo(() => (song ? parseChordPro(song.content) : []), [song]);

  if (!song) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Somebody sent you a song</DialogTitle>
      <DialogContent>
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          {song.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {song.artist}
        </Typography>

        <Box sx={{ mt: 2, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
          <SongBody lines={lines} displayMode="chords" songKey={song.key ?? 'C'} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={() => onAdd(song)}>
          Add to my library
        </Button>
      </DialogActions>
    </Dialog>
  );
};
