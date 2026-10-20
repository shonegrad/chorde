import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import type { Song, SongSection, DisplayMode } from '../types';
import { parseChordPro } from '../lib/chordPro';
import { exportToChordPro, exportToPdf } from '../lib/export';
import { transposeChord, transposeKey, keyPrefersFlats } from '../lib/music';
import { useAppSettings } from '../lib/settings';
import { useAutoScroll } from '../lib/useAutoScroll';
import {
  loadSongPreferences,
  loadViewerPreferences,
  saveSongPreferences,
  saveViewerPreferences,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
} from '../lib/preferences';
import { SongBody } from './SongBody';
import { TagEditor } from './TagEditor';
import { ChordModal } from './ChordModal';
import { SectionNav } from './SectionNav';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
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
  Tooltip,
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
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

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

  const initialPrefs = useMemo(() => loadViewerPreferences(), []);
  const initialSongPrefs = useMemo(() => loadSongPreferences(song.id), [song.id]);

  const [transpose, setTranspose] = useState(initialSongPrefs.transpose);
  const [fontSize, setFontSize] = useState(initialPrefs.fontSize);
  const [capo, setCapo] = useState(initialSongPrefs.capo || song.capo || 0);
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
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Tempo controls
  const [bpm, setBpm] = useState<number | null>(song.bpm ?? null);
  const [lockTempo, setLockTempo] = useState(stageMode.lockTempo);

  // Audio context for the count-in click
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const tapTimesRef = useRef<number[]>([]);

  // Remember the view preferences and the per-song transposition.
  useEffect(() => {
    saveViewerPreferences({ fontSize, displayMode });
  }, [fontSize, displayMode]);

  useEffect(() => {
    saveSongPreferences(song.id, { transpose, capo });
  }, [song.id, transpose, capo]);

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

  const sections = useMemo(() => {
    const extracted: SongSection[] = [];
    parsedContent.forEach((line, idx) => {
      if (line.section) {
        extracted.push({ ...line.section, lineIndex: idx });
      }
    });
    return extracted;
  }, [parsedContent]);

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

      if (!audioCtxRef.current) {
        const AudioContextCtor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: new () => AudioContext }).webkitAudioContext;
        if (!AudioContextCtor) return;
        audioCtxRef.current = new AudioContextCtor();
      }

      const ctx = audioCtxRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'square';
      // The first beat is louder and higher, so it is easy to hear where the
      // song starts.
      oscillator.frequency.value = accent ? 1400 : 1000;
      gainNode.gain.value = accent ? 0.16 : 0.09;

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;
      oscillator.start(now);
      oscillator.stop(now + 0.1);
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

  const handleTagsChange = (tags: string[]) => {
    onUpdateSong?.({ ...song, tags, updatedAt: new Date().toISOString() });
  };

  const [showShortcuts, setShowShortcuts] = useState(false);

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

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Header Controls */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={onClose} sx={{ mr: 2 }} aria-label="Back to library">
            <ArrowBackIcon />
          </IconButton>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ flexGrow: 1, overflowX: 'auto', pb: 0.5 }}
          >
            {/* Tempo Controls */}
            <Paper
              variant="outlined"
              sx={{ p: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}
            >
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
              <Typography
                variant="body2"
                sx={{ minWidth: 40, textAlign: 'center', fontWeight: 'bold' }}
                aria-label={`Tempo ${bpm ?? 'not set'} beats per minute`}
              >
                {bpm !== null ? bpm : '--'}
              </Typography>
              <IconButton
                onClick={() => setBpm((prev) => (prev !== null ? prev - 1 : null))}
                disabled={lockTempo || (bpm !== null && bpm <= 40)}
                color="default"
                aria-label="Decrease tempo"
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => setBpm((prev) => (prev !== null ? prev + 1 : null))}
                disabled={lockTempo || (bpm !== null && bpm >= 208)}
                color="default"
                aria-label="Increase tempo"
              >
                <AddIcon fontSize="small" />
              </IconButton>
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
            </Paper>

            {/* Scroll Controls */}
            <Paper
              variant="outlined"
              sx={{ p: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}
            >
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
              {autoScroll && (
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
              )}
            </Paper>

            {/* Loop Control */}
            {sections.length > 0 && (
              <Tooltip title="Loop Section">
                <ToggleButton
                  value="check"
                  selected={loopMode}
                  onChange={toggleLoopMode}
                  size="small"
                  color="primary"
                  aria-label="Loop section"
                >
                  <LoopIcon fontSize="small" sx={{ mr: 1 }} />
                  {loopMode && loopSection !== null ? sections[loopSection].label : 'Loop'}
                </ToggleButton>
              </Tooltip>
            )}

            {/* Capo Control */}
            <FormControl size="small" variant="outlined" sx={{ minWidth: 90 }}>
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

            {/* Key Transpose */}
            <Paper variant="outlined" sx={{ p: 0.5, display: 'flex', alignItems: 'center' }}>
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
              <IconButton
                onClick={() => setTranspose((t) => t + 1)}
                aria-label="Transpose up one semitone"
              >
                <AddIcon fontSize="small" />
              </IconButton>
              {transpose !== 0 && (
                <Tooltip title="Reset transposition and capo">
                  <IconButton
                    onClick={resetTranspose}
                    size="small"
                    aria-label="Reset transposition"
                  >
                    <Typography variant="caption">Reset</Typography>
                  </IconButton>
                </Tooltip>
              )}
            </Paper>

            {/* Display Mode */}
            <ToggleButtonGroup
              value={displayMode}
              exclusive
              onChange={(_, newMode) => newMode && setDisplayMode(newMode)}
              size="small"
              aria-label="Display mode"
            >
              <ToggleButton value="chords">Chords</ToggleButton>
              <ToggleButton value="nashville">Nashville</ToggleButton>
              <ToggleButton value="tabs">Tabs</ToggleButton>
              <ToggleButton value="notation">Notes</ToggleButton>
            </ToggleButtonGroup>

            {/* Font Size */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
            <Tooltip title="Print / save as PDF">
              <IconButton
                onClick={() => exportToPdf(song, { transpose, capo, preferFlats })}
                aria-label="Print or save as PDF"
              >
                <PictureAsPdfIcon />
              </IconButton>
            </Tooltip>
            <Button variant="contained" startIcon={<EditIcon />} onClick={onEdit} size="small">
              Edit
            </Button>
          </Stack>
        </Toolbar>
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
                  label="Edit tags"
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
            {(keyLabel || capo > 0) && (
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
        <ChordModal chordName={selectedChord} onClose={() => setSelectedChord(null)} />
      )}

      {/* Edit tags */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Tags for {song.title}</DialogTitle>
        <DialogContent>
          <TagEditor
            tags={song.tags ?? []}
            onChange={(tags) => {
              handleTagsChange(tags);
              setDetailsOpen(false);
            }}
            helperText="Tags are shared with the rest of your library, so you can find the song again."
          />
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
