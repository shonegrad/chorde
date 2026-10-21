import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';

interface SongNoteProps {
  /** The note written on the song, for whoever is playing it. */
  note?: string;
  /** On stage the note is big enough to read from a music stand. */
  variant?: 'reader' | 'stage';
}

/**
 * The note a song carries.
 *
 * A note is written once, in the writing desk, and it has to be there when the
 * song is read and when it is played on stage — otherwise it is a note nobody
 * ever reads.
 */
export const SongNote: React.FC<SongNoteProps> = ({ note, variant = 'reader' }) => {
  if (!note?.trim()) return null;

  const isStage = variant === 'stage';

  return (
    <Paper
      variant="outlined"
      role="note"
      aria-label="Note for this song"
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'flex-start',
        px: 1.5,
        py: 1,
        borderColor: 'secondary.main',
        ...(isStage ? { maxWidth: 720, mx: 'auto', mb: 2 } : { maxWidth: 480, mx: 'auto', mt: 2 }),
      }}
    >
      <StickyNote2Icon
        fontSize="small"
        color="secondary"
        sx={{ mt: '2px', flexShrink: 0 }}
        aria-hidden="true"
      />
      <Box>
        <Typography
          variant="caption"
          color="secondary"
          fontWeight="bold"
          sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: 0.6 }}
        >
          Note
        </Typography>
        <Typography variant={isStage ? 'h6' : 'body2'} sx={{ whiteSpace: 'pre-wrap' }}>
          {note}
        </Typography>
      </Box>
    </Paper>
  );
};
