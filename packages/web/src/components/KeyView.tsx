import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLibraryStore } from '../store/libraryStore';
import { parseChordPro } from '../lib/chordPro';
import { chordsOfKey } from '../lib/keyDetection';
import { songFitsKey } from '../lib/fit';
import type { Song } from '../types';
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';

/** The chords a song uses, in the order they appear. */
const chordsOf = (song: Song): string[] =>
  parseChordPro(song.content).flatMap((line) =>
    line.items.map((item) => item.chord).filter((chord): chord is string => Boolean(chord))
  );

/**
 * Everything about one key.
 *
 * The songs that are in the key, and the songs that could be played in it
 * because every chord they use is a chord of the key.
 */
export const KeyView: React.FC = () => {
  const { key = '' } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const songs = useLibraryStore((s) => s.songs);

  const chords = useMemo(() => chordsOfKey(key), [key]);

  const inKey = useMemo(() => songs.filter((song) => song.key === key), [songs, key]);

  const fits = useMemo(
    () => songs.filter((song) => song.key !== key && songFitsKey(chordsOf(song), key)),
    [songs, key]
  );

  if (!key) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>No key was given.</Typography>
        <Button onClick={() => navigate('/')}>Back to the library</Button>
      </Container>
    );
  }

  const songRow = (song: Song) => (
    <ListItem key={song.id} disablePadding>
      <ListItemButton onClick={() => navigate(`/song/${song.id}`)}>
        <ListItemText
          primary={song.title}
          secondary={[song.artist, song.key ? `Key ${song.key}` : null].filter(Boolean).join(' · ')}
        />
      </ListItemButton>
    </ListItem>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/')} aria-label="Back to the library">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="bold">
          {key}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          startIcon={<LibraryMusicIcon />}
          variant="outlined"
          onClick={() => navigate('/chords')}
        >
          The chords of {key}
        </Button>
        <Button variant="outlined" onClick={() => navigate(`/?key=${encodeURIComponent(key)}`)}>
          Show them in the library
        </Button>
      </Stack>

      {/* The chords of the key */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          The chords of {key}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
          {chords.map((chord) => (
            <Chip
              key={chord.degree}
              label={`${chord.name} · ${chord.degree}`}
              variant="outlined"
              sx={{ fontFamily: 'monospace' }}
            />
          ))}
        </Stack>
      </Paper>

      {/* The songs that are in the key */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Songs in {key} ({inKey.length})
      </Typography>
      {inKey.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            None of your songs are in {key} yet.
          </Typography>
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ mb: 3 }}>
          <List dense>{inKey.map(songRow)}</List>
        </Paper>
      )}

      {/* The songs that could be played in the key */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Songs that fit {key} ({fits.length})
      </Typography>
      {fits.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            No other song is built on the chords of {key}.
          </Typography>
        </Paper>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Every chord in these songs is a chord of {key}, so they can be played in it as they are.
          </Typography>
          <Paper variant="outlined" sx={{ mb: 3 }}>
            <List dense>{fits.map(songRow)}</List>
          </Paper>
        </>
      )}
    </Container>
  );
};
