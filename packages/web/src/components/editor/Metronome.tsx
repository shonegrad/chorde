import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

interface MetronomeProps {
  /** The tempo in beats a minute. */
  bpm?: number;
  /** Called when the user taps a tempo. */
  onTempoChange?: (bpm: number) => void;
}

const DEFAULT_BPM = 120;

/**
 * A metronome to write against.
 *
 * It ticks on the beat, so a song written to it keeps its tempo.
 */
export const Metronome: React.FC<MetronomeProps> = ({ bpm, onTempoChange }) => {
  const [tempo, setTempo] = useState(bpm ?? DEFAULT_BPM);
  const [lastBpm, setLastBpm] = useState(bpm);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tapTimes = useRef<number[]>([]);

  // Follow the tempo of the song when it changes, without an extra render pass.
  if (bpm !== undefined && bpm !== lastBpm) {
    setLastBpm(bpm);
    setTempo(bpm);
  }

  const click = useCallback((accent: boolean) => {
    if (typeof window === 'undefined') return;

    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: new () => AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;

    if (!audioRef.current) audioRef.current = new AudioContextCtor();
    const ctx = audioRef.current;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'square';
    oscillator.frequency.value = accent ? 1400 : 1000;
    gain.gain.value = accent ? 0.16 : 0.09;

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    oscillator.start(now);
    oscillator.stop(now + 0.06);
  }, []);

  useEffect(() => {
    if (!playing) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    // The first beat is louder so the bar can be found by ear.
    let beat = 0;
    const interval = setInterval(() => {
      click(beat % 4 === 0);
      beat += 1;
    }, 60000 / tempo);

    timerRef.current = interval;
    return () => clearInterval(interval);
  }, [playing, tempo, click]);

  const handleTap = () => {
    const now = Date.now();
    const times = [...tapTimes.current.filter((time) => now - time < 2000), now];
    tapTimes.current = times;

    if (times.length >= 2) {
      let total = 0;
      for (let index = 1; index < times.length; index += 1) {
        total += times[index] - times[index - 1];
      }
      const average = total / (times.length - 1);
      const tapped = Math.round(60000 / average);
      setTempo(tapped);
      onTempoChange?.(tapped);
    }
  };

  const changeTempo = (value: number) => {
    setTempo(value);
    onTempoChange?.(value);
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Metronome
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          size="small"
          type="number"
          label="Tempo"
          value={tempo}
          onChange={(event) => changeTempo(Number(event.target.value) || DEFAULT_BPM)}
          inputProps={{ min: 20, max: 320, 'aria-label': 'Metronome tempo' }}
          sx={{ width: 110 }}
        />
        <Tooltip title={playing ? 'Stop' : 'Play'}>
          <IconButton
            onClick={() => setPlaying((value) => !value)}
            color={playing ? 'primary' : 'default'}
            aria-label={playing ? 'Stop the metronome' : 'Play the metronome'}
          >
            {playing ? <StopIcon /> : <PlayArrowIcon />}
          </IconButton>
        </Tooltip>
        <Button size="small" variant="outlined" startIcon={<MusicNoteIcon />} onClick={handleTap}>
          Tap
        </Button>
      </Stack>
    </Box>
  );
};
