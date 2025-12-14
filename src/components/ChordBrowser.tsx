import { useState, useMemo } from 'react';
import { CHORD_LIBRARY } from '../data/chordLibrary';
import { ChordDiagram } from './ChordDiagram';
import { ChordModal } from './ChordModal';
import { playChord, resumeAudioContext } from '../lib/audio';
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
    IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Chord type categories
const CHORD_TYPES = [
    { id: 'all', label: 'All', filter: () => true },
    { id: 'major', label: 'Major', filter: (name: string) => /^[A-G][#b]?$/.test(name) },
    { id: 'minor', label: 'Minor', filter: (name: string) => /m($|[^a])/.test(name) && !name.includes('maj') },
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
    const [playingChord, setPlayingChord] = useState<string | null>(null);

    // Get all chords as array
    const allChords = Object.values(CHORD_LIBRARY).map(def => ({
        chordName: def.name,
        ...def
    }));

    // Filter chords
    const filteredChords = useMemo(() => {
        let chords = allChords;

        // Filter by type
        if (selectedType !== 'all') {
            const typeFilter = CHORD_TYPES.find(t => t.id === selectedType)?.filter;
            if (typeFilter) {
                chords = chords.filter(c => typeFilter(c.chordName));
            }
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            chords = chords.filter(c =>
                c.chordName.toLowerCase().includes(query) ||
                c.fullName.toLowerCase().includes(query)
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

        setPlayingChord(chordName);

        // Get the first variation's fret positions
        const variation = chord.variations[0];

        // Convert fret positions to notes (using standard tuning)
        // Standard tuning: E2, A2, D3, G3, B3, E4
        const standardTuning = [
            { note: 'E', octave: 2 },
            { note: 'A', octave: 2 },
            { note: 'D', octave: 3 },
            { note: 'G', octave: 3 },
            { note: 'B', octave: 3 },
            { note: 'E', octave: 4 },
        ];
        const frequencies: number[] = [];

        variation.frets.forEach((fret, stringIndex) => {
            if (fret === 'x') return; // Muted string

            const stringDef = standardTuning[stringIndex];
            // noteToFrequency returns Hz, despite the variable name in original code suggesting MIDI
            const openStringFreq = noteToFrequency(stringDef.note, stringDef.octave);

            // Each fret is a semitone
            const fretNumber = typeof fret === 'number' ? fret : 0;
            const frequency = openStringFreq * Math.pow(2, fretNumber / 12);

            frequencies.push(frequency);
        });

        playChord(frequencies, 1.5);

        // Clear playing state after audio finishes
        setTimeout(() => setPlayingChord(null), 1500);
    };

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
                        sx: { borderRadius: 2 }
                    }}
                />

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                    {CHORD_TYPES.map(type => (
                        <Chip
                            key={type.id}
                            label={type.label}
                            onClick={() => setSelectedType(type.id)}
                            color={selectedType === type.id ? "primary" : "default"}
                            variant={selectedType === type.id ? "filled" : "outlined"}
                            clickable
                        />
                    ))}
                </Stack>
            </Box>

            {/* Chord Grid */}
            <Grid container spacing={3}>
                {filteredChords.map(chord => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={chord.chordName}>
                        <Card
                            sx={{
                                height: '100%',
                                transition: 'all 0.2s',
                                border: selectedChord === chord.chordName ? 1 : 0,
                                borderColor: 'primary.main',
                                '&:hover': { transform: 'translateY(-4px)' }
                            }}
                        >
                            <CardActionArea
                                onClick={() => setSelectedChord(chord.chordName)}
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', textAlign: 'left' }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box>
                                            <Typography variant="h5" component="h3" fontWeight="bold" color="primary">
                                                {chord.chordName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {chord.fullName}
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePlayChord(chord.chordName);
                                            }}
                                            disabled={playingChord === chord.chordName}
                                            color={playingChord === chord.chordName ? "primary" : "default"}
                                            size="small"
                                            sx={{ border: 1, borderColor: 'divider' }}
                                        >
                                            {playingChord === chord.chordName ? <VolumeUpIcon /> : <PlayArrowIcon />}
                                        </IconButton>
                                    </Box>

                                    {/* Diagram Preview */}
                                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                        <ChordDiagram
                                            variation={chord.variations[0]}
                                            chordName={chord.chordName}
                                        />
                                    </Box>

                                    {/* Variation Count Badge */}
                                    <Box sx={{ mt: 'auto', pt: 1, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                                        <Typography variant="caption" color="text.secondary">
                                            {chord.variations.length} variations available
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}

                {selectedChord && (
                    <ChordModal
                        chordName={selectedChord}
                        onClose={() => setSelectedChord(null)}
                    />
                )}

                {filteredChords.length === 0 && (
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" color="text.secondary">
                                No chords found matching "{searchQuery}"
                            </Typography>
                            <Button
                                variant="text"
                                onClick={() => setSearchQuery('')}
                                sx={{ mt: 2 }}
                            >
                                Clear search
                            </Button>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}
