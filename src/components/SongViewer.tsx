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
}

export const SongViewer: React.FC<SongViewerProps> = ({ song, onClose, onEdit }) => {
    const theme = useTheme();
    const [transpose, setTranspose] = useState(0);
    const [fontSize, setFontSize] = useState(20);
    const [capo, setCapo] = useState(song.capo || 0);
    const [selectedChord, setSelectedChord] = useState<string | null>(null);
    const [autoScroll, setAutoScroll] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(50); // initial speed faster as requested
    const [loopMode, setLoopMode] = useState(false);
    const [loopSection, setLoopSection] = useState<number | null>(null); // Index of section to loop
    const [displayMode, setDisplayMode] = useState<DisplayMode>('chords');
    const contentContainerRef = useRef<HTMLDivElement>(null);
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
    const animationFrameRef = useRef<number | null>(null);
    const lastScrollTimeRef = useRef<number>(Date.now());

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

    // Auto-scroll effect with looping support
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

            const scrollAmount = scrollSpeed * deltaTime;
            contentContainerRef.current.scrollTop += scrollAmount;

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
        animationFrameRef.current = requestAnimationFrame(scroll);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [autoScroll, scrollSpeed, loopMode, loopSection, sections, parsedContent.length]);

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

    const jumpToSection = (lineIndex: number) => {
        const lineElement = lineRefs.current[lineIndex];
        if (lineElement && contentContainerRef.current) {
            lineElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                        {/* Scroll Controls */}
                        <Paper variant="outlined" sx={{ p: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Tooltip title={autoScroll ? 'Stop Auto-Scroll' : 'Start Auto-Scroll'}>
                                <IconButton onClick={toggleAutoScroll} color={autoScroll ? "primary" : "default"}>
                                    {autoScroll ? <PauseIcon /> : <PlayArrowIcon />}
                                </IconButton>
                            </Tooltip>
                            {autoScroll && (
                                <Box sx={{ width: 100, mx: 1 }}>
                                    <Slider
                                        size="small"
                                        value={scrollSpeed}
                                        min={10}
                                        max={250}
                                        onChange={(_, val) => setScrollSpeed(val as number)}
                                        aria-label="Scroll speed"
                                    />
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
                    scrollBehavior: 'smooth',
                    fontSize: `${fontSize}px`
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>{song.title}</Typography>
                        <Typography variant="h5" color="text.secondary" gutterBottom>{song.artist}</Typography>
                        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                            {song.tags?.map(tag => (
                                <Chip key={tag} label={`#${tag}`} variant="outlined" size="small" />
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
