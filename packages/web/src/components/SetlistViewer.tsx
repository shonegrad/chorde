import React, { useState } from 'react';
import { useSetlistStore } from '../store/setlistStore';
import { useLibraryStore } from '../store/libraryStore';
import { printSetlist } from '../lib/printSetlist';
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PrintIcon from '@mui/icons-material/Print';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { useNavigate, useParams } from 'react-router-dom';

const KEYS = [
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
  'Am',
  'C#m',
  'Dm',
  'D#m',
  'Ebm',
  'Em',
  'Fm',
  'F#m',
  'Gm',
  'G#m',
  'Am',
  'A#m',
  'Bbm',
  'Bm',
];

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
  const updateSong = useSetlistStore((s) => s.updateSong);
  const setTargetKey = useSetlistStore((s) => s.setTargetKey);
  const playInKey = useSetlistStore((s) => s.playInKey);

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(setlist?.name ?? '');
  const [addOpen, setAddOpen] = useState(false);
  const [settingsFor, setSettingsFor] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!setlist) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Setlist not found</Typography>
        <Button onClick={() => navigate('/')}>Back</Button>
      </Container>
    );
  }

  const songById = new Map(songs.map((song) => [song.id, song]));
  const entries = setlist.songs;

  const availableToAdd = songs.filter((song) => !entries.some((entry) => entry.songId === song.id));

  const handleRename = () => {
    if (nameDraft.trim()) renameSetlist(setlist.id, nameDraft.trim());
    setEditingName(false);
  };

  const move = (index: number, dir: -1 | 1) => {
    const ids = entries.map((entry) => entry.songId);
    const target = index + dir;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    reorderSongs(setlist.id, ids);
  };

  const keysBySong = Object.fromEntries(songs.map((song) => [song.id, song.key])) as Record<
    string,
    string | undefined
  >;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/')} aria-label="Back to the library">
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

        <Button
          startIcon={<PlayArrowIcon />}
          variant="contained"
          disabled={entries.length === 0}
          onClick={() => navigate(`/setlist/${setlist.id}/play`)}
        >
          Play
        </Button>
        <Button startIcon={<AddIcon />} onClick={() => setAddOpen(true)} variant="outlined">
          Add Song
        </Button>
        <Tooltip title="Print the running order">
          <span>
            <IconButton
              onClick={() => printSetlist(setlist, songById)}
              disabled={entries.length === 0}
              aria-label="Print the running order"
            >
              <PrintIcon />
            </IconButton>
          </span>
        </Tooltip>
        <IconButton
          color="error"
          onClick={() => setConfirmDelete(true)}
          aria-label="Delete the setlist"
        >
          <DeleteIcon />
        </IconButton>
      </Stack>

      {/* The key the whole set is played in */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              The key of the set
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {setlist.targetKey
                ? `Every song is set to ${setlist.targetKey}.`
                : 'Pick a key and every song is moved to it.'}
            </Typography>
          </Box>
          <Select
            size="small"
            value={setlist.targetKey ?? ''}
            onChange={(event) => {
              const key = event.target.value;
              if (!key) {
                setTargetKey(setlist.id, undefined);
                return;
              }
              playInKey(setlist.id, key, keysBySong);
            }}
            sx={{ minWidth: 150 }}
            aria-label="The key of the set"
          >
            <MenuItem value="">Not set</MenuItem>
            {KEYS.map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Paper>

      {entries.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">No songs yet. Add some!</Typography>
        </Paper>
      ) : (
        <List>
          {entries.map((entry, idx) => {
            const song = songById.get(entry.songId);
            const missing = !song;

            return (
              <Paper key={entry.songId} sx={{ mb: 1 }}>
                <ListItem
                  secondaryAction={
                    <Stack direction="row">
                      <IconButton
                        onClick={() => move(idx, -1)}
                        disabled={idx === 0}
                        aria-label={`Move ${song?.title ?? 'the song'} up`}
                      >
                        <ArrowUpwardIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => move(idx, 1)}
                        disabled={idx === entries.length - 1}
                        aria-label={`Move ${song?.title ?? 'the song'} down`}
                      >
                        <ArrowDownwardIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setSettingsFor(entry.songId);
                          setNoteDraft(entry.note ?? '');
                        }}
                        aria-label={`How to play ${song?.title ?? 'the song'}`}
                      >
                        <MusicNoteIcon />
                      </IconButton>
                      {song && (
                        <IconButton
                          onClick={() => navigate(`/song/${song.id}`)}
                          aria-label="Open the song"
                        >
                          <PlayArrowIcon />
                        </IconButton>
                      )}
                      <IconButton
                        color="error"
                        onClick={() => removeSong(setlist.id, entry.songId)}
                        aria-label={`Remove ${song?.title ?? 'the song'}`}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemText
                    primary={`${idx + 1}. ${song?.title ?? 'A song that is no longer in your library'}`}
                    secondary={
                      missing
                        ? 'This song is not in your library any more.'
                        : [
                            song.artist,
                            entry.transpose
                              ? `Transposed ${entry.transpose > 0 ? '+' : ''}${entry.transpose}`
                              : null,
                            entry.capo ? `Capo ${entry.capo}` : null,
                            song.key ? `Key ${song.key}` : null,
                            entry.note,
                          ]
                            .filter(Boolean)
                            .join(' · ')
                    }
                  />
                  {entry.transpose !== undefined && entry.transpose !== 0 && (
                    <Chip
                      label={`${entry.transpose > 0 ? '+' : ''}${entry.transpose}`}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  )}
                </ListItem>
              </Paper>
            );
          })}
        </List>
      )}

      {/* How to play one song */}
      <Dialog open={!!settingsFor} onClose={() => setSettingsFor(null)} maxWidth="xs" fullWidth>
        <DialogTitle>How to play this song</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Note"
            value={noteDraft}
            onChange={(event) => setNoteDraft(event.target.value)}
            placeholder="Play it quietly here"
            multiline
            minRows={2}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsFor(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (settingsFor)
                updateSong(setlist.id, settingsFor, { note: noteDraft || undefined });
              setSettingsFor(null);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add a song */}
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
                    <IconButton
                      onClick={() => addSong(setlist.id, song.id)}
                      aria-label={`Add ${song.title}`}
                    >
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

      {/* Delete the setlist */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)} maxWidth="xs">
        <DialogTitle>Delete this setlist?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            &ldquo;{setlist.name}&rdquo; will be removed. The songs stay in your library.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setConfirmDelete(false);
              deleteSetlist(setlist.id);
              navigate('/');
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
