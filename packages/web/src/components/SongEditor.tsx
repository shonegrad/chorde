import React, { useState } from 'react';
import type { Song } from '../types';
import { createId } from '../lib/id';
import { TextField, Button, Stack, Typography, Container, Paper } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';

interface SongEditorProps {
  initialSong?: Song;
  onSave: (song: Song) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

export const SongEditor: React.FC<SongEditorProps> = ({
  initialSong,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [title, setTitle] = useState(initialSong?.title || '');
  const [artist, setArtist] = useState(initialSong?.artist || '');
  const [content, setContent] = useState(initialSong?.content || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialSong?.id || createId(),
      title,
      artist,
      content,
      format: initialSong?.format || 'plaintext',
      capo: initialSong?.capo,
      tags: initialSong?.tags || ['custom'],
      sections: initialSong?.sections,
      key: initialSong?.key,
      bpm: initialSong?.bpm,
      timeSignature: initialSong?.timeSignature || '4/4',
      attribution: initialSong?.attribution || {
        sourceName: 'Custom',
        sourceUrl: '',
        license: 'unknown',
        verifiedBy: 'manual',
      },
      rightsStatus: initialSong?.rightsStatus || 'unknown',
      createdAt: initialSong?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hash: initialSong?.hash || createId(),
    });
  };

  const handleDelete = () => {
    if (initialSong && onDelete && confirm('Are you sure you want to delete this song?')) {
      onDelete(initialSong.id);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4, height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
        {initialSong ? 'Edit Song' : 'New Song'}
      </Typography>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        variant="outlined"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 3,
          gap: 3,
          bgcolor: 'background.paper',
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
            fullWidth
            variant="outlined"
          />
        </Stack>

        <TextField
          label="song content"
          placeholder="[Am]Type your song [C]here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          fullWidth
          sx={{
            flex: 1,
            '& .MuiInputBase-root': {
              height: '100%',
              alignItems: 'flex-start',
              fontFamily: 'monospace',
            },
          }}
          InputProps={{
            sx: { fontFamily: 'monospace' },
          }}
          required
        />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<CancelIcon />} onClick={onCancel}>
              Cancel
            </Button>

            {initialSong && onDelete && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </Stack>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
          >
            Save Song
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};
