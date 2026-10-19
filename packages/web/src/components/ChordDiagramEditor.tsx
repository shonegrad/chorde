import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import type { ChordVariation } from '../data/chordLibrary';
import { Box, Button, Stack, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface ChordDiagramEditorProps {
  chordName?: string;
  initialVariation?: ChordVariation;
  onSave: (variation: ChordVariation) => void;
  onClose: () => void;
}

const STRINGS = 6;
const VISIBLE_FRETS = 5;

export const ChordDiagramEditor: React.FC<ChordDiagramEditorProps> = ({
  chordName,
  initialVariation,
  onSave,
  onClose,
}) => {
  const theme = useTheme();
  const [baseFret, setBaseFret] = useState<number>(initialVariation ? 1 : 1);
  const [frets, setFrets] = useState<(number | 'x')[]>(
    initialVariation?.frets ?? [0, 0, 0, 0, 0, 0]
  );
  const [fingers] = useState<(number | 'x')[]>(initialVariation?.fingers ?? [0, 0, 0, 0, 0, 0]);

  const stringSpacing = 30;
  const fretHeight = 40;
  const paddingX = 40;
  const width = (STRINGS - 1) * stringSpacing + paddingX * 2;
  const height = VISIBLE_FRETS * fretHeight + 60;

  const handleFretClick = (stringIndex: number, fretNumber: number) => {
    setFrets((prev) => {
      const next = [...prev];
      if (prev[stringIndex] === fretNumber) {
        next[stringIndex] = 0;
      } else {
        next[stringIndex] = fretNumber;
      }
      return next;
    });
  };

  const handleTopClick = (stringIndex: number) => {
    setFrets((prev) => {
      const next = [...prev];
      if (prev[stringIndex] === 'x') {
        next[stringIndex] = 0;
      } else if (prev[stringIndex] === 0) {
        next[stringIndex] = 'x';
      } else {
        next[stringIndex] = 'x';
      }
      return next;
    });
  };

  const handleSave = () => {
    onSave({ frets, fingers, barres: [], suffix: 'custom' });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Edit Chord Diagram {chordName ? `— ${chordName}` : ''}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="body2">Base fret:</Typography>
        <IconButton size="small" onClick={() => setBaseFret((b) => Math.max(1, b - 1))}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography>{baseFret}</Typography>
        <IconButton size="small" onClick={() => setBaseFret((b) => Math.min(12, b + 1))}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Stack>

      <svg
        width={width}
        height={height}
        style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
      >
        {/* Top markers */}
        {frets.map((fret, i) => {
          const x = paddingX + i * stringSpacing;
          if (fret === 'x') {
            return (
              <text
                key={`top-${i}`}
                x={x}
                y={15}
                textAnchor="middle"
                fill={theme.palette.text.primary}
                fontSize={18}
                fontWeight="bold"
                onClick={() => handleTopClick(i)}
              >
                X
              </text>
            );
          }
          if (fret === 0) {
            return (
              <circle
                key={`top-${i}`}
                cx={x}
                cy={10}
                r={6}
                fill="none"
                stroke={theme.palette.text.primary}
                strokeWidth={2}
                onClick={() => handleTopClick(i)}
              />
            );
          }
          return null;
        })}

        <g transform={`translate(${paddingX}, 30)`}>
          {/* strings */}
          {Array.from({ length: STRINGS }).map((_, i) => (
            <line
              key={`str-${i}`}
              x1={i * stringSpacing}
              y1={0}
              x2={i * stringSpacing}
              y2={VISIBLE_FRETS * fretHeight}
              stroke={theme.palette.text.secondary}
              strokeWidth={1.5}
            />
          ))}
          {/* frets */}
          {Array.from({ length: VISIBLE_FRETS + 1 }).map((_, i) => (
            <line
              key={`fr-${i}`}
              x1={0}
              y1={i * fretHeight}
              x2={(STRINGS - 1) * stringSpacing}
              y2={i * fretHeight}
              stroke={theme.palette.text.primary}
              strokeWidth={i === 0 && baseFret === 1 ? 4 : 2}
            />
          ))}
          {/* clickable cells */}
          {Array.from({ length: STRINGS }).map((_, si) =>
            Array.from({ length: VISIBLE_FRETS }).map((_, fi) => {
              const fretNum = baseFret + fi;
              const cx = si * stringSpacing;
              const cy = fi * fretHeight + fretHeight / 2;
              const isActive = frets[si] === fretNum;
              return (
                <circle
                  key={`cell-${si}-${fi}`}
                  cx={cx}
                  cy={cy}
                  r={12}
                  fill={isActive ? theme.palette.primary.main : 'transparent'}
                  stroke={theme.palette.divider}
                  strokeWidth={1}
                  onClick={() => handleFretClick(si, fretNum)}
                />
              );
            })
          )}
          {/* base fret label */}
          {baseFret > 1 && (
            <text
              x={-10}
              y={fretHeight * 0.5}
              textAnchor="end"
              fill={theme.palette.text.secondary}
              fontSize={12}
            >
              {baseFret}fr
            </text>
          )}
        </g>
      </svg>

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </Stack>
    </Box>
  );
};
