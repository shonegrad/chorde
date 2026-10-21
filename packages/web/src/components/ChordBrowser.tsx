import { useState, useMemo } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { CHORD_LIBRARY, type ChordVariation } from '../data/chordLibrary';
import { chordsOfKey, notesOfScale, SCALE_KEYS } from '../lib/keyDetection';
import { deleteCustomChord, saveCustomChord, useCustomChords } from '../lib/customChords';
import { chordsByUse } from '../lib/frequentChords';
import { useLibraryStore } from '../store/libraryStore';
import { ChordDiagram } from './ChordDiagram';
import { ChordDiagramEditor } from './ChordDiagramEditor';
import { ChordModal } from './ChordModal';
import { playScale, playStrummedChord, resumeAudioContext } from '../lib/audio';
import { voicingForChord } from '../lib/voicings';
import { noteToFrequency } from '../lib/scales';
import {
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Button,
  Chip,
  Stack,
  Box,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// Chord type categories
const CHORD_TYPES = [
  { id: 'all', label: 'All', filter: () => true },
  { id: 'major', label: 'Major', filter: (name: string) => /^[A-G][#b]?$/.test(name) },
  {
    id: 'minor',
    label: 'Minor',
    filter: (name: string) => /m($|[^a])/.test(name) && !name.includes('maj'),
  },
  { id: 'seventh', label: '7th', filter: (name: string) => name.includes('7') },
  { id: 'sus', label: 'Sus', filter: (name: string) => name.includes('sus') },
  { id: 'dim', label: 'Dim', filter: (name: string) => name.includes('dim') },
  { id: 'aug', label: 'Aug', filter: (name: string) => name.includes('+') || name.includes('aug') },
  { id: 'power', label: 'Power', filter: (name: string) => /5$/.test(name) },
  { id: 'slash', label: 'Slash', filter: (name: string) => name.includes('/') },
  { id: 'extended', label: 'Extended', filter: (name: string) => /9|11|13/.test(name) },
];

interface ChordBrowserProps {
  onBack?: () => void;
}

export default function ChordBrowser({ onBack }: ChordBrowserProps) {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [scaleKey, setScaleKey] = useState('C');
  const [playingChord, setPlayingChord] = useState<string | null>(null);
  const [shapeName, setShapeName] = useState('');

  // The shapes the player has drawn for themselves, which are kept between
  // visits.
  const customChords = useCustomChords();

  // The chords the player reaches for most, from the songs they have played.
  const songs = useLibraryStore((state) => state.songs);
  const frequent = useMemo(() => chordsByUse(songs).slice(0, 12), [songs]);

  // Get all chords as array. A shape the player has drawn is the shape for
  // that chord, so it stands in for the library's own.
  const allChords = useMemo(() => {
    const library = Object.values(CHORD_LIBRARY).map((def) => ({
      chordName: def.name,
      ...def,
    }));

    const custom = customChords.map((chord) => ({
      chordName: chord.name,
      ...chord,
    }));

    if (custom.length === 0) return library;

    const names = new Set(custom.map((chord) => chord.chordName));
    return [...library.filter((definition) => !names.has(definition.name)), ...custom];
  }, [customChords]);

  // Filter chords
  const filteredChords = useMemo(() => {
    let chords = allChords;

    // Filter by type
    if (selectedType !== 'all') {
      const typeFilter = CHORD_TYPES.find((t) => t.id === selectedType)?.filter;
      if (typeFilter) {
        chords = chords.filter((c) => typeFilter(c.chordName));
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      chords = chords.filter(
        (c) => c.chordName.toLowerCase().includes(query) || c.fullName.toLowerCase().includes(query)
      );
    }

    // Sort alphabetically
    return chords.sort((a, b) => a.chordName.localeCompare(b.chordName));
  }, [allChords, selectedType, searchQuery]);

  // Play chord audio
  const handlePlayChord = async (chordName: string) => {
    await resumeAudioContext();

    const chord = CHORD_LIBRARY[chordName];
    if (!chord || !chord.variations[0]) return;

    // The shape the app knows is played as the notes it plays, so the chord
    // sounds the way the diagram says it does.
    const notes = voicingForChord(chordName);
    if (!notes) return;

    setPlayingChord(chordName);
    playStrummedChord(notes, 1.5);

    // Clear playing state after audio finishes
    setTimeout(() => setPlayingChord(null), 1500);
  };

  /* Play the scale of the key, up and then back down. */
  const handlePlayScale = async () => {
    await resumeAudioContext();

    const frequencies = notesOfScale(scaleKey).map((note) => noteToFrequency(note, 3));
    if (frequencies.length === 0) return;

    playScale(frequencies, { tempo: 120, ascending: true, descending: true });
  };

  const handleSaveCustomChord = (variation: ChordVariation) => {
    const name = shapeName.trim();
    if (!name) return;
    saveCustomChord(name, variation);
    setShapeName('');
    setEditorOpen(false);
  };

  const editorDialog = (
    <Dialog open={editorOpen} onClose={() => setEditorOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Your own shape</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          size="small"
          label="The chord"
          placeholder="Fmaj7"
          value={shapeName}
          onChange={(event) => setShapeName(event.target.value)}
          helperText="The chord this shape is for. The app will draw your shape for it from now on."
          sx={{ mb: 2 }}
        />
        <ChordDiagramEditor
          chordName={shapeName.trim() || 'your shape'}
          onSave={handleSaveCustomChord}
          onClose={() => setEditorOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        {onBack && (
          <IconButton onClick={onBack} edge="start" aria-label="back">
            <ArrowBackIcon />
          </IconButton>
        )}
        <div>
          <Typography variant="h3" component="h1" fontWeight="bold">
            Chord Library
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {filteredChords.length} {filteredChords.length === 1 ? 'chord' : 'chords'} found
          </Typography>
        </div>
      </Box>

      {/* The chords that fit a key */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="scale-key-label">Key</InputLabel>
            <Select
              labelId="scale-key-label"
              label="Key"
              value={scaleKey}
              onChange={(event) => setScaleKey(event.target.value)}
            >
              {SCALE_KEYS.map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              The notes of {scaleKey}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {notesOfScale(scaleKey).join(' ')}
            </Typography>
          </Box>

          <Tooltip title="Play the scale">
            <IconButton onClick={handlePlayScale} aria-label={`Play the scale of ${scaleKey}`}>
              <VolumeUpIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2, gap: 1 }}>
          {chordsOfKey(scaleKey).map((chord) => (
            <Chip
              key={chord.degree}
              label={`${chord.name} · ${chord.degree}`}
              variant="outlined"
              onClick={() => setSelectedChord(chord.name)}
              sx={{ fontFamily: 'monospace' }}
            />
          ))}
        </Stack>
      </Paper>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search chords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: 2 },
          }}
        />

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
          {CHORD_TYPES.map((type) => (
            <Chip
              key={type.id}
              label={type.label}
              onClick={() => setSelectedType(type.id)}
              color={selectedType === type.id ? 'primary' : 'default'}
              variant={selectedType === type.id ? 'filled' : 'outlined'}
              clickable
            />
          ))}
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setEditorOpen(true)}
            sx={{ ml: 'auto' }}
          >
            Create custom chord
          </Button>
        </Stack>
      </Box>

      {/* The chords the player reaches for most */}
      {frequent.length > 0 && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            The chords you reach for most
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 0.75 }}>
            {frequent.map((usage) => (
              <Chip
                key={usage.chord}
                label={`${usage.chord} · ${usage.count}`}
                size="small"
                color="primary"
                variant="outlined"
                onClick={() => setSelectedChord(usage.chord)}
                clickable
                sx={{ fontFamily: 'monospace', fontWeight: 600 }}
              />
            ))}
          </Stack>
        </Paper>
      )}

      {/* Chord Grid */}
      <Grid container spacing={3}>
        {filteredChords.map((chord) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={chord.chordName}>
            <Card
              sx={{
                height: '100%',
                position: 'relative',
                transition: 'all 0.2s',
                border: selectedChord === chord.chordName ? 1 : 0,
                borderColor: 'primary.main',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <CardActionArea
                onClick={() => setSelectedChord(chord.chordName)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h5" component="h3" fontWeight="bold" color="primary">
                        {chord.chordName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {chord.fullName}
                      </Typography>
                      {customChords.some((entry) => entry.name === chord.chordName) && (
                        <Chip
                          label="Your shape"
                          size="small"
                          color="secondary"
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Diagram Preview */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <ChordDiagram variation={chord.variations[0]} chordName={chord.chordName} />
                  </Box>

                  {/* Variation Count Badge */}
                  <Box
                    sx={{
                      mt: 'auto',
                      pt: 1,
                      borderTop: 1,
                      borderColor: 'divider',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {chord.variations.length} variations available
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>

              {/* The play button sits outside the action area, because a button
                  inside a button is not valid. */}
              <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                {customChords.some((entry) => entry.name === chord.chordName) && (
                  <Tooltip title="Take your shape away">
                    <IconButton
                      onClick={() => deleteCustomChord(chord.chordName)}
                      color="error"
                      size="small"
                      aria-label={`Take your shape for ${chord.chordName} away`}
                      sx={{ border: 1, borderColor: 'divider' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <IconButton
                  onClick={() => handlePlayChord(chord.chordName)}
                  disabled={playingChord === chord.chordName}
                  color={playingChord === chord.chordName ? 'primary' : 'default'}
                  size="small"
                  aria-label={`Play ${chord.chordName}`}
                  sx={{ border: 1, borderColor: 'divider' }}
                >
                  {playingChord === chord.chordName ? <VolumeUpIcon /> : <PlayArrowIcon />}
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}

        {selectedChord && (
          <ChordModal chordName={selectedChord} onClose={() => setSelectedChord(null)} />
        )}

        {filteredChords.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No chords found matching "{searchQuery}"
              </Typography>
              <Button variant="text" onClick={() => setSearchQuery('')} sx={{ mt: 2 }}>
                Clear search
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
      {editorDialog}
    </Container>
  );
}
