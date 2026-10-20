import React, { useState } from 'react';
import type { Song } from '../types';
import { createId } from '../lib/id';
import { TagEditor } from './TagEditor';
import {
  TextField,
  Button,
  Stack,
  Typography,
  Container,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
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
  const [tags, setTags] = useState<string[]>(initialSong?.tags || []);
  const [favorite, setFavorite] = useState(initialSong?.favorite ?? false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialSong?.id || createId(),
      title,
      artist,
      content,
      format: initialSong?.format || 'plaintext',
      capo: initialSong?.capo,
      tags: tags.length > 0 ? tags : ['custom'],
      sections: initialSong?.sections,
      key: initialSong?.key,
      bpm: initialSong?.bpm,
      timeSignature: initialSong?.timeSignature || '4/4',
      favorite,
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
    setConfirmDelete(false);
    if (initialSong && onDelete) {
      onDelete(initialSong.id);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4, height: 'var(--app-height)', display: 'flex', flexDirection: 'column' }}
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
          overflowY: 'auto',
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
            minHeight: 200,
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

        <TagEditor tags={tags} onChange={setTags} />

        <FormControlLabel
          control={
            <Checkbox
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
              inputProps={{ 'aria-label': 'Favourite' }}
            />
          }
          label="Favourite"
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
                onClick={() => setConfirmDelete(true)}
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

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)} maxWidth="xs">
        <DialogTitle>Delete this song?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            &ldquo;{initialSong?.title}&rdquo; will be removed from your library. This cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
