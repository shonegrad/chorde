import React from 'react';
import { useTheme } from '@mui/material/styles';
import type { ChordVariation } from '../data/chordLibrary';

interface ChordDiagramProps {
    variation: ChordVariation;
    chordName: string;
}

const STRINGS = 6;
const VISIBLE_FRETS = 5;

export const ChordDiagram: React.FC<ChordDiagramProps> = React.memo(({ variation, chordName: _chordName }) => {
    const theme = useTheme();
    const { frets, fingers, barres } = variation;

    // Find the min/max fret to determine diagram position
    const numericFrets = frets.filter(f => typeof f === 'number') as number[];
    const minFret = numericFrets.length > 0 ? Math.min(...numericFrets.filter(f => f > 0)) : 1;
    const startFret = minFret > 1 ? minFret : 1;

    const stringSpacing = 30;
    const fretHeight = 40;
    const paddingX = 40; // Increased from 20 to 40 to accommodate fret numbers
    const width = (STRINGS - 1) * stringSpacing + (paddingX * 2);
    const height = VISIBLE_FRETS * fretHeight + 60;

    const renderDot = (stringIndex: number, fret: number | 'x') => {
        if (fret === 'x' || fret === 0) return null;

        const relFret = fret - startFret + 1;
        if (relFret < 1 || relFret > VISIBLE_FRETS) return null;

        const x = paddingX + stringIndex * stringSpacing;
        const y = 30 + (relFret - 0.5) * fretHeight;
        const finger = fingers[stringIndex];

        return (
            <g key={`dot-${stringIndex}`}>
                <circle cx={x} cy={y} r="10" fill={theme.palette.primary.main} />
                {typeof finger === 'number' && finger > 0 && (
                    <text x={x} y={y + 4} textAnchor="middle" fill={theme.palette.primary.contrastText} fontSize="12" fontWeight="bold">
                        {finger}
                    </text>
                )}
            </g>
        );
    };

    return (
        <svg width={width} height={height} style={{ display: 'block', margin: '0 auto' }}>
            {/* String markers at top (O for open, X for muted) */}
            {frets.map((fret, i) => {
                const x = paddingX + i * stringSpacing;
                if (fret === 'x') {
                    return (
                        <text key={`marker-${i}`} x={x} y={15} textAnchor="middle" fill={theme.palette.text.primary} fontSize="18" fontWeight="bold">
                            X
                        </text>
                    );
                } else if (fret === 0) {
                    return (
                        <circle key={`marker-${i}`} cx={x} cy={10} r="6" fill="none" stroke={theme.palette.text.primary} strokeWidth="2" />
                    );
                }
                return null;
            })}

            {/* Fret position indicator */}
            {startFret > 1 && (
                <text x={5} y={30 + fretHeight * 0.5} textAnchor="start" fill={theme.palette.text.secondary} fontSize="14">
                    {startFret}fr
                </text>
            )}

            {/* Fretboard */}
            <g transform={`translate(${paddingX}, 30)`}>
                {/* Vertical lines (strings) */}
                {Array.from({ length: STRINGS }).map((_, i) => (
                    <line
                        key={`string-${i}`}
                        x1={i * stringSpacing}
                        y1={0}
                        x2={i * stringSpacing}
                        y2={VISIBLE_FRETS * fretHeight}
                        stroke={theme.palette.text.secondary}
                        strokeWidth="1.5"
                    />
                ))}

                {/* Horizontal lines (frets) */}
                {Array.from({ length: VISIBLE_FRETS + 1 }).map((_, i) => (
                    <line
                        key={`fret-${i}`}
                        x1={0}
                        y1={i * fretHeight}
                        x2={(STRINGS - 1) * stringSpacing}
                        y2={i * fretHeight}
                        stroke={theme.palette.text.primary}
                        strokeWidth={i === 0 && startFret === 1 ? '4' : '2'}
                    />
                ))}

                {/* Barres */}
                {barres?.map((barreFret) => {
                    const relFret = barreFret - startFret + 1;
                    if (relFret < 1 || relFret > VISIBLE_FRETS) return null;

                    const y = (relFret - 0.5) * fretHeight;
                    const firstString = frets.findIndex(f => f === barreFret);
                    const lastString = frets.lastIndexOf(barreFret);

                    return (
                        <rect
                            key={`barre-${barreFret}`}
                            x={firstString * stringSpacing - 8}
                            y={y - 8}
                            width={(lastString - firstString) * stringSpacing + 16}
                            height={16}
                            rx={8}
                            fill={theme.palette.primary.main}
                        />
                    );
                })}
            </g>

            {/* Finger dots */}
            <g transform="translate(0, 0)">
                {frets.map((fret, i) => renderDot(i, fret))}
            </g>
        </svg>
    );
});
