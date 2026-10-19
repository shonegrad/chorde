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
    const lineSpacing = 9;
    const leftMargin = showLabels ? 25 : 0; // Space for string labels

    return (
      <svg
        width={width + leftMargin}
        height={strings.length * lineSpacing + 4}
        viewBox={`0 0 ${width + leftMargin} ${strings.length * lineSpacing + 4}`}
        style={{ overflow: 'visible', verticalAlign: 'bottom' }}
      >
        {/* String labels */}
        {showLabels &&
          strings.map((stringName, i) => {
            const actualName = stringName || '';
            return (
              <text
                key={i}
                x={2}
                y={(i + 1) * lineSpacing - 2}
                fontSize={9}
                fill={theme.palette.text.secondary}
                fontFamily={theme.typography.mono.fontFamily}
                fontWeight="600"
              >
                {actualName}
              </text>
            );
          })}

        {/* Fret lines */}
        {strings.map((_, i) => {
          const fret = frets[5 - i]; // Reverse index (frets array is low E to high e)
          const y = 3.5 + i * lineSpacing;
          const fretDisplay = typeof fret === 'number' ? fret.toString() : fret === 'x' ? 'M' : '';

          return (
            <g key={i}>
              <line
                x1={leftMargin}
                y={y}
                x2={width + leftMargin}
                y2={y}
                stroke={theme.palette.divider}
                strokeWidth="1"
              />

              {/* Fret number or mute marker */}
              <text
                x={leftMargin + width / 2}
                y={y + 5}
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
                  const stringIndex = i; // Simple mapping: index corresponds to string
                  const y = 3.5 + stringIndex * lineSpacing;
                  return (
                    <text
                      key={`finger-${i}`}
                      x={leftMargin + 15}
                      y={y + 4}
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
