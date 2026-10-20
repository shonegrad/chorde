import React, { useMemo, useState } from 'react';
import { Box, Chip, Stack, TextField, Typography } from '@mui/material';
import { suggestChords } from '../../lib/chordSuggestions';

interface ChordPaletteProps {
  /** Called with the chord that was chosen. */
  onPick: (chord: string) => void;
  /** The key of the song, so the chords that fit are offered first. */
  songKey?: string;
}

/**
 * A palette of chords to choose from while writing.
 *
 * The chords of the key come first, because those are the ones you are
 * probably reaching for.
 */
export const ChordPalette: React.FC<ChordPaletteProps> = ({ onPick, songKey }) => {
  const [query, setQuery] = useState('');

  const chords = useMemo(() => suggestChords(query, songKey, query ? 40 : 16), [query, songKey]);

  return (
    <Box aria-label="Chord palette">
      <TextField
        size="small"
        fullWidth
        label="Find a chord"
        placeholder="Type to search, e.g. m7"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        inputProps={{ 'aria-label': 'Find a chord' }}
        sx={{ mb: 1.5 }}
      />
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 0.75 }}>
        {chords.map((chord) => (
          <Chip
            key={chord}
            label={chord}
            size="small"
            variant="outlined"
            onClick={() => onPick(chord)}
            sx={{ fontFamily: 'monospace', fontWeight: 600 }}
          />
        ))}
      </Stack>
      {chords.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No chord matches that.
        </Typography>
      )}
    </Box>
  );
};
