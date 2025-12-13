import React, { useState, useMemo, useRef, useEffect } from 'react';
import '../styles/SongViewer.css';
import type { Song, SongSection, DisplayMode } from '../types';
import { parseChordPro } from '../lib/chordPro';
import { transposeChord } from '../lib/music';
import { chordToNashville } from '../lib/nashville';
import { ChordStaff } from './ChordStaff';
import { ChordModal } from './ChordModal';
import { SectionNav } from './SectionNav';
import { ChordTab } from './ChordTab';

interface SongViewerProps {
    song: Song;
    onClose: () => void;
    onEdit: () => void;
}

export const SongViewer: React.FC<SongViewerProps> = ({ song, onClose, onEdit }) => {
    const [transpose, setTranspose] = useState(0);
    const [fontSize, setFontSize] = useState(18);
    const [capo, setCapo] = useState(song.capo || 0);
    const [selectedChord, setSelectedChord] = useState<string | null>(null);
    const [autoScroll, setAutoScroll] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(30); // pixels per second
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

    const cycleDisplayMode = () => {
        const modes: DisplayMode[] = ['chords', 'tabs', 'notation', 'nashville'];
        const currentIndex = modes.indexOf(displayMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setDisplayMode(modes[nextIndex]);
    };

    const getDisplayModeName = (mode: DisplayMode): string => {
        switch (mode) {
            case 'chords': return 'Chords';
            case 'tabs': return 'Tabs';
            case 'notation': return 'Notation';
            case 'nashville': return 'Nashville';
            default: return 'Chords';
        }
    };

    return (
        <>
            <div className="song-viewer-container">
                <div className="song-viewer-header">
                    <div className="header-controls-group">
                        <button className="icon-btn" onClick={onClose} title="Back to Library">
                            ←
                        </button>

                        <div className="control-item">
                            <span className="control-label">Scroll</span>
                            <button
                                className={`icon - btn ${autoScroll ? 'active' : ''} `}
                                onClick={toggleAutoScroll}
                                title={autoScroll ? 'Stop Auto-Scroll' : 'Start Auto-Scroll'}
                            >
                                {autoScroll ? '⏸' : '▶'}
                            </button>
                            {autoScroll && (
                                <div className="control-item" style={{ marginLeft: '8px' }}>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={scrollSpeed}
                                        onChange={e => setScrollSpeed(Number(e.target.value))}
                                    />
                                    <span style={{ fontSize: '0.75rem', width: '40px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                                        {Math.round(scrollSpeed)}px/s
                                    </span>
                                </div>
                            )}
                        </div>

                        {sections.length > 0 && (
                            <button
                                className={`main - btn ${loopMode ? 'active' : ''} `}
                                onClick={toggleLoopMode}
                                title="Loop selected section repeatedly"
                            >
                                🔁 {loopMode && loopSection !== null ? `Looping: ${sections[loopSection].label} ` : 'Loop Section'}
                            </button>
                        )}
                    </div>

                    <div className="header-controls-group">
                        <div className="control-item">
                            <span className="control-label">Capo</span>
                            <select
                                value={capo}
                                onChange={(e) => setCapo(Number(e.target.value))}
                                style={{
                                    background: 'var(--surface-hover)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-color)',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.875rem'
                                }}
                            >
                                {Array.from({ length: 13 }, (_, i) => (
                                    <option key={i} value={i}>{i === 0 ? 'None' : i}</option>
                                ))}
                            </select>
                        </div>

                        <div className="control-item">
                            <span className="control-label">Key</span>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                <button className="icon-btn" onClick={() => setTranspose(t => t - 1)}>−</button>
                                <span style={{ width: '30px', textAlign: 'center', lineHeight: '32px', fontSize: '0.9rem' }}>
                                    {transpose > 0 ? `+ ${transpose} ` : (transpose < 0 ? transpose : '0')}
                                </span>
                                <button className="icon-btn" onClick={() => setTranspose(t => t + 1)}>+</button>
                            </div>
                        </div>

                        <button
                            className="main-btn"
                            onClick={cycleDisplayMode}
                            title="Switch Notation Mode"
                            style={{ minWidth: '100px' }}
                        >
                            {getDisplayModeName(displayMode)}
                        </button>

                        <div className="control-item">
                            <button className="icon-btn" onClick={() => setFontSize(s => Math.max(12, s - 2))} title="Decrease Text Size">A-</button>
                            <button className="icon-btn" onClick={() => setFontSize(s => Math.min(48, s + 2))} title="Increase Text Size">A+</button>
                        </div>

                        <button className="main-btn" onClick={onEdit}>Edit</button>
                    </div>
                </div>

                {/* Section Navigation */}
                {sections.length > 0 && (
                    <div style={{ padding: '0.5rem 1rem', background: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                        <SectionNav sections={sections} onJumpToSection={handleSectionClick} />
                    </div>
                )}

                {/* Play View Area */}
                <div
                    ref={contentContainerRef}
                    className="song-content-area"
                    style={{ fontSize: `${fontSize} px` }}
                >
                    <div className="song-meta">
                        <h1 className="song-title">{song.title}</h1>
                        <h2 className="song-artist">{song.artist}</h2>
                    </div>

                    {capo > 0 && (
                        <div style={{
                            color: 'var(--primary-color)',
                            marginBottom: '2rem',
                            textAlign: 'center',
                            fontWeight: '600',
                            border: '1px solid var(--primary-color)',
                            display: 'inline-block',
                            padding: '0.25rem 1rem',
                            borderRadius: '999px',
                            fontSize: '0.9rem'
                        }}>
                            CAPO {capo}
                        </div>
                    )}

                    <div className="song-content">
                        {parsedContent.map((line, i) => (
                            <div
                                key={i}
                                ref={el => { lineRefs.current[i] = el; }}
                                className="song-line"
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'flex-end',
                                    marginBottom: '2rem',
                                    position: 'relative'
                                }}
                            >
                                {line.section && (
                                    <div className="section-label" style={{
                                        width: '100%',
                                        flexBasis: '100%',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.85rem',
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        marginBottom: '0.5rem',
                                        marginTop: '1rem',
                                        paddingTop: '1rem',
                                        borderTop: line.section.label !== 'Intro' ? '1px dashed var(--surface-hover)' : 'none'
                                    }}>
                                        {line.section.label}
                                    </div>
                                )}

                                {line.items.map((item, j) => {
                                    // Skip entirely empty items (whitespace lyrics with no chord) to prevent layout ghosts
                                    if (!item.chord && (!item.lyric || item.lyric.trim() === '')) {
                                        return null;
                                    }

                                    const isLyricEmpty = !item.lyric || item.lyric.trim() === '';

                                    return (
                                        <div key={j} className="chord-lyric-pair" style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            marginRight: isLyricEmpty ? '0.8rem' : '0px',
                                            minWidth: '1ch',
                                            alignItems: 'flex-start'
                                        }}>
                                            <div
                                                className={`chord-display ${item.chord ? 'clickable' : ''} ${(displayMode === 'notation' || displayMode === 'tabs') ? 'notation-mode' : ''}`}
                                                onClick={item.chord ? () => setSelectedChord(item.chord!) : undefined}
                                                style={{
                                                    height: (displayMode === 'notation' || displayMode === 'tabs') ? 'auto' : '1.5em',
                                                    marginBottom: displayMode === 'tabs' ? '0.6rem' : (displayMode === 'notation' ? '0.2rem' : '0.2em')
                                                }}
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
                                                <div className="lyric" style={{ whiteSpace: 'pre-wrap' }}>{item.lyric}</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Spacer for scrolling to bottom */}
                    <div style={{ height: '30vh' }}></div>
                </div>
            </div>

            {selectedChord && (
                <ChordModal
                    chordName={selectedChord}
                    onClose={() => setSelectedChord(null)}
                />
            )}
        </>
    );
};
