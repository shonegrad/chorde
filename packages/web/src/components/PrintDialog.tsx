import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import type { Song } from '../types';
import { parseChordPro } from '../lib/chordPro';
import { chordsUsed, printSong } from '../lib/printSheet';
import { getChord } from '../data/chordLibrary';
import { ChordDiagram } from './ChordDiagram';

interface PrintDialogProps {
  song: Song;
  open: boolean;
  onClose: () => void;
  /** The transposition and capo that are on the screen. */
  transpose?: number;
  capo?: number;
  preferFlats?: boolean;
}

/**
 * Printing a song.
 *
 * A player needs a page they can put on a stand, so the sheet is the song as
 * it is on the screen, and the changes of the song are there too for anyone
 * who wants to see what it does. The shapes of the chords can be drawn for
 * anyone who does not read a chord chart.
 */
export const PrintDialog: React.FC<PrintDialogProps> = ({
  song,
  open,
  onClose,
  transpose = 0,
  capo = 0,
  preferFlats,
}) => {
  const [layout, setLayout] = useState<'chords' | 'chart'>('chords');
  const [diagrams, setDiagrams] = useState(false);
  const [fontSize, setFontSize] = useState(12);
  const [blocked, setBlocked] = useState(false);

  // The shapes are drawn in the app, and the drawing is what is printed, so
  // that the page and the app agree about what a chord looks like.
  const shapes = useRef<Record<string, HTMLDivElement | null>>({});

  const chords = useMemo(() => chordsUsed(parseChordPro(song.content)), [song.content]);

  const handlePrint = () => {
    const markup: Record<string, string> = {};

    if (diagrams) {
      chords.forEach((chord) => {
        const svg = shapes.current[chord]?.querySelector('svg');
        if (svg) markup[chord] = svg.outerHTML;
      });
    }

    const opened = printSong(
      song,
      { transpose, capo, preferFlats, layout, diagrams, fontSize },
      markup
    );

    if (!opened) {
      setBlocked(true);
      return;
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Print {song.title}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {blocked && (
            <Alert severity="warning">
              The browser blocked the print window. Allow pop-ups for this site, or print from the
              menu of the browser.
            </Alert>
          )}

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              What to print
            </Typography>
            <ToggleButtonGroup
              value={layout}
              exclusive
              onChange={(_, value) => value && setLayout(value)}
              size="small"
              aria-label="What to print"
            >
              <ToggleButton value="chords">The song</ToggleButton>
              <ToggleButton value="chart">The changes</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              The size of the words
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <input
                type="range"
                min={9}
                max={20}
                value={fontSize}
                onChange={(event) => setFontSize(Number(event.target.value))}
                aria-label="The size of the words"
                style={{ flex: 1 }}
              />
              <Typography variant="body2" sx={{ minWidth: 46 }}>
                {fontSize} points
              </Typography>
            </Stack>
          </Box>

          <FormControlLabel
            control={
              <Switch checked={diagrams} onChange={(event) => setDiagrams(event.target.checked)} />
            }
            label="Draw the shapes of the chords"
          />

          {diagrams && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                The chords
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {chords.map((chord) => {
                  const definition = getChord(chord);
                  if (!definition) return null;
                  return (
                    <Box
                      key={chord}
                      ref={(element: HTMLDivElement | null) => {
                        shapes.current[chord] = element;
                      }}
                      sx={{ textAlign: 'center' }}
                    >
                      <ChordDiagram
                        variation={definition.variations[0]}
                        chordName={definition.name}
                      />
                      <Typography variant="caption" fontFamily="monospace" fontWeight="bold">
                        {chord}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handlePrint}>
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};
