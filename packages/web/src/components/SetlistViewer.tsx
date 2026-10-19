import React, { useState } from 'react';
import type { Song } from '../types';
import { useSetlistStore } from '../store/setlistStore';
import { useLibraryStore } from '../store/libraryStore';
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Box,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { useNavigate, useParams } from 'react-router-dom';

export const SetlistViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const setlist = useSetlistStore((s) => s.getSetlist(id ?? ''));
  const songs = useLibraryStore((s) => s.songs);
  const renameSetlist = useSetlistStore((s) => s.renameSetlist);
  const deleteSetlist = useSetlistStore((s) => s.deleteSetlist);
  const removeSong = useSetlistStore((s) => s.removeSong);
  const reorderSongs = useSetlistStore((s) => s.reorderSongs);
  const addSong = useSetlistStore((s) => s.addSong);

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(setlist?.name ?? '');
  const [addOpen, setAddOpen] = useState(false);

  if (!setlist) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Setlist not found</Typography>
        <Button onClick={() => navigate('/')}>Back</Button>
      </Container>
    );
  }

  const setlistSongs: Song[] = setlist.songIds
    .map((sid) => songs.find((s) => s.id === sid))
    .filter(Boolean) as Song[];

  const availableToAdd = songs.filter((s) => !setlist.songIds.includes(s.id));

  const handleRename = () => {
    if (nameDraft.trim()) renameSetlist(setlist.id, nameDraft.trim());
    setEditingName(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this setlist?')) {
      deleteSetlist(setlist.id);
      navigate('/');
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...setlist.songIds];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    reorderSongs(setlist.id, next);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/')}>
          <ArrowBackIcon />
        </IconButton>
        {editingName ? (
          <TextField
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            autoFocus
            size="small"
          />
        ) : (
          <Typography
            variant="h4"
            fontWeight="bold"
            onClick={() => {
              setNameDraft(setlist.name);
              setEditingName(true);
            }}
            sx={{ cursor: 'pointer' }}
          >
            {setlist.name}
          </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Button startIcon={<AddIcon />} onClick={() => setAddOpen(true)} variant="outlined">
          Add Song
        </Button>
        <IconButton color="error" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </Stack>

      {setlistSongs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">No songs yet. Add some!</Typography>
        </Paper>
      ) : (
        <List>
          {setlistSongs.map((song, idx) => (
            <Paper key={song.id} sx={{ mb: 1 }}>
              <ListItem
                secondaryAction={
                  <Stack direction="row">
                    <IconButton onClick={() => move(idx, -1)} disabled={idx === 0}>
                      <DragHandleIcon />
                    </IconButton>
                    <IconButton onClick={() => navigate(`/song/${song.id}`)}>
                      <PlayArrowIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => removeSong(setlist.id, song.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemText primary={`${idx + 1}. ${song.title}`} secondary={song.artist} />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Song to Setlist</DialogTitle>
        <DialogContent>
          {availableToAdd.length === 0 ? (
            <Typography color="text.secondary">All songs already in setlist.</Typography>
          ) : (
            <List>
              {availableToAdd.map((song) => (
                <ListItem
                  key={song.id}
                  secondaryAction={
                    <IconButton onClick={() => addSong(setlist.id, song.id)}>
                      <AddIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={song.title} secondary={song.artist} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
