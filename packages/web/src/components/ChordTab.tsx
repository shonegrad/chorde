import React from 'react';
import { useTheme } from '@mui/material/styles';
import { CHORD_LIBRARY } from '../data/chordLibrary';

interface ChordTabProps {
    chord: string;
    width?: number;
    showLabels?: boolean; // Only show string labels on first chord
}

export const ChordTab: React.FC<ChordTabProps> = React.memo(({ chord, width = 80, showLabels = false }) => {
    const theme = useTheme();
    // Find chord data from the Record
    const chordData = CHORD_LIBRARY[chord];

    if (!chordData || !chordData.variations || chordData.variations.length === 0) return null;

    const strings = ['e', 'B', 'G', 'D', 'A', 'E']; // High to low (indices 5,4,3,2,1,0 in variations array)
    const frets = chordData.variations[0].frets; // Use first variation
    const lineSpacing = 8.5; // Increased spacing between strings for readability
    const leftMargin = showLabels ? 12 : 0; // Space for string labels only when shown

    return (
        <svg
            width={width + leftMargin}
            height={40}
            viewBox={`0 0 ${width + leftMargin} 40`}
            style={{ overflow: 'visible', verticalAlign: 'bottom' }}
        >
            {/* String labels and fret numbers */}
            {strings.map((stringName, i) => {
                const fret = frets[5 - i]; // Reverse index (frets array is low E to high e)
                const y = 6 + (i * lineSpacing);
                const fretDisplay = typeof fret === 'number' ? fret.toString() : 'x';

                return (
                    <g key={i}>
                        {/* String name label - only on first chord */}
                        {showLabels && (
                            <text
                                x={2}
                                y={y + 3.5}
                                fontSize={8}
                                fill={theme.palette.text.secondary}
                                fontFamily={theme.typography.mono.fontFamily}
                                fontWeight="600"
                            >
                                {stringName}
                            </text>
                        )}

                        {/* String line */}
                        <line
                            x1={leftMargin}
                            y1={y}
                            x2={width + leftMargin}
                            y2={y}
                            stroke={theme.palette.divider}
                            strokeWidth="1"
                        />

                        {/* Fret number or mute marker */}
                        <text
                            x={leftMargin + (width / 2)}
                            y={y + 4}
                            fontSize={11}
                            fill={fret === 'x' ? theme.palette.text.disabled : theme.palette.primary.main}
                            textAnchor="middle"
                            fontWeight="bold"
                            fontFamily={theme.typography.mono.fontFamily}
                        >
                            {fretDisplay}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
});
