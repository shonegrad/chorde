import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Song, SongSection, DisplayMode } from '../types';
import { parseChordPro } from '../lib/chordPro';
import { exportToChordPro } from '../lib/export';
import { transposeChord } from '../lib/music';
import { chordToNashville } from '../lib/nashville';
import { ChordStaff } from './ChordStaff';
import { ChordModal } from './ChordModal';
import { SectionNav } from './SectionNav';
import { ChordTab } from './ChordTab';
import { MusicNoteIcon } from '@mui/icons-material';
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
    InputLabel,
    Stack,
    Chip,
    Paper,
    Container,
    Tooltip,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import LoopIcon from '@mui/icons-material/Loop';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import '../styles/SongViewer.css';

interface SongViewerProps {
    song: Song;
    onClose: () => void;
    onEdit: () => void;
    onTagClick?: (tag: string) => void;
    onArtistClick?: (artist: string) => void;
}

export const SongViewer: React.FC<SongViewerProps> = ({ song, onClose, onEdit, onTagClick, onArtistClick }) => {
    const theme = useTheme();
    const [transpose, setTranspose] = useState(0);
    const [fontSize, setFontSize] = useState(20);
    const [capo, setCapo] = useState(song.capo || 0);
    const [selectedChord, setSelectedChord] = useState<string | null>(null);
    const [autoScroll, setAutoScroll] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(40); // pixel per second
    const scrollSpeedRef = useRef(40); // ref to track scroll speed without triggering effect reset
    const [loopMode, setLoopMode] = useState(false);
    const [loopSection, setLoopSection] = useState<number | null>(null); // Index of section to loop
    const [displayMode, setDisplayMode] = useState<DisplayMode>('chords');
    const contentContainerRef = useRef<HTMLDivElement>(null);
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
    const animationFrameRef = useRef<number | null>(null);
    const lastScrollTimeRef = useRef<number>(0);
    const scrollAccumulatorRef = useRef<number>(0); // accumulate fractional pixels for smooth slow scrolling
    
    // BPM and tempo controls
    const [bpm, setBpm] = useState<number | null>(song.bpm ?? null); // Current BPM (song's or override)
    const [overrideBpm, setOverrideBpm] = useState<number | null>(null); // Manual BPM override
    const [lockTempo, setLockTempo] = useState(false); // Prevent accidental tempo changes
    const [countIn, setCountIn] = useState<number>(0); // Count-in progress
    const [countInBeats, setCountInBeats] = useState<number>(4); // Beats for count-in
    const [clickSoundEnabled, setClickSoundEnabled] = useState<boolean>(true); // Click sound for count-in
    
    // Audio context for click sound
    const audioCtxRef = useRef<AudioContext | null>(null);
    const lastTapTimeRef = useRef<number>(0);
    const tapTimesRef = useRef<number[]>([]);

    const parsedContent = useMemo(() => {
        const parsed = parseChordPro(song.content);
        if (transpose === 0) return parsed;

        return parsed.map(line => ({
            ...line,
            items: line.items.map(item => ({
                ...item,
                chord: item.chord ? transposeChord(item.chord, transpose) : undefined
            }))
        }));
    }, [song.content, transpose]);

    const sections = useMemo(() => {
        const extracted: SongSection[] = [];
        parsedContent.forEach((line, idx) => {
            if (line.section) {
                extracted.push({ ...line.section, lineIndex: idx });
            }
        });
        return extracted;
    }, [parsedContent]);

    const jumpToSection = (lineIndex: number) => {
        const lineElement = lineRefs.current[lineIndex];
        if (lineElement && contentContainerRef.current) {
            lineElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

     // BPM-based scroll speed calculation
    useEffect(() => {
        // Calculate scroll speed based on BPM and beats per line
        // In a real implementation, these would come from user settings
        const beatsPerLine = 4; // Default value - would come from settings
        const pixelPerBeat = 40; // Approximate pixels per beat line height - would come from settings
        
        let calculatedBpm = song.bpm ?? 120; // Use song BPM or default
        if (overrideBpm !== null) {
            calculatedBpm = overrideBpm;
        }
        
        // Scroll speed in pixels per second = (BPM / 60) * beatsPerLine * pixelPerBeat
        const scrollSpeed = (calculatedBpm / 60) * beatsPerLine * pixelPerBeat;
        setScrollSpeed(scrollSpeed);
        scrollSpeedRef.current = scrollSpeed;
    }, [song.bpm, overrideBpm]);

    // Auto-scroll effect with looping support and count-in
    useEffect(() => {
        if (!autoScroll || !contentContainerRef.current) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            return;
        }

        const scroll = () => {
            if (!contentContainerRef.current || !autoScroll) return;

            const now = Date.now();
            const deltaTime = (now - lastScrollTimeRef.current) / 1000; // seconds
            lastScrollTimeRef.current = now;

            // Calculate scroll amount and accumulate fractional pixels
            const scrollAmount = scrollSpeedRef.current * deltaTime;
            scrollAccumulatorRef.current += scrollAmount;

            // Only scroll when we have at least 1 pixel accumulated (fixes slow speed scrolling)
            const pixelsToScroll = Math.floor(scrollAccumulatorRef.current);
            if (pixelsToScroll > 0) {
                contentContainerRef.current.scrollTop += pixelsToScroll;
                scrollAccumulatorRef.current -= pixelsToScroll; // keep the fractional remainder
            }

            // Check if we've reached the loop end
            if (loopMode && loopSection !== null && sections.length > 0) {
                const currentSection = sections[loopSection];
                const nextSection = sections[loopSection + 1];

                // Find the end of current section (start of next section or end of song)
                const sectionEndLine = nextSection ? nextSection.lineIndex : parsedContent.length;
                const sectionEndElement = lineRefs.current[sectionEndLine - 1];

                if (sectionEndElement && contentContainerRef.current) {
                    const containerTop = contentContainerRef.current.getBoundingClientRect().top;
                    const elementBottom = sectionEndElement.getBoundingClientRect().bottom;

                    // If we've scrolled past the section, loop back
                    if (elementBottom <= containerTop + 100) {
                        jumpToSection(currentSection.lineIndex);
                        return;
                    }
                }
            }

            // Stop if reached bottom (only when not looping)
            if (!loopMode) {
                const { scrollTop, scrollHeight, clientHeight } = contentContainerRef.current;
                if (scrollTop + clientHeight >= scrollHeight - 10) {
                    setAutoScroll(false);
                    return;
                }
            }

            animationFrameRef.current = requestAnimationFrame(scroll);
        };

        lastScrollTimeRef.current = Date.now();
        scrollAccumulatorRef.current = 0; // reset accumulator on start
        animationFrameRef.current = requestAnimationFrame(scroll);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [autoScroll, loopMode, loopSection, sections, parsedContent.length]);

    // Handle count-in before starting auto-scroll
    useEffect(() => {
        if (countIn > 0 && autoScroll) {
            const interval = setInterval(() => {
                setCountIn(prev => prev - 1);
                // Play click sound if enabled
                if (clickSoundEnabled) {
                    playClickSound();
                }
            }, 1000); // Decrement every second
            
            return () => clearInterval(interval);
        }
        
        if (countIn === 0 && autoScroll) {
            // Actually start scrolling after count-in completes
            // The scroll effect above will handle the actual scrolling
        }
    }, [countIn, autoScroll, clickSoundEnabled]);

    // Handle tempo lock - prevent changing BPM when locked
    useEffect(() => {
        if (lockTempo && overrideBpm !== null) {
            // If tempo is locked, reset override to song's BPM
            setOverrideBpm(song.bpm ?? null);
        }
    }, [lockTempo, song.bpm, overrideBpm]);

    // Handle tap tempo
    const handleTapTempo = () => {
        if (lockTempo) return;
        
        const now = Date.now();
        const lastTap = lastTapTimeRef.current;
        
        // If this is the first tap or more than 2 seconds since last tap, reset the tap times
        if (lastTap === 0 || (now - lastTap) > 2000) {
            tapTimesRef.current = [now];
        } else {
            // Add this tap to our times
            tapTimesRef.current.push(now);
            
            // Keep only the last 4 taps for averaging
            if (tapTimesRef.current.length > 4) {
                tapTimesRef.current.shift();
            }
            
            // Calculate BPM from the tap intervals
            if (tapTimesRef.current.length >= 2) {
                let totalInterval = 0;
                for (let i = 1; i < tapTimesRef.current.length; i++) {
                    totalInterval += tapTimesRef.current[i] - tapTimesRef.current[i-1];
                }
                const avgInterval = totalInterval / (tapTimesRef.current.length - 1);
                const calculatedBpm = Math.round(60000 / avgInterval);
                
                // Set the override BPM
                setOverrideBpm(calculatedBpm);
                setBpm(calculatedBpm);
            }
        }
        
        lastTapTimeRef.current = now;
    };

    // Play click sound for count-in
    const playClickSound = () => {
        // Create audio context if needed
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const ctx = audioCtxRef.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        // Configure the click sound
        oscillator.type = 'square';
        oscillator.frequency.value = 1000; // Hz
        gainNode.gain.value = 0.1; // Volume
        
        // Connect and play
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        // Play for a short duration
        const now = ctx.currentTime;
        oscillator.start(now);
        oscillator.stop(now + 0.1); // 100ms duration
    };

    const toggleAutoScroll = () => {
        setAutoScroll(!autoScroll);
    };

    const toggleLoopMode = () => {
        const newLoopMode = !loopMode;
        setLoopMode(newLoopMode);

        // If enabling loop mode and we have sections, default to looping the first section
        if (newLoopMode && sections.length > 0 && loopSection === null) {
            setLoopSection(0);
        }

        // If disabling loop mode, clear the loop section
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

    // Convert chord to display format based on current mode
    const convertChordDisplay = (chord: string): string => {
        if (!chord) return '';

        switch (displayMode) {
            case 'chords':
                return chord;
            case 'nashville':
                return chordToNashville(chord, song.key || 'C');
            case 'tabs':
            case 'notation':
                return ''; // Will render component directly
            default:
                return chord;
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            {/* Header Controls */}
            <AppBar position="static" color="default" elevation={1}>
                <Toolbar>
                    <IconButton edge="start" onClick={onClose} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>

                     <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1, overflowX: 'auto' }}>
                         {/* Tempo Controls */}
                         <Paper variant="outlined" sx={{ p: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                             <Tooltip title="Tap to set tempo">
                                 <IconButton 
                                     onClick={handleTapTempo} 
                                     color={lockTempo ? "disabled" : "default"}
                                 >
                                     <MusicNoteIcon fontSize="small" />
                                 </IconButton>
                             </Tooltip>
                             <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'center', fontWeight: 'bold' }}>
                                 {bpm !== null ? bpm : '--'}
                             </Typography>
                             <IconButton 
                                 onClick={() => setBpm(prev => prev !== null ? prev - 1 : null)}
                                 disabled={lockTempo || (bpm !== null && bpm <= 40)}
                                 color={lockTempo ? "disabled" : "default"}
                             >
                                 <RemoveIcon fontSize="small" />
                             </IconButton>
                             <IconButton 
                                 onClick={() => setBpm(prev => prev !== null ? prev + 1 : null)}
                                 disabled={lockTempo || (bpm !== null && bpm >= 208)}
                                 color={lockTempo ? "disabled" : "default"}
                             >
                                 <AddIcon fontSize="small" />
                             </IconButton>
                             <FormControlLabel
                                 control={
                                   <Switch
                                     checked={lockTempo}
                                     onChange={(e) => setLockTempo(e.target.checked)}
                                   />
                                 }
                                 label="Lock"
                                 sx={{ ml: 1 }}
                             />
                         </Paper>

                         {/* Scroll Controls */}
                         <Paper variant="outlined" sx={{ p: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                             <Tooltip title={autoScroll ? 'Stop Auto-Scroll' : 'Start Auto-Scroll'}>
                                 <IconButton onClick={toggleAutoScroll} color={autoScroll ? "primary" : "default"}>
                                     {autoScroll ? <PauseIcon /> : <PlayArrowIcon />}
                                 </IconButton>
                             </Tooltip>
                             {autoScroll && (
                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                     <Box sx={{ width: 120, mx: 1 }}>
                                         <Slider
                                             size="small"
                                             value={scrollSpeed}
                                             min={15}
                                             max={80}
                                             onChange={(_, val) => {
                                                 const newSpeed = val as number;
                                                 setScrollSpeed(newSpeed);
                                                 scrollSpeedRef.current = newSpeed;
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
                                             fontSize: '0.75rem'
                                         }}
                                     >
                                         {scrollSpeed} px/s
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
                                >
                                    <LoopIcon fontSize="small" sx={{ mr: 1 }} />
                                    {loopMode && loopSection !== null ? sections[loopSection].label : 'Loop'}
                                </ToggleButton>
                            </Tooltip>
                        )}

                        {/* Capo Control */}
                        <FormControl size="small" variant="outlined" sx={{ minWidth: 80 }}>
                            <InputLabel>Capo</InputLabel>
                            <Select
                                value={capo}
                                onChange={(e) => setCapo(Number(e.target.value))}
                                label="Capo"
                            >
                                <MenuItem value={0}>None</MenuItem>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Key Transpose */}
                        <Paper variant="outlined" sx={{ p: 0.5, display: 'flex', alignItems: 'center' }}>
                            <IconButton size="small" onClick={() => setTranspose(t => t - 1)}><RemoveIcon fontSize="small" /></IconButton>
                            <Typography variant="body2" sx={{ mx: 1, minWidth: 20, textAlign: 'center' }}>
                                {transpose > 0 ? `+${transpose}` : (transpose < 0 ? transpose : '0')}
                            </Typography>
                            <IconButton size="small" onClick={() => setTranspose(t => t + 1)}><AddIcon fontSize="small" /></IconButton>
                        </Paper>

                        {/* Display Mode */}
                        <ToggleButtonGroup
                            value={displayMode}
                            exclusive
                            onChange={(_, newMode) => newMode && setDisplayMode(newMode)}
                            size="small"
                        >
                            <ToggleButton value="chords">Chords</ToggleButton>
                            <ToggleButton value="tabs">Tabs</ToggleButton>
                            <ToggleButton value="notation">Notes</ToggleButton>
                        </ToggleButtonGroup>

                        {/* Font Size */}
                        <Box>
                            <IconButton size="small" onClick={() => setFontSize(s => Math.max(12, s - 2))}>
                                <TextDecreaseIcon />
                            </IconButton>
                            <IconButton size="small" onClick={() => setFontSize(s => Math.min(48, s + 2))}>
                                <TextIncreaseIcon />
                            </IconButton>
                        </Box>

                        <IconButton onClick={() => exportToChordPro(song)} title="Download">
                            <DownloadIcon />
                        </IconButton>
                        <Button variant="contained" startIcon={<EditIcon />} onClick={onEdit} size="small">
                            Edit
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* Section Navigation */}
            {sections.length > 0 && (
                <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <SectionNav sections={sections} onJumpToSection={handleSectionClick} />
                </Box>
            )}

            {/* Song Content */}
            <Box
                ref={contentContainerRef}
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    p: 4,
                    scrollBehavior: autoScroll ? 'auto' : 'smooth', // auto for programmatic, smooth for manual
                    fontSize: `${fontSize}px`
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>{song.title}</Typography>
                        <Tooltip title="View all songs by this artist">
                            <Typography
                                variant="h5"
                                color="text.secondary"
                                gutterBottom
                                sx={{
                                    cursor: onArtistClick ? 'pointer' : 'default',
                                    '&:hover': onArtistClick ? { color: 'primary.main', textDecoration: 'underline' } : {}
                                }}
                                onClick={() => onArtistClick && onArtistClick(song.artist)}
                            >
                                {song.artist}
                            </Typography>
                        </Tooltip>
                        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                            {song.tags?.map(tag => (
                                <Chip
                                    key={tag}
                                    label={`#${tag}`}
                                    variant="outlined"
                                    size="small"
                                    onClick={onTagClick ? () => onTagClick(tag) : undefined}
                                    sx={{ cursor: onTagClick ? 'pointer' : 'default' }}
                                />
                            ))}
                        </Stack>
                        {capo > 0 && (
                            <Chip
                                label={`CAPO ${capo}`}
                                color="primary"
                                variant="outlined"
                                sx={{ mt: 2, fontWeight: 'bold' }}
                            />
                        )}
                    </Box>

                    <Box>
                        {parsedContent.map((line, i) => (
                            <div
                                key={i}
                                ref={(el: HTMLDivElement | null) => { lineRefs.current[i] = el; }}
                                className={`song-line ${(displayMode === 'tabs' || displayMode === 'notation') ? 'expanded-spacing' : ''}`}
                            >
                                {line.section && (
                                    <div
                                        className={`section-label ${(displayMode === 'tabs' || displayMode === 'notation') ? 'expanded-spacing' : ''}`}
                                        style={{
                                            borderTop: line.section.label !== 'Intro' ? `1px dashed ${theme.palette.divider}` : 'none',
                                            paddingTop: line.section.label !== 'Intro' ? theme.spacing(6) : theme.spacing(2),
                                        }}
                                    >
                                        {line.section.label}
                                    </div>
                                )}

                                {line.items.map((item, j) => {
                                    if (!item.chord && (!item.lyric || item.lyric.trim() === '')) {
                                        return null;
                                    }

                                    const isLyricEmpty = !item.lyric || item.lyric.trim() === '';

                                    return (
                                        <div key={j} className="chord-lyric-pair" style={{
                                            marginRight: isLyricEmpty ? (line.section?.label === 'Intro' ? theme.spacing(6) : theme.spacing(2)) : undefined,
                                        }}>
                                            <div
                                                onClick={item.chord ? () => setSelectedChord(item.chord!) : undefined}
                                                className={`chord-display ${item.chord ? 'clickable' : ''} ${(displayMode === 'notation' || displayMode === 'tabs') ? 'notation-mode' : ''}`}
                                            >
                                                {item.chord ? (
                                                    displayMode === 'notation' ? (
                                                        <ChordStaff chord={item.chord} />
                                                    ) : displayMode === 'tabs' ? (
                                                        <ChordTab chord={item.chord} showLabels={j === 0} />
                                                    ) : (
                                                        convertChordDisplay(item.chord)
                                                    )
                                                ) : '\u00A0'}
                                            </div>
                                            {!isLyricEmpty && item.lyric && (
                                                <span style={{
                                                    whiteSpace: 'pre-wrap',
                                                    fontFamily: 'inherit',
                                                    fontSize: 'inherit',
                                                    lineHeight: 1.5,
                                                    color: theme.palette.text.primary
                                                }} className="lyric">
                                                    {item.lyric}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </Box>

                    {/* Spacer for scrolling to bottom */}
                    <Box sx={{ height: '30vh' }} />
                </Container>
            </Box>

            {selectedChord && (
                <ChordModal
                    chordName={selectedChord}
                    onClose={() => setSelectedChord(null)}
                />
            )}
        </Box>
    );
};
