import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { DisplayMode, SongSection } from '../types';
import { useSetlistStore } from '../store/setlistStore';
import { useLibraryStore } from '../store/libraryStore';
import { useAppSettings } from '../lib/settings';
import { useAutoScroll } from '../lib/useAutoScroll';
import { prepareSong } from '../lib/songPlayback';
import { beatsPerBar, buildProgression, type ProgressionChord } from '../lib/progression';
import {
  loadViewerPreferences,
  saveViewerPreferences,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
} from '../lib/preferences';
import {
  playClick,
  playSequence,
  resumeAudioContext,
  stopAllSounds,
  type SequenceHandle,
} from '../lib/audio';
import { SongBody } from './SongBody';
import { SongNote } from './SongNote';
import { SectionNav } from './SectionNav';
import {
  AppBar,
  Box,
  Button,
  Chip,
  IconButton,
  Slider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';

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
  const theme = useTheme();
  // On a phone there is not room for every control in the bar, so the ones
  // that are not needed all the time go elsewhere.
  const isCompact = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });

  const [index, setIndex] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const [countIn, setCountIn] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  /*
   * The size of the words and the way they are written are the same on stage
   * as in the reader, so nothing has to be set twice.
   */
  const initialPrefs = useMemo(() => loadViewerPreferences(), []);
  const [fontSize, setFontSize] = useState(initialPrefs.fontSize);
  const [displayMode, setDisplayMode] = useState<DisplayMode>(initialPrefs.displayMode);

  // The transposition and capo can be changed while playing, so they are kept
  // here as well as on the setlist.
  const [changed, setChanged] = useState<{ transpose?: number; capo?: number }>({});
  const [playingProgression, setPlayingProgression] = useState<ProgressionChord[] | null>(null);

  // The tempo of a song is often not written down, so it can be tapped in.
  const [tappedBpm, setTappedBpm] = useState<number | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const tapTimesRef = useRef<number[]>([]);

  // Which section of the song is on the screen.
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sequenceRef = useRef<SequenceHandle | null>(null);

  const entries = useMemo(() => setlist?.songs ?? [], [setlist?.songs]);
  const entry = entries[index];
  const song = useMemo(
    () => songs.find((candidate) => candidate.id === entry?.songId),
    [songs, entry?.songId]
  );

  // The song that comes next, so it is known before it is needed.
  const nextSong = useMemo(() => {
    const nextEntry = entries[index + 1];
    if (!nextEntry) return undefined;
    return songs.find((candidate) => candidate.id === nextEntry.songId);
  }, [entries, index, songs]);

  const transpose = changed.transpose ?? entry?.transpose ?? 0;
  const capo = changed.capo ?? entry?.capo ?? song?.capo ?? 0;

  const prepared = useMemo(() => prepareSong(song, transpose, capo), [song, transpose, capo]);

  const bpm = tappedBpm ?? song?.bpm ?? settings.stageMode.defaultBpm;
  const scrollSpeed = (bpm / 60) * settings.stageMode.beatsPerLine * 40;

  /*
   * The sections of the song, so that a section can be jumped to.
   */
  const sections = useMemo(() => {
    const found: SongSection[] = [];
    prepared.lines.forEach((line, lineIndex) => {
      if (line.section) found.push({ ...line.section, lineIndex });
    });
    return found;
  }, [prepared.lines]);

  // A new song starts from the beginning.
  const songId = entry?.songId;
  const [lastSongId, setLastSongId] = useState<string | undefined>(undefined);
  if (songId !== lastSongId) {
    setLastSongId(songId);
    setChanged({});
    setScrolling(false);
    setTappedBpm(null);
    // Each song starts with a count-in.
    setCountIn(settings.stageMode.countInBeats);
  }

  useEffect(() => {
    saveViewerPreferences({ fontSize, displayMode });
  }, [fontSize, displayMode]);

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

  const remember = (changes: { transpose?: number; capo?: number }) => {
    if (!entry) return;
    setChanged((current) => ({ ...current, ...changes }));
    updateSong(setlist!.id, entry.songId, changes);
  };

  /*
   * The whole screen, so that the words are as big as they can be.
   */
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen can be refused by the browser; the button simply does nothing.
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      // Leave the user alone while they are typing.
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }

      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') previous();
      if (event.key === ' ') {
        event.preventDefault();
        setScrolling((value) => !value);
      }
      if (event.key === 'f') {
        event.preventDefault();
        void toggleFullscreen();
      }
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        setFontSize((value) => Math.min(MAX_FONT_SIZE, value + 2));
      }
      if (event.key === '-') {
        event.preventDefault();
        setFontSize((value) => Math.max(MIN_FONT_SIZE, value - 2));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, previous, toggleFullscreen]);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  /*
   * The tempo of a song is often not written down. Tapping it in keeps the
   * count-in and the scrolling in time with the song.
   */
  const handleTapTempo = useCallback(() => {
    const now = Date.now();
    const lastTap = lastTapTimeRef.current;

    if (lastTap === 0 || now - lastTap > 2000) {
      tapTimesRef.current = [now];
    } else {
      tapTimesRef.current.push(now);

      if (tapTimesRef.current.length > 4) {
        tapTimesRef.current.shift();
      }

      if (tapTimesRef.current.length >= 2) {
        let totalInterval = 0;
        for (let i = 1; i < tapTimesRef.current.length; i++) {
          totalInterval += tapTimesRef.current[i] - tapTimesRef.current[i - 1];
        }
        const average = totalInterval / (tapTimesRef.current.length - 1);
        setTappedBpm(Math.round(60000 / average));
      }
    }

    lastTapTimeRef.current = now;
  }, []);

  /*
   * The screen must not go to sleep while the set is running.
   *
   * The lock is released when the page is hidden, so it has to be asked for
   * again when the page comes back.
   */
  useEffect(() => {
    let sentinel: WakeLockSentinel | null = null;
    let stopped = false;

    const request = async () => {
      if (stopped || sentinel) return;
      if (!('wakeLock' in navigator)) return;
      try {
        sentinel = await navigator.wakeLock.request('screen');
      } catch {
        // The browser may refuse. The screen may simply go to sleep.
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') void request();
    };

    void request();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopped = true;
      document.removeEventListener('visibilitychange', handleVisibility);
      void sentinel?.release();
    };
  }, []);

  const jumpToSection = useCallback((lineIndex: number) => {
    const element = lineRefs.current[lineIndex];
    // Not every browser has a smooth scroll, and not every element can be
    // scrolled to.
    element?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  }, []);

  /*
   * Work out which section is being looked at, so that the section buttons
   * show where you are in the song.
   */
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || sections.length === 0) return;

    const containerTop = container.getBoundingClientRect().top;
    let current = 0;

    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex += 1) {
      const element = lineRefs.current[sections[sectionIndex].lineIndex];
      if (!element) continue;
      if (element.getBoundingClientRect().top - containerTop <= 80) current = sectionIndex;
    }

    setActiveSection((previous) => (previous === current ? previous : current));
  }, [sections, containerRef]);

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
        <Typography>
          {entry?.title
            ? `"${entry.title}" is not in your library any more.`
            : 'This song is no longer in your library.'}
        </Typography>
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
          <Typography variant="subtitle1" noWrap sx={{ flexGrow: 1, minWidth: 0 }}>
            {setlist.name}
          </Typography>

          <Chip label={`${index + 1} of ${entries.length}`} size="small" />

          {!isCompact && (
            <Tooltip title={isFullscreen ? 'Leave full screen' : 'Full screen'}>
              <span>
                <IconButton
                  onClick={toggleFullscreen}
                  color={isFullscreen ? 'primary' : 'default'}
                  aria-label={isFullscreen ? 'Leave full screen' : 'Full screen'}
                >
                  {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
              </span>
            </Tooltip>
          )}

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

        {/* What is coming next */}
        {nextSong && (
          <Tooltip title="The next song">
            <Chip
              label={`Next: ${nextSong.title}`}
              size="small"
              variant="outlined"
              sx={{ maxWidth: 220, '& .MuiChip-label': { overflow: 'hidden' } }}
            />
          </Tooltip>
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

        {/* The tempo, for the songs that do not say what it is */}
        <Tooltip title="Tap to set the tempo">
          <IconButton onClick={handleTapTempo} aria-label="Tap tempo">
            <MusicNoteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Typography
          variant="caption"
          sx={{ minWidth: 34, textAlign: 'center', fontWeight: 'bold' }}
          aria-label={`Tempo ${bpm} beats per minute`}
        >
          {bpm}
        </Typography>

        {/* How big the words are */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <IconButton
            onClick={() => setFontSize((value) => Math.max(MIN_FONT_SIZE, value - 2))}
            aria-label="Decrease text size"
          >
            <TextDecreaseIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="caption"
            sx={{ minWidth: 26, textAlign: 'center', color: 'text.secondary' }}
            aria-label={`Text size ${fontSize} pixels`}
          >
            {fontSize}
          </Typography>
          <IconButton
            onClick={() => setFontSize((value) => Math.min(MAX_FONT_SIZE, value + 2))}
            aria-label="Increase text size"
          >
            <TextIncreaseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* How the words are written */}
        <ToggleButtonGroup
          value={displayMode}
          exclusive
          onChange={(_, newMode) => newMode && setDisplayMode(newMode)}
          size="small"
          sx={{ flexShrink: 0 }}
          aria-label="Display mode"
        >
          <ToggleButton value="chords">Chords</ToggleButton>
          <ToggleButton value="nashville">Nashville</ToggleButton>
          <ToggleButton value="tabs">Tabs</ToggleButton>
          <ToggleButton value="notation">Notes</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* The sections, so that one can be jumped to */}
      {sections.length > 0 && (
        <SectionNav
          sections={sections}
          activeSection={activeSection}
          onJumpToSection={(sectionIndex) => jumpToSection(sections[sectionIndex].lineIndex)}
        />
      )}

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
        onScroll={handleScroll}
        aria-label="The song"
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: { xs: 2, md: 4 },
          fontSize: `${fontSize}px`,
        }}
      >
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          <SongNote note={song.notes} variant="stage" />
          <SongBody
            lines={prepared.lines}
            displayMode={displayMode}
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
