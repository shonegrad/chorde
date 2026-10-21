import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import type { Song, SongSection, DisplayMode } from '../types';
import { parseChordPro } from '../lib/chordPro';
import { exportToChordPro } from '../lib/export';
import { transposeChord, transposeKey, keyPrefersFlats } from '../lib/music';
import { detectKey } from '../lib/keyDetection';
import { useAppSettings } from '../lib/settings';
import { useAutoScroll } from '../lib/useAutoScroll';
import { beatsPerBar, buildProgression, type ProgressionChord } from '../lib/progression';
import {
  playClick,
  playSequence,
  resumeAudioContext,
  stopAllSounds,
  type SequenceHandle,
} from '../lib/audio';
import {
  loadSongPreferences,
  loadViewerPreferences,
  saveSongPreferences,
  saveViewerPreferences,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
} from '../lib/preferences';
import { SongBody } from './SongBody';
import { SongNote } from './SongNote';
import { songLink } from '../lib/shareLink';
import { PrintDialog } from './PrintDialog';
import { TagEditor } from './TagEditor';
import { ChordModal } from './ChordModal';
import { SectionNav } from './SectionNav';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import {
  Alert,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Divider,
  ListItemIcon,
  Menu,
  Slider,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
  Stack,
  Chip,
  Paper,
  Container,
  TextField,
  Tooltip,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  Link,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import LoopIcon from '@mui/icons-material/Loop';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import DownloadIcon from '@mui/icons-material/Download';
import LinkIcon from '@mui/icons-material/Link';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface SongViewerProps {
  song: Song;
  onClose: () => void;
  onEdit: () => void;
  onTagClick?: (tag: string) => void;
  onArtistClick?: (artist: string) => void;
  /** Persists a change made from the viewer, e.g. favouriting or tagging. */
  onUpdateSong?: (song: Song) => void | Promise<void>;
  /** Setlists the song can be added to. */
  setlists?: { id: string; name: string }[];
  onAddToSetlist?: (songId: string, setlistId: string) => void;
}

export const SongViewer: React.FC<SongViewerProps> = ({
  song,
  onClose,
  onEdit,
  onTagClick,
  onArtistClick,
  onUpdateSong,
  setlists = [],
  onAddToSetlist,
}) => {
  const [settings] = useAppSettings();
  const stageMode = settings.stageMode;
  const theme = useTheme();
  // On a phone there is not room for every control, so the ones that are not
  // needed all the time go into a menu.
  const isCompact = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });

  const initialPrefs = useMemo(() => loadViewerPreferences(), []);
  const initialSongPrefs = useMemo(() => loadSongPreferences(song.id), [song.id]);

  const [transpose, setTranspose] = useState(initialSongPrefs.transpose ?? 0);
  const [fontSize, setFontSize] = useState(initialPrefs.fontSize);
  // A capo of zero is a real choice — "no capo" — so a stored zero must not
  // fall through to the capo the song was written with.
  const [capo, setCapo] = useState(initialSongPrefs.capo ?? song.capo ?? 0);
  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const [manualScrollSpeed, setManualScrollSpeed] = useState<number | null>(null);
  const [loopMode, setLoopMode] = useState(false);
  const [loopSection, setLoopSection] = useState<number | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>(initialPrefs.displayMode);
  const [countIn, setCountIn] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [setlistOpen, setSetlistOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [shareError, setShareError] = useState<string | undefined>(undefined);
  const [playingProgression, setPlayingProgression] = useState<ProgressionChord[] | null>(null);
  const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null);
  const [currentChord, setCurrentChord] = useState<string | null>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sequenceRef = useRef<SequenceHandle | null>(null);

  // Tempo controls
  const [bpm, setBpm] = useState<number | null>(song.bpm ?? null);
  const [lockTempo, setLockTempo] = useState(stageMode.lockTempo);

  // The times the tempo was tapped at.
  const lastTapTimeRef = useRef<number>(0);
  const tapTimesRef = useRef<number[]>([]);

  // Remember the view preferences and the per-song transposition.
  useEffect(() => {
    saveViewerPreferences({ fontSize, displayMode });
  }, [fontSize, displayMode]);

  useEffect(() => {
    saveSongPreferences(song.id, { transpose, capo });
  }, [song.id, transpose, capo]);

  /*
   * The song has been opened, so it has been played.
   *
   * The library keeps a record of what was played and when, so that it can
   * say what was played lately. The song is only recorded once, however many
   * times it is saved while it is open.
   */
  const lastRecorded = useRef<string | null>(null);
  useEffect(() => {
    if (!onUpdateSong) return;
    if (lastRecorded.current === song.id) return;
    lastRecorded.current = song.id;

    void onUpdateSong({
      ...song,
      lastOpenedAt: new Date().toISOString(),
      playCount: (song.playCount ?? 0) + 1,
    });
  }, [onUpdateSong, song]);

  // The key the chords are written in, and the key they sound in.
  const writtenKey = song.key;
  const transposedKey = useMemo(
    () => (writtenKey ? transposeKey(writtenKey, transpose) : undefined),
    [writtenKey, transpose]
  );
  // A capo transposes the sounding pitch without changing the written chords.
  const soundingKey = useMemo(() => {
    if (!transposedKey) return undefined;
    return capo > 0 ? transposeKey(transposedKey, capo) : transposedKey;
  }, [transposedKey, capo]);

  const preferFlats = useMemo(
    () => keyPrefersFlats(transposedKey ?? writtenKey),
    [transposedKey, writtenKey]
  );

  const parsedContent = useMemo(() => {
    const parsed = parseChordPro(song.content);
    if (transpose === 0) return parsed;

    return parsed.map((line) => ({
      ...line,
      items: line.items.map((item) => ({
        ...item,
        chord: item.chord ? transposeChord(item.chord, transpose, { preferFlats }) : undefined,
      })),
    }));
  }, [song.content, transpose, preferFlats]);

  /*
   * A song that does not say what key it is in can still be worked out from
   * the chords it uses.
   */
  const detectedKey = useMemo(() => {
    if (song.key) return undefined;
    const chords = parsedContent.flatMap((line) =>
      line.items.map((item) => item.chord).filter((chord): chord is string => Boolean(chord))
    );
    if (chords.length < 2) return undefined;
    return detectKey(chords) ?? undefined;
  }, [song.key, parsedContent]);

  const sections = useMemo(() => {
    const extracted: SongSection[] = [];
    parsedContent.forEach((line, idx) => {
      if (line.section) {
        extracted.push({ ...line.section, lineIndex: idx });
      }
    });
    return extracted;
  }, [parsedContent]);

  /*
   * The chords of the song, and the notes each one plays.
   *
   * The capo moves the sound up the neck, so it is taken into account here:
   * the shapes are the same, but they ring a semitone or two higher.
   */
  const progression = useMemo(
    () => buildProgression(parsedContent, { capo }),
    [parsedContent, capo]
  );

  /*
   * The chords are only playing if they are the ones that were started.
   *
   * When the song is transposed the chords change, so the ones being played
   * are no longer the ones on the screen.
   */
  const playingChords = playingProgression !== null && playingProgression === progression;

  // BPM-based scroll speed calculation
  const computedScrollSpeed = useMemo(() => {
    const beatsPerLine = stageMode.beatsPerLine;
    const pixelPerBeat = 40;
    const calculatedBpm = bpm ?? stageMode.defaultBpm;
    return (calculatedBpm / 60) * beatsPerLine * pixelPerBeat;
  }, [bpm, stageMode.beatsPerLine, stageMode.defaultBpm]);

  // Auto-scroll with looping support.
  const contentContainerRef = useAutoScroll({
    enabled: autoScroll,
    speed: manualScrollSpeed ?? computedScrollSpeed,
    linesRef: lineRefs,
    sectionStarts: sections.map((section) => section.lineIndex),
    loopSection: loopMode ? loopSection : null,
    totalLines: parsedContent.length,
  });

  const jumpToSection = useCallback(
    (lineIndex: number) => {
      const lineElement = lineRefs.current[lineIndex];
      if (lineElement && contentContainerRef.current) {
        lineElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [contentContainerRef]
  );

  /*
   * Work out which section is being looked at, so the section buttons can show
   * where you are in the song.
   */
  const handleScroll = useCallback(() => {
    const container = contentContainerRef.current;
    if (!container || sections.length === 0) return;

    const containerTop = container.getBoundingClientRect().top;
    let current = 0;

    for (let index = 0; index < sections.length; index += 1) {
      const element = lineRefs.current[sections[index].lineIndex];
      if (!element) continue;
      if (element.getBoundingClientRect().top - containerTop <= 80) current = index;
    }

    setActiveSection((previous) => (previous === current ? previous : current));
  }, [sections, contentContainerRef]);

  // Play click sound for count-in
  const playClickSound = useCallback(
    (accent = false) => {
      if (!stageMode.clickSoundEnabled) return;
      playClick(accent);
    },
    [stageMode.clickSoundEnabled]
  );

  /*
   * Count-in before the auto-scroll starts.
   *
   * The click lands on the beat, so the count is measured in the tempo of the
   * song rather than in seconds.
   */
  useEffect(() => {
    if (countIn <= 0 || !autoScroll) return;

    const beat = 60000 / (bpm ?? stageMode.defaultBpm);
    const timer = setTimeout(() => {
      playClickSound(countIn === stageMode.countInBeats);
      setCountIn((prev) => Math.max(0, prev - 1));
    }, beat);

    return () => clearTimeout(timer);
  }, [countIn, autoScroll, bpm, stageMode.defaultBpm, stageMode.countInBeats, playClickSound]);

  // Handle tap tempo
  const handleTapTempo = () => {
    if (lockTempo) return;

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
        const avgInterval = totalInterval / (tapTimesRef.current.length - 1);
        const calculatedBpm = Math.round(60000 / avgInterval);

        setBpm(calculatedBpm);
      }
    }

    lastTapTimeRef.current = now;
  };

  const toggleAutoScroll = useCallback(() => {
    setAutoScroll((prev) => {
      const next = !prev;
      // Start the count-in when the scroll is switched on.
      if (next && stageMode.countInBeats > 0) {
        setCountIn(stageMode.countInBeats);
      }
      return next;
    });
  }, [stageMode.countInBeats]);

  const toggleLoopMode = () => {
    const newLoopMode = !loopMode;
    setLoopMode(newLoopMode);

    if (newLoopMode && sections.length > 0 && loopSection === null) {
      setLoopSection(0);
    }

    if (!newLoopMode) {
      setLoopSection(null);
    }
  };

  /*
   * Play the chords of the song.
   *
   * Each chord is held for a bar, at the tempo of the song, so the
   * progression sounds the way it would be played.
   */
  const toggleChordPlayback = useCallback(async () => {
    if (playingChords) {
      sequenceRef.current?.stop();
      sequenceRef.current = null;
      setPlayingProgression(null);
      setCurrentChord(null);
      return;
    }

    if (progression.length === 0) return;

    await resumeAudioContext();

    const beat = 60 / (bpm ?? stageMode.defaultBpm);
    const duration = beat * beatsPerBar(song.timeSignature);

    const handle = playSequence(
      progression.map((chord) => ({ notes: chord.notes, duration })),
      {
        onStep: (index) => setCurrentChord(progression[index]?.name ?? null),
        onEnd: () => {
          setPlayingProgression(null);
          setCurrentChord(null);
        },
      }
    );

    sequenceRef.current = handle;
    setPlayingProgression(progression);
  }, [playingChords, progression, bpm, stageMode.defaultBpm, song.timeSignature]);

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

  const handleSectionClick = (sectionIndex: number) => {
    if (loopMode) {
      setLoopSection(sectionIndex);
    }
    jumpToSection(sections[sectionIndex].lineIndex);
  };

  // Fullscreen (performance mode)
  const toggleFullscreen = async () => {
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
  };

  useEffect(() => {
    const handleChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const resetTranspose = () => {
    setTranspose(0);
    setCapo(0);
  };

  const handleToggleFavorite = () => {
    onUpdateSong?.({ ...song, favorite: !song.favorite, updatedAt: new Date().toISOString() });
  };

  const handleToggleKnown = () => {
    onUpdateSong?.({ ...song, known: !song.known, updatedAt: new Date().toISOString() });
  };

  /*
   * A link that carries the song.
   *
   * There is no server to hold the song, so the link holds it. The words of
   * the song go into the link, squeezed down so that the link is not too long.
   */
  const handleShareLink = async () => {
    setShareError(undefined);
    try {
      const built = await songLink(song);
      setShareLink(built);
      // The link is copied as well, so that it is ready to be sent.
      await navigator.clipboard.writeText(built).catch(() => undefined);
    } catch {
      setShareError('The link could not be made.');
    }
    setShareOpen(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    } catch {
      setLinkCopied(false);
    }
  };

  const handleDurationChange = () => {
    const value = durationDraft.trim();
    onUpdateSong?.({
      ...song,
      duration: value || undefined,
      updatedAt: new Date().toISOString(),
    });
  };

  /*
   * The tempo of a song is often not written down, and tapping it in is how
   * you find out. It is kept with the song, so that it is there next time.
   */
  const handleTempoChange = () => {
    onUpdateSong?.({
      ...song,
      bpm: bpm ?? undefined,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleTagsChange = (tags: string[]) => {
    onUpdateSong?.({ ...song, tags, updatedAt: new Date().toISOString() });
  };

  const handleNoteChange = () => {
    const value = noteDraft.trim();
    onUpdateSong?.({
      ...song,
      notes: value || undefined,
      updatedAt: new Date().toISOString(),
    });
  };

  const [showShortcuts, setShowShortcuts] = useState(false);
  const [durationDraft, setDurationDraft] = useState(song.duration ?? '');
  const [noteDraft, setNoteDraft] = useState(song.notes ?? '');

  // Keyboard shortcuts, so a song can be played without touching the screen.
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

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          setTranspose((value) => value - 1);
          break;
        case 'ArrowRight':
          event.preventDefault();
          setTranspose((value) => value + 1);
          break;
        case '+':
        case '=':
          event.preventDefault();
          setFontSize((value) => Math.min(MAX_FONT_SIZE, value + 2));
          break;
        case '-':
        case '_':
          event.preventDefault();
          setFontSize((value) => Math.max(MIN_FONT_SIZE, value - 2));
          break;
        case ' ':
          event.preventDefault();
          toggleAutoScroll();
          break;
        case 'Escape':
          if (showShortcuts) {
            setShowShortcuts(false);
          } else {
            onClose();
          }
          break;
        case '?':
          event.preventDefault();
          setShowShortcuts((open) => !open);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, showShortcuts, toggleAutoScroll]);

  const keyLabel = transposedKey ?? writtenKey;

  /*
   * The controls, each one on its own.
   *
   * They are put together differently depending on the screen: in two rows
   * on a big one, and in a menu on a phone. Each control is made once, so
   * there is only ever one of it on the page.
   */
  const backButton = (
    <IconButton edge="start" onClick={onClose} aria-label="Back to library">
      <ArrowBackIcon />
    </IconButton>
  );

  const scrollButton = (
    <>
      <Tooltip title={autoScroll ? 'Stop Auto-Scroll' : 'Start Auto-Scroll'}>
        <IconButton
          onClick={toggleAutoScroll}
          color={autoScroll ? 'primary' : 'default'}
          aria-label={autoScroll ? 'Stop auto-scroll' : 'Start auto-scroll'}
        >
          {autoScroll ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
      </Tooltip>
      {countIn > 0 && (
        <Typography variant="caption" color="primary" fontWeight="bold" aria-live="polite">
          {countIn}
        </Typography>
      )}
    </>
  );

  const scrollSpeed = autoScroll ? (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 120, mx: 1 }}>
        <Slider
          size="small"
          value={manualScrollSpeed ?? computedScrollSpeed}
          min={15}
          max={80}
          onChange={(_, val) => {
            setManualScrollSpeed(val as number);
          }}
          aria-label="Scroll speed"
        />
      </Box>
      <Typography
        variant="caption"
        sx={{
          minWidth: 45,
          color: 'text.secondary',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
        }}
      >
        {manualScrollSpeed ?? computedScrollSpeed} px/s
      </Typography>
    </Box>
  ) : null;

  const tapTempoButton = (
    <Tooltip title="Tap to set tempo">
      <IconButton
        onClick={handleTapTempo}
        color="default"
        disabled={lockTempo}
        aria-label="Tap tempo"
      >
        <MusicNoteIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  const tempoValue = (
    <Typography
      variant="body2"
      sx={{ minWidth: 40, textAlign: 'center', fontWeight: 'bold' }}
      aria-label={`Tempo ${bpm ?? 'not set'} beats per minute`}
    >
      {bpm !== null ? bpm : '--'}
    </Typography>
  );

  const tempoDown = (
    <IconButton
      onClick={() => setBpm((prev) => (prev !== null ? prev - 1 : null))}
      disabled={lockTempo || (bpm !== null && bpm <= 40)}
      color="default"
      aria-label="Decrease tempo"
    >
      <RemoveIcon fontSize="small" />
    </IconButton>
  );

  const tempoUp = (
    <IconButton
      onClick={() => setBpm((prev) => (prev !== null ? prev + 1 : null))}
      disabled={lockTempo || (bpm !== null && bpm >= 208)}
      color="default"
      aria-label="Increase tempo"
    >
      <AddIcon fontSize="small" />
    </IconButton>
  );

  const lockSwitch = (
    <FormControlLabel
      control={
        <Switch
          checked={lockTempo}
          onChange={(e) => setLockTempo(e.target.checked)}
          inputProps={{ 'aria-label': 'Lock tempo' }}
        />
      }
      label="Lock"
      sx={{ ml: 1 }}
    />
  );

  const transposeControl = (
    <Paper variant="outlined" sx={{ p: 0.5, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      <IconButton
        onClick={() => setTranspose((t) => t - 1)}
        aria-label="Transpose down one semitone"
      >
        <RemoveIcon fontSize="small" />
      </IconButton>
      <Typography
        variant="body2"
        sx={{ mx: 1, minWidth: 20, textAlign: 'center' }}
        aria-label={`Transpose offset ${transpose} semitones`}
      >
        {transpose > 0 ? `+${transpose}` : transpose < 0 ? transpose : '0'}
      </Typography>
      <IconButton onClick={() => setTranspose((t) => t + 1)} aria-label="Transpose up one semitone">
        <AddIcon fontSize="small" />
      </IconButton>
      {transpose !== 0 && (
        <Tooltip title="Reset transposition and capo">
          <IconButton onClick={resetTranspose} size="small" aria-label="Reset transposition">
            <Typography variant="caption">Reset</Typography>
          </IconButton>
        </Tooltip>
      )}
    </Paper>
  );

  const capoControl = (
    <FormControl size="small" variant="outlined" sx={{ minWidth: 90, flexShrink: 0 }}>
      <InputLabel>Capo</InputLabel>
      <Select
        value={capo}
        onChange={(e) => setCapo(Number(e.target.value))}
        label="Capo"
        inputProps={{ 'aria-label': 'Capo position' }}
      >
        <MenuItem value={0}>None</MenuItem>
        {Array.from({ length: 12 }, (_, i) => (
          <MenuItem key={i + 1} value={i + 1}>
            {i + 1}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const displayModes = (
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
  );

  const fontSizeControl = (
    <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      <IconButton
        onClick={() => setFontSize((s) => Math.max(MIN_FONT_SIZE, s - 2))}
        aria-label="Decrease text size"
      >
        <TextDecreaseIcon />
      </IconButton>
      <Typography
        variant="caption"
        sx={{ minWidth: 26, textAlign: 'center', color: 'text.secondary' }}
        aria-label={`Text size ${fontSize} pixels`}
      >
        {fontSize}
      </Typography>
      <IconButton
        onClick={() => setFontSize((s) => Math.min(MAX_FONT_SIZE, s + 2))}
        aria-label="Increase text size"
      >
        <TextIncreaseIcon />
      </IconButton>
    </Box>
  );

  const loopLabel = loopMode && loopSection !== null ? sections[loopSection].label : 'Loop';

  const loopControl =
    sections.length > 0 ? (
      <Tooltip title="Loop Section">
        <ToggleButton
          value="check"
          selected={loopMode}
          onChange={toggleLoopMode}
          size="small"
          color="primary"
          sx={{ flexShrink: 0 }}
          aria-label="Loop section"
        >
          <LoopIcon fontSize="small" sx={{ mr: 1 }} />
          {loopLabel}
        </ToggleButton>
      </Tooltip>
    ) : null;

  const chordPlayback = (
    <>
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
      {playingChords && currentChord && (
        <Chip label={currentChord} color="primary" size="small" aria-live="polite" />
      )}
    </>
  );

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/*
        The controls of the song.

        There are a lot of them, so they are in two rows on a big screen:
        what you do while playing, and how the song is set up. Each row
        wraps rather than scrolling sideways, so nothing is ever out of
        reach. A phone has no room for two rows, so there the controls
        that are not needed all the time go into a menu.
      */}
      <AppBar position="static" color="default" elevation={1} sx={{ height: 'auto' }}>
        {isCompact ? (
          <Toolbar variant="dense" sx={{ gap: 1 }}>
            {backButton}
            {scrollButton}
            <Paper
              variant="outlined"
              sx={{ p: 0.5, display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}
            >
              {tapTempoButton}
              {tempoValue}
            </Paper>
            <IconButton
              onClick={(event) => setMoreAnchor(event.currentTarget)}
              aria-label="More controls"
              sx={{ ml: 'auto' }}
            >
              <MoreVertIcon />
            </IconButton>
          </Toolbar>
        ) : (
          <>
            <Toolbar variant="dense" sx={{ flexWrap: 'wrap', rowGap: 0.5, columnGap: 1 }}>
              {backButton}

              {/* Scroll Controls */}
              <Paper
                variant="outlined"
                sx={{ p: 0.5, display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}
              >
                {scrollButton}
                {scrollSpeed}
              </Paper>

              {/* Tempo Controls */}
              <Paper
                variant="outlined"
                sx={{ p: 0.5, display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}
              >
                {tapTempoButton}
                {tempoValue}
                {tempoDown}
                {tempoUp}
                {lockSwitch}
              </Paper>

              {loopControl}

              {chordPlayback}

              {/*
                What you can do with the file, and the song itself. They are
                one group, so they move together when the row wraps.
              */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  ml: 'auto',
                  flexShrink: 0,
                }}
              >
                <Tooltip title="Performance mode (fullscreen)">
                  <IconButton
                    onClick={toggleFullscreen}
                    color={isFullscreen ? 'primary' : 'default'}
                    aria-label="Toggle performance mode"
                  >
                    <FullscreenIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Keyboard shortcuts">
                  <IconButton
                    onClick={() => setShowShortcuts(true)}
                    aria-label="Show keyboard shortcuts"
                  >
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Download ChordPro file">
                  <IconButton
                    onClick={() => exportToChordPro(song, { transpose, capo, preferFlats })}
                    aria-label="Download ChordPro file"
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Send this song to somebody else">
                  <IconButton onClick={handleShareLink} aria-label="Copy a link to this song">
                    <LinkIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Print / save as PDF">
                  <IconButton onClick={() => setPrintOpen(true)} aria-label="Print or save as PDF">
                    <PictureAsPdfIcon />
                  </IconButton>
                </Tooltip>

                <Button variant="contained" startIcon={<EditIcon />} onClick={onEdit} size="small">
                  Edit
                </Button>
              </Box>
            </Toolbar>

            <Toolbar
              variant="dense"
              sx={{
                flexWrap: 'wrap',
                rowGap: 0.5,
                columnGap: 1,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              {/* Key Transpose */}
              {transposeControl}

              {/* Capo Control */}
              {capoControl}

              {/* Display Mode */}
              {displayModes}

              {/* Font Size */}
              {fontSizeControl}
            </Toolbar>
          </>
        )}

        {/* The controls that do not fit on a phone. */}
        <Menu
          anchorEl={moreAnchor}
          open={Boolean(moreAnchor)}
          onClose={() => setMoreAnchor(null)}
          slotProps={{ paper: { sx: { minWidth: 280 } } }}
        >
          {autoScroll && (
            <MenuItem onClick={(event) => event.stopPropagation()} sx={{ display: 'block' }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Scroll speed
              </Typography>
              {scrollSpeed}
            </MenuItem>
          )}

          <MenuItem onClick={(event) => event.stopPropagation()} sx={{ gap: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 76 }}>
              Transpose
            </Typography>
            {transposeControl}
          </MenuItem>

          <MenuItem onClick={(event) => event.stopPropagation()} sx={{ gap: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 76 }}>
              Capo
            </Typography>
            {capoControl}
          </MenuItem>

          <MenuItem onClick={(event) => event.stopPropagation()} sx={{ gap: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 76 }}>
              Show
            </Typography>
            {displayModes}
          </MenuItem>

          <MenuItem onClick={(event) => event.stopPropagation()} sx={{ gap: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 76 }}>
              Text size
            </Typography>
            {fontSizeControl}
          </MenuItem>

          <MenuItem onClick={(event) => event.stopPropagation()} sx={{ gap: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 76 }}>
              Tempo
            </Typography>
            {tempoDown}
            {tempoUp}
            {lockSwitch}
          </MenuItem>

          <Divider />

          {loopControl && (
            <MenuItem
              onClick={() => {
                toggleLoopMode();
                setMoreAnchor(null);
              }}
              aria-label="Loop section"
              sx={{ ml: 1 }}
            >
              {loopLabel}
            </MenuItem>
          )}

          <MenuItem
            onClick={() => {
              void toggleChordPlayback();
              setMoreAnchor(null);
            }}
            aria-label={playingChords ? 'Stop playing the chords' : 'Play the chords'}
          >
            <ListItemIcon>
              <GraphicEqIcon fontSize="small" />
            </ListItemIcon>
            {playingChords ? 'Stop the chords' : 'Play the chords'}
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={() => {
              void toggleFullscreen();
              setMoreAnchor(null);
            }}
            aria-label="Toggle performance mode"
          >
            <ListItemIcon>
              <FullscreenIcon fontSize="small" />
            </ListItemIcon>
            Performance mode
          </MenuItem>

          <MenuItem
            onClick={() => {
              setShowShortcuts(true);
              setMoreAnchor(null);
            }}
            aria-label="Show keyboard shortcuts"
          >
            <ListItemIcon>
              <HelpOutlineIcon fontSize="small" />
            </ListItemIcon>
            Keyboard shortcuts
          </MenuItem>

          <MenuItem
            onClick={() => {
              exportToChordPro(song, { transpose, capo, preferFlats });
              setMoreAnchor(null);
            }}
            aria-label="Download ChordPro file"
          >
            <ListItemIcon>
              <DownloadIcon fontSize="small" />
            </ListItemIcon>
            Download ChordPro file
          </MenuItem>

          <MenuItem
            onClick={() => {
              void handleShareLink();
              setMoreAnchor(null);
            }}
            aria-label="Copy a link to this song"
          >
            <ListItemIcon>
              <LinkIcon fontSize="small" />
            </ListItemIcon>
            Copy a link to this song
          </MenuItem>

          <MenuItem
            onClick={() => {
              setPrintOpen(true);
              setMoreAnchor(null);
            }}
            aria-label="Print or save as PDF"
          >
            <ListItemIcon>
              <PictureAsPdfIcon fontSize="small" />
            </ListItemIcon>
            Print or save as PDF
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEdit();
              setMoreAnchor(null);
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit song
          </MenuItem>
        </Menu>
      </AppBar>

      {/* Section Navigation */}
      {sections.length > 0 && (
        <Box
          sx={{
            px: 2,
            py: 1,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <SectionNav
            sections={sections}
            onJumpToSection={handleSectionClick}
            activeSection={activeSection}
          />
        </Box>
      )}

      {/* Song Content */}
      <Box
        ref={contentContainerRef}
        onScroll={handleScroll}
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: { xs: 2, md: 4 },
          scrollBehavior: autoScroll ? 'auto' : 'smooth',
          fontSize: `${fontSize}px`,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {song.title}
              </Typography>
              {onUpdateSong && (
                <Tooltip
                  title={song.favorite ? 'Remove from favourites' : 'Add to favourites'}
                  sx={{ mb: 3 }}
                >
                  <IconButton
                    onClick={handleToggleFavorite}
                    aria-label={song.favorite ? 'Remove from favourites' : 'Add to favourites'}
                    aria-pressed={Boolean(song.favorite)}
                  >
                    {song.favorite ? <StarIcon color="primary" /> : <StarBorderIcon />}
                  </IconButton>
                </Tooltip>
              )}
              {onUpdateSong && (
                <Tooltip
                  title={song.known ? 'You know this song' : 'Mark as a song you know'}
                  sx={{ mb: 3 }}
                >
                  <IconButton
                    onClick={handleToggleKnown}
                    aria-label={
                      song.known ? 'Mark as a song you do not know yet' : 'Mark as a song you know'
                    }
                    aria-pressed={Boolean(song.known)}
                  >
                    {song.known ? <CheckCircleIcon color="success" /> : <CheckCircleOutlineIcon />}
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
            {onArtistClick ? (
              <Button
                variant="text"
                color="inherit"
                onClick={() => onArtistClick(song.artist)}
                sx={{ fontSize: '1.5rem', fontWeight: 400, color: 'text.secondary' }}
              >
                {song.artist}
              </Button>
            ) : (
              <Typography variant="h5" color="text.secondary" gutterBottom>
                {song.artist}
              </Typography>
            )}
            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              sx={{ mt: 2, flexWrap: 'wrap', rowGap: 1 }}
            >
              {song.tags?.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  variant="outlined"
                  size="small"
                  onClick={onTagClick ? () => onTagClick(tag) : undefined}
                  sx={{ cursor: onTagClick ? 'pointer' : 'default' }}
                />
              ))}
              {onUpdateSong && (
                <Chip
                  label="Details"
                  size="small"
                  variant="outlined"
                  onClick={() => setDetailsOpen(true)}
                  sx={{ cursor: 'pointer' }}
                />
              )}
              {onAddToSetlist && (
                <Chip
                  label="Add to setlist"
                  size="small"
                  variant="outlined"
                  onClick={() => setSetlistOpen(true)}
                  sx={{ cursor: 'pointer' }}
                />
              )}
            </Stack>

            {/* Key, transposition and capo summary */}
            {(keyLabel || capo > 0 || detectedKey) && (
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                sx={{ mt: 2, flexWrap: 'wrap', rowGap: 1 }}
              >
                {keyLabel && (
                  <Chip
                    label={
                      transpose !== 0 && writtenKey
                        ? `Key ${keyLabel} (from ${writtenKey})`
                        : `Key ${keyLabel}`
                    }
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  />
                )}
                {!song.key && detectedKey && (
                  <>
                    <Chip
                      label={`Key ${detectedKey.key} (detected)`}
                      variant="outlined"
                      sx={{ fontWeight: 'bold' }}
                    />
                    {onUpdateSong && (
                      <Button
                        size="small"
                        onClick={() =>
                          onUpdateSong({
                            ...song,
                            key: detectedKey.key,
                            updatedAt: new Date().toISOString(),
                          })
                        }
                      >
                        Use this key
                      </Button>
                    )}
                  </>
                )}
                {capo > 0 && (
                  <Chip
                    label={`Capo ${capo}${soundingKey ? ` · sounds in ${soundingKey}` : ''}`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  />
                )}
              </Stack>
            )}

            {/* Where the song came from and what may be done with it. */}
            {(song.attribution?.sourceName || song.attribution?.notes) && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, display: 'block', maxWidth: 480, mx: 'auto' }}
              >
                {song.attribution.sourceName}
                {song.attribution.author ? ` · ${song.attribution.author}` : ''}
                {song.attribution.notes ? ` — ${song.attribution.notes}` : ''}
                {song.attribution.sourceUrl ? (
                  <>
                    {' '}
                    <Link
                      href={song.attribution.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      sx={{ color: 'inherit' }}
                    >
                      Source
                    </Link>
                  </>
                ) : null}
              </Typography>
            )}
          </Box>

          <SongNote note={song.notes} />

          <SongBody
            lines={parsedContent}
            displayMode={displayMode}
            songKey={soundingKey ?? transposedKey ?? writtenKey ?? 'C'}
            onChordClick={(chord) => setSelectedChord(chord)}
            onLineRef={(index, element) => {
              lineRefs.current[index] = element;
            }}
          />

          {/* Spacer for scrolling to bottom */}
          <Box sx={{ height: '30vh' }} />
        </Container>
      </Box>

      {selectedChord && (
        <ChordModal
          chordName={selectedChord}
          songKey={soundingKey ?? transposedKey ?? writtenKey}
          onClose={() => setSelectedChord(null)}
        />
      )}

      {/* The details of the song */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Details for {song.title}</DialogTitle>
        <DialogContent>
          <TagEditor
            tags={song.tags ?? []}
            onChange={(tags) => {
              handleTagsChange(tags);
              setDetailsOpen(false);
            }}
            helperText="Tags are shared with the rest of your library, so you can find the song again."
          />

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Length
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="4:28"
              value={durationDraft}
              onChange={(event) => setDurationDraft(event.target.value)}
              inputProps={{ 'aria-label': 'The length of the song' }}
              helperText="How long the song takes, as minutes and seconds. A setlist adds the lengths up."
              onKeyDown={(event) => {
                if (event.key !== 'Enter') return;
                handleDurationChange();
              }}
              onBlur={handleDurationChange}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Tempo
            </Typography>
            <TextField
              size="small"
              fullWidth
              type="number"
              placeholder="120"
              value={bpm ?? ''}
              onChange={(event) =>
                setBpm(event.target.value === '' ? null : Number(event.target.value))
              }
              inputProps={{ 'aria-label': 'The tempo of the song' }}
              helperText="The beats a minute. Tapping the tempo in the bar above puts it here, so that it is kept."
              onKeyDown={(event) => {
                if (event.key !== 'Enter') return;
                handleTempoChange();
              }}
              onBlur={handleTempoChange}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Note
            </Typography>
            <TextField
              size="small"
              fullWidth
              multiline
              minRows={2}
              placeholder="Play quietly here"
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              inputProps={{ 'aria-label': 'The note for this song' }}
              helperText="A note for whoever plays this song. It is shown when the song is read and on stage."
              onKeyDown={(event) => {
                if (event.key !== 'Enter' || event.shiftKey) return;
                event.preventDefault();
                handleNoteChange();
              }}
              onBlur={handleNoteChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add to a setlist */}
      <Dialog open={setlistOpen} onClose={() => setSetlistOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add to setlist</DialogTitle>
        <DialogContent>
          {setlists.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              You have no setlists yet. Create one from the navigation menu.
            </Typography>
          ) : (
            <List disablePadding>
              {setlists.map((setlist) => (
                <ListItem key={setlist.id} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      onAddToSetlist?.(song.id, setlist.id);
                      setSetlistOpen(false);
                    }}
                  >
                    {setlist.name}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSetlistOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Printing the song */}
      <PrintDialog
        song={song}
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        transpose={transpose}
        capo={capo}
        preferFlats={preferFlats}
      />

      {/* A link that carries the song */}
      <Dialog open={shareOpen} onClose={() => setShareOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>A link to this song</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            The link carries the song with it, so anybody who opens it can add the song to their own
            library. Nothing is sent anywhere until they do.
          </Typography>
          {shareError ? (
            <Alert severity="warning">{shareError}</Alert>
          ) : (
            <TextField
              fullWidth
              size="small"
              value={shareLink}
              inputProps={{ readOnly: true, 'aria-label': 'The link to this song' }}
              onFocus={(event) => event.target.select()}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareOpen(false)}>Close</Button>
          <Button variant="contained" onClick={handleCopyLink}>
            {linkCopied ? 'Copied' : 'Copy'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Keyboard shortcuts */}
      <Dialog
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        maxWidth="xs"
        fullWidth
        transitionDuration={0}
        aria-label="Keyboard shortcuts"
      >
        <DialogTitle>Keyboard shortcuts</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            {[
              ['Left arrow', 'Transpose down a semitone'],
              ['Right arrow', 'Transpose up a semitone'],
              ['+ / -', 'Make the text bigger or smaller'],
              ['Space', 'Start or stop the auto-scroll'],
              ['?', 'Show this list'],
              ['Escape', 'Go back'],
            ].map(([keys, description]) => (
              <Stack key={keys} direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    minWidth: 100,
                    px: 1,
                    py: 0.25,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    textAlign: 'center',
                  }}
                >
                  {keys}
                </Typography>
                <Typography variant="body2">{description}</Typography>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShortcuts(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
