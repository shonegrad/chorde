import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSetlistStore } from '../store/setlistStore';
import { useLibraryStore } from '../store/libraryStore';
import { useAppSettings } from '../lib/settings';
import { useAutoScroll } from '../lib/useAutoScroll';
import { prepareSong } from '../lib/songPlayback';
import { beatsPerBar, buildProgression, type ProgressionChord } from '../lib/progression';
import {
  playClick,
  playSequence,
  resumeAudioContext,
  stopAllSounds,
  type SequenceHandle,
} from '../lib/audio';
import { SongBody } from './SongBody';
import {
  AppBar,
  Box,
  Button,
  Chip,
  IconButton,
  Slider,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

/**
 * Plays a setlist.
 *
 * One song fills the screen, with a count-in before it starts and the next
 * song coming up by itself when this one has been played out.
 */
export const SetlistPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const setlist = useSetlistStore((s) => s.getSetlist(id ?? ''));
  const updateSong = useSetlistStore((s) => s.updateSong);
  const songs = useLibraryStore((s) => s.songs);
  const [settings] = useAppSettings();

  const [index, setIndex] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const [countIn, setCountIn] = useState(0);

  // The transposition and capo can be changed while playing, so they are kept
  // here as well as on the setlist.
  const [changed, setChanged] = useState<{ transpose?: number; capo?: number }>({});
  const [playingProgression, setPlayingProgression] = useState<ProgressionChord[] | null>(null);

  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sequenceRef = useRef<SequenceHandle | null>(null);

  const entries = setlist?.songs ?? [];
  const entry = entries[index];
  const song = useMemo(
    () => songs.find((candidate) => candidate.id === entry?.songId),
    [songs, entry?.songId]
  );

  const transpose = changed.transpose ?? entry?.transpose ?? 0;
  const capo = changed.capo ?? entry?.capo ?? song?.capo ?? 0;

  const prepared = useMemo(() => prepareSong(song, transpose, capo), [song, transpose, capo]);

  const bpm = song?.bpm ?? settings.stageMode.defaultBpm;
  const scrollSpeed = (bpm / 60) * settings.stageMode.beatsPerLine * 40;

  // A new song starts from the beginning.
  const songId = entry?.songId;
  const [lastSongId, setLastSongId] = useState<string | undefined>(undefined);
  if (songId !== lastSongId) {
    setLastSongId(songId);
    setChanged({});
    setScrolling(false);
    // Each song starts with a count-in.
    setCountIn(settings.stageMode.countInBeats);
  }

  const click = useCallback((accent: boolean) => {
    playClick(accent);
  }, []);

  /*
   * The chords of the song, so they can be heard before they are played.
   */
  const progression = useMemo(
    () => buildProgression(prepared.lines, { capo }),
    [prepared.lines, capo]
  );

  /*
   * The chords are only playing if they are the ones that were started.
   *
   * When the song is transposed the chords change, so the ones being played
   * are no longer the ones on the screen.
   */
  const playingChords = playingProgression !== null && playingProgression === progression;

  const toggleChordPlayback = useCallback(async () => {
    if (playingChords) {
      sequenceRef.current?.stop();
      sequenceRef.current = null;
      setPlayingProgression(null);
      return;
    }

    if (progression.length === 0) return;

    await resumeAudioContext();

    const duration = (60 / bpm) * beatsPerBar(song?.timeSignature);

    const handle = playSequence(
      progression.map((chord) => ({ notes: chord.notes, duration })),
      { onEnd: () => setPlayingProgression(null) }
    );

    sequenceRef.current = handle;
    setPlayingProgression(progression);
  }, [playingChords, progression, bpm, song?.timeSignature]);

  // The chords stop when the song is left.
  useEffect(
    () => () => {
      sequenceRef.current?.stop();
      sequenceRef.current = null;
      stopAllSounds();
    },
    []
  );

  // The chords stop when they change, so the wrong chord is never heard.
  useEffect(() => {
    sequenceRef.current?.stop();
    sequenceRef.current = null;
  }, [progression]);

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= entries.length) return;
      setIndex(next);
    },
    [entries.length]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const previous = useCallback(() => goTo(index - 1), [goTo, index]);

  const containerRef = useAutoScroll({
    enabled: scrolling,
    speed: scrollSpeed,
    linesRef: lineRefs,
    onReachEnd: () => {
      setScrolling(false);
      next();
    },
  });

  /*
   * The count-in runs a beat at a time at the tempo of the song, so the first
   * bar of the song starts where you expect it to.
   */
  useEffect(() => {
    if (countIn <= 0) return;

    const beat = 60000 / bpm;
    const timer = setTimeout(() => {
      click(countIn === settings.stageMode.countInBeats);
      setCountIn((previous) => Math.max(0, previous - 1));
    }, beat);

    return () => clearTimeout(timer);
  }, [countIn, bpm, click, settings.stageMode.countInBeats]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') previous();
      if (event.key === ' ') {
        event.preventDefault();
        setScrolling((value) => !value);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, previous]);

  const remember = (changes: { transpose?: number; capo?: number }) => {
    if (!entry) return;
    setChanged((current) => ({ ...current, ...changes }));
    updateSong(setlist!.id, entry.songId, changes);
  };

  if (!setlist || !entry) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>That setlist has no songs yet.</Typography>
        <Button onClick={() => navigate('/')}>Back to the library</Button>
      </Box>
    );
  }

  if (!song) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>This song is no longer in your library.</Typography>
        <Button onClick={() => navigate(`/setlist/${setlist.id}`)}>Back to the setlist</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <IconButton
            edge="start"
            onClick={() => navigate(`/setlist/${setlist.id}`)}
            aria-label="Back to the setlist"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="subtitle1" noWrap sx={{ flexGrow: 1 }}>
            {setlist.name}
          </Typography>
          <Chip label={`${index + 1} of ${entries.length}`} size="small" />

          <Tooltip title="Previous song">
            <span>
              <IconButton onClick={previous} disabled={index === 0} aria-label="Previous song">
                <SkipPreviousIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={scrolling ? 'Stop' : 'Start'}>
            <IconButton
              onClick={() => setScrolling((value) => !value)}
              color={scrolling ? 'primary' : 'default'}
              aria-label={scrolling ? 'Stop the scroll' : 'Start the scroll'}
            >
              {scrolling ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Next song">
            <span>
              <IconButton
                onClick={next}
                disabled={index >= entries.length - 1}
                aria-label="Next song"
              >
                <SkipNextIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* How this song is played */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider', flexWrap: 'wrap' }}
      >
        <Typography variant="h6" fontWeight="bold">
          {song.title}
        </Typography>
        {prepared.soundingKey && (
          <Chip
            label={`Key ${prepared.soundingKey}`}
            color="primary"
            variant="outlined"
            size="small"
          />
        )}

        <Stack direction="row" spacing={0.5} alignItems="center">
          <IconButton
            size="small"
            onClick={() => {
              const value = transpose - 1;
              remember({ transpose: value });
            }}
            aria-label="Transpose down"
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption" sx={{ minWidth: 26, textAlign: 'center' }}>
            {transpose > 0 ? `+${transpose}` : transpose}
          </Typography>
          <IconButton
            size="small"
            onClick={() => {
              const value = transpose + 1;
              remember({ transpose: value });
            }}
            aria-label="Transpose up"
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 160 }}>
          <Typography variant="caption" color="text.secondary">
            Capo
          </Typography>
          <Slider
            size="small"
            value={capo}
            min={0}
            max={7}
            marks
            onChange={(_, value) => {
              remember({ capo: value as number });
            }}
            aria-label="Capo"
          />
          <Typography variant="caption" sx={{ minWidth: 16 }}>
            {capo}
          </Typography>
        </Stack>

        <Tooltip title={playingChords ? 'Stop the chords' : 'Play the chords'}>
          <span>
            <IconButton
              onClick={toggleChordPlayback}
              color={playingChords ? 'primary' : 'default'}
              disabled={!playingChords && progression.length === 0}
              aria-label={playingChords ? 'Stop playing the chords' : 'Play the chords'}
            >
              <GraphicEqIcon />
            </IconButton>
          </span>
        </Tooltip>

        {entry.note && (
          <Chip label={entry.note} size="small" variant="outlined" color="secondary" />
        )}
      </Stack>

      {/* The count-in */}
      {countIn > 0 && (
        <Box sx={{ textAlign: 'center', py: 1 }}>
          <Typography variant="h3" color="primary" fontWeight="bold" aria-live="assertive">
            {countIn}
          </Typography>
        </Box>
      )}

      <Box
        ref={containerRef}
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: { xs: 2, md: 4 },
          fontSize: '20px',
        }}
      >
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          <SongBody
            lines={prepared.lines}
            displayMode="chords"
            songKey={prepared.soundingKey ?? 'C'}
            onLineRef={(lineIndex, element) => {
              lineRefs.current[lineIndex] = element;
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
