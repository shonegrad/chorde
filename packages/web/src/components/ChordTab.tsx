import React from 'react';
import { useTheme } from '@mui/material/styles';
import { CHORD_LIBRARY } from '../data/chordLibrary';

interface ChordTabProps {
  chord: string;
  width?: number;
  showLabels?: boolean; // Show string names (E A D G B e)
  showFingerings?: boolean; // Show finger numbers if available
}

export const ChordTab: React.FC<ChordTabProps> = React.memo(
  ({ chord, width = 80, showLabels = true, showFingerings = false }) => {
    const theme = useTheme();
    // Find chord data from the Record
    const chordData = CHORD_LIBRARY[chord];

    if (!chordData || !chordData.variations || chordData.variations.length === 0) return null;

    const strings = showLabels ? ['e', 'B', 'G', 'D', 'A', 'E'] : ['', '', '', '', '', '']; // High to low (indices 5,4,3,2,1,0 in variations array)
    const frets = chordData.variations[0].frets; // Use first variation
    const lineHeight = 16;
    const svgHeight = strings.length * lineHeight + 4;
    const leftMargin = showLabels ? 30 : 0; // Space for string labels

    return (
      <svg
        width={width + leftMargin}
        height={svgHeight}
        viewBox={`0 0 ${width + leftMargin} ${svgHeight}`}
        style={{ overflow: 'visible', verticalAlign: 'bottom' }}
        role="img"
        aria-label={`${chord} guitar tab`}
      >
        {/* String labels */}
        {showLabels &&
          strings.map((stringName, i) => {
            const actualName = stringName || '';
            const y = lineHeight * (strings.length - i) - 2; // Reverse: high e at top
            return (
              <text
                key={i}
                x={2}
                y={y}
                fontSize={9}
                fill={theme.palette.text.secondary}
                fontFamily={theme.typography.mono.fontFamily}
                fontWeight="600"
              >
                {actualName}
              </text>
            );
          })}

        {/* Fret lines - parallel horizontal lines */}
        {strings.map((_, i) => {
          const fret = frets[5 - i]; // Reverse index (frets array is low E to high e)
          const y = lineHeight * (strings.length - i); // Consistent y-position for fret line
          const fretDisplay = typeof fret === 'number' ? fret.toString() : fret === 'x' ? 'M' : '';

          return (
            <g key={i}>
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
                x={leftMargin + width / 2}
                y={y + 7}
                fontSize={10}
                fill={fret === 'x' ? theme.palette.text.disabled : theme.palette.primary.main}
                textAnchor="middle"
                fontFamily={theme.typography.mono.fontFamily}
                fontWeight="bold"
              >
                {fretDisplay}
              </text>
            </g>
          );
        })}

        {/* Finger numbers if available (basic display) */}
        {showFingerings &&
          chordData.variations[0].fingers &&
          chordData.variations[0].fingers.length > 0 && (
            <g key="fingerings">
              {chordData.variations[0].fingers.map((fretNum: number | string, i: number) => {
                if (typeof fretNum === 'number' && fretNum >= 1 && fretNum <= 4) {
                  // Map finger to string: index 0 = high e, index 5 = low E
                  const stringIndex = 5 - i;
                  const y = lineHeight * (strings.length - stringIndex);
                  return (
                    <text
                      key={`finger-${i}`}
                      x={leftMargin + 20}
                      y={y + 3}
                      fontSize={8}
                      fill={theme.palette.primary.main}
                      fontFamily={theme.typography.mono.fontFamily}
                      fontWeight="bold"
                    >
                      {fretNum}
                    </text>
                  );
                }
                return null;
              })}
            </g>
          )}
      </svg>
    );
  }
);
