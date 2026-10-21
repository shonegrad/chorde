import React, { useState } from 'react';
import { getChord } from '../data/chordLibrary';
import { chordToNotation } from '../lib/nashville';
import { chordInKey } from '../lib/keyDetection';
import { playStrummedChord, resumeAudioContext } from '../lib/audio';
import { voicingForChord } from '../lib/voicings';
import { ChordNotation } from './ChordNotation';
import { spellingOfChord } from '../lib/notation';
import { ChordDiagram } from './ChordDiagram';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface ChordModalProps {
  chordName: string;
  onClose: () => void;
  /** The key of the song, so the chord can be placed in it. */
  songKey?: string;
}

export const ChordModal: React.FC<ChordModalProps> = ({ chordName, onClose, songKey }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const chord = getChord(chordName);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [written, setWritten] = useState<'diagram' | 'tab' | 'notes'>(chord ? 'diagram' : 'notes');

  const handleVariationChange = (_: React.MouseEvent<HTMLElement>, newVariation: number | null) => {
    if (newVariation !== null) {
      setSelectedVariation(newVariation);
    }
  };

  /* Play the chord, so it can be heard as well as seen. */
  const handlePlay = async () => {
    await resumeAudioContext();

    const notes = voicingForChord(chordName);
    if (!notes) return;

    playStrummedChord(notes, 1.5);
  };

  if (!chord) {
    return (
      <Dialog open={true} onClose={onClose} fullScreen={fullScreen} maxWidth="sm" fullWidth>
        <DialogTitle>
          {chordName}
          <Tooltip title="Play this chord">
            <IconButton
              aria-label="Play this chord"
              onClick={handlePlay}
              sx={{
                position: 'absolute',
                right: 48,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}
        >
          <Box sx={{ mb: 3, minHeight: 200, display: 'flex', alignItems: 'center' }}>
            <ChordNotation
              kind="staff"
              chord={chordName}
              songKey={songKey}
              width={200}
              height={95}
            />
          </Box>

          <Typography color="text.secondary" align="center">
            No diagram for this chord yet, but here are the notes it is made of.
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: fullScreen ? 0 : 2 },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pr: 6 }}>
        <Typography variant="h5" component="div" fontWeight="bold">
          {chord.fullName}
        </Typography>
        <Tooltip title="Play this chord">
          <IconButton
            aria-label="Play this chord"
            onClick={handlePlay}
            sx={{
              position: 'absolute',
              right: 48,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <PlayArrowIcon />
          </IconButton>
        </Tooltip>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}
      >
        <Box sx={{ mb: 3, minHeight: 210, display: 'flex', alignItems: 'center' }}>
          {written === 'diagram' && (
            <ChordDiagram variation={chord.variations[selectedVariation]} chordName={chord.name} />
          )}
          {written === 'tab' && (
            <ChordNotation
              kind="tab"
              chord={chord.name}
              frets={chord.variations[selectedVariation].frets}
              width={215}
              height={100}
            />
          )}
          {written === 'notes' && (
            <ChordNotation
              kind="staff"
              chord={chord.name}
              songKey={songKey}
              width={230}
              height={115}
            />
          )}
        </Box>

        {/* How the chord is written out. */}
        <ToggleButtonGroup
          value={written}
          exclusive
          onChange={(_event, value) => {
            if (value) setWritten(value);
          }}
          aria-label="How the chord is written"
          size="small"
          sx={{ mb: 3 }}
        >
          <ToggleButton value="diagram">Diagram</ToggleButton>
          <ToggleButton value="tab">Tab</ToggleButton>
          <ToggleButton value="notes">Notes</ToggleButton>
        </ToggleButtonGroup>

        {/* What the chord is made of, and where it sits in the key. */}
        <Stack spacing={1} sx={{ mb: 3, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
            {chordToNotation(chord.name)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
            {spellingOfChord(chord.name)}
          </Typography>
          {songKey && (
            <Typography variant="body2" color="text.secondary">
              {(() => {
                const place = chordInKey(chord.name, songKey);
                if (!place) return '';
                if (!place.fits) {
                  return `Not a chord in ${songKey}`;
                }
                return `The ${place.degree} in ${songKey}`;
              })()}
            </Typography>
          )}
        </Stack>

        {chord.variations.length > 1 && (
          <ToggleButtonGroup
            value={selectedVariation}
            exclusive
            onChange={handleVariationChange}
            aria-label="chord variation"
            size="small"
            sx={{
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 0.5,
              '& .MuiToggleButton-root': {
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                px: 2,
                py: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.soft',
                  color: 'primary.main',
                  fontWeight: 'bold',
                },
              },
            }}
          >
            {chord.variations.map((v, i) => (
              <ToggleButton key={i} value={i} disableRipple>
                {v.suffix || `Var ${i + 1}`}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      </DialogContent>
    </Dialog>
  );
};
