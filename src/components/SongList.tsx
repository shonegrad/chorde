import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Song } from '../types';
import {
    Container,
    Typography,
    Button,
    TextField,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Stack,
    Box,
    InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import DownloadIcon from '@mui/icons-material/Download';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';

interface SongListProps {
    songs: Song[];
    onSelect: (song: Song) => void;
    onCreate: () => void;
    onImportNav: () => void;
    onChordsNav: () => void;
}

export const SongList: React.FC<SongListProps> = ({ songs, onSelect, onCreate, onImportNav, onChordsNav }) => {
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Extract all unique tags
    const allTags = useMemo(() =>
        Array.from(new Set(songs.flatMap(s => s.tags || []))).sort(),
        [songs]);

    const filtered = useMemo(() => songs.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
            s.artist.toLowerCase().includes(search.toLowerCase());
        const matchesTag = !selectedTag || (s.tags && s.tags.includes(selectedTag));
        return matchesSearch && matchesTag;
    }), [songs, search, selectedTag]);

    const [visibleCount, setVisibleCount] = useState(12);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setVisibleCount(12);
    }, [search, selectedTag]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setVisibleCount(prev => prev + 12);
            }
        });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [filtered.length]); // Re-attach if list changes

    const visibleSongs = filtered.slice(0, visibleCount);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h3" component="h1" fontWeight="bold">
                    My Songs ({filtered.length})
                </Typography>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<DownloadIcon />}
                        onClick={onImportNav}
                    >
                        Import
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<LibraryMusicIcon />}
                        onClick={onChordsNav}
                    >
                        Chord Library
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={onCreate}
                        sx={{ fontWeight: 'bold' }}
                    >
                        New Song
                    </Button>
                </Stack>
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search songs, artists..."
                value={search}
                onChange={e => setSearch(e.target.value)}
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

            {/* Tag filter */}
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 4, gap: 1 }} useFlexGap>
                <Chip
                    label="All"
                    onClick={() => setSelectedTag(null)}
                    color={!selectedTag ? "primary" : "default"}
                    variant={!selectedTag ? "filled" : "outlined"}
                    clickable
                />
                {allTags.map(tag => (
                    <Chip
                        key={tag}
                        label={tag}
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                        color={selectedTag === tag ? "primary" : "default"}
                        variant={selectedTag === tag ? "filled" : "outlined"}
                        clickable
                    />
                ))}
            </Stack>

            <Grid container spacing={3}>
                {visibleSongs.map(song => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={song.id}>
                        <Card sx={{
                            height: '100%',
                            transition: 'all 0.2s',
                            '&:hover': { transform: 'translateY(-4px)' }
                        }}>
                            <CardActionArea onClick={() => onSelect(song)} sx={{ height: '100%', display: 'flex', alignItems: 'start', justifyContent: 'start', flexDirection: 'column' }}>
                                <CardContent sx={{ width: '100%' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                        <Typography variant="h5" component="h2" fontWeight="bold">
                                            {song.title}
                                        </Typography>
                                        <MusicNoteIcon color="action" fontSize="small" />
                                    </Box>

                                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                        {song.artist}
                                    </Typography>

                                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                        {song.key && (
                                            <Typography variant="body2" color="text.secondary">
                                                Key: <strong>{song.key}</strong>
                                            </Typography>
                                        )}
                                        {song.capo && song.capo > 0 && (
                                            <Typography variant="body2" color="primary">
                                                Capo: {song.capo}
                                            </Typography>
                                        )}
                                    </Stack>

                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 0.5 }}>
                                        {song.tags?.map(tag => (
                                            <Chip key={tag} label={tag} size="small" variant="filled" sx={{ borderRadius: 1, bgcolor: 'action.hover' }} />
                                        ))}
                                    </Stack>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}

                {visibleSongs.length < filtered.length && (
                    <div ref={loadMoreRef} style={{ width: '100%', height: '20px', margin: '20px 0' }} />
                )}

                {filtered.length === 0 && (
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                            <MusicNoteIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                            <Typography variant="h6">No songs found</Typography>
                            <Typography>Try adjusting your search query or filters.</Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};
