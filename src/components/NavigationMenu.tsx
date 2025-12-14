import React, { useMemo } from 'react';
import type { Song } from '../types';
import { APP_VERSION } from '../version';
import {
    Drawer,
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    IconButton,
    Chip,
    Stack,
    Collapse,
    Badge,
    useTheme,
    useMediaQuery
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface NavigationMenuProps {
    songs: Song[];
    activeFilter: { type: 'tag' | 'artist' | 'key'; value: string } | null;
    onFilterChange: (filter: { type: 'tag' | 'artist' | 'key'; value: string } | null) => void;
    open: boolean;
    onClose?: () => void;
}

const DRAWER_WIDTH = 280;

// All musical keys
const ALL_KEYS = [
    'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B',
    'Cm', 'C#m', 'Dm', 'D#m', 'Ebm', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bbm', 'Bm'
];

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
    songs,
    activeFilter,
    onFilterChange,
    open,
    onClose
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [keysExpanded, setKeysExpanded] = React.useState(false);
    const [artistsExpanded, setArtistsExpanded] = React.useState(false);
    const [tagsExpanded, setTagsExpanded] = React.useState(false);

    // Extract unique artists and their song counts
    const artists = useMemo(() => {
        const artistMap = new Map<string, number>();
        songs.forEach(song => {
            artistMap.set(song.artist, (artistMap.get(song.artist) || 0) + 1);
        });
        return Array.from(artistMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [songs]);

    // Extract unique tags and their song counts
    const tags = useMemo(() => {
        const tagMap = new Map<string, number>();
        songs.forEach(song => {
            song.tags?.forEach(tag => {
                tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
            });
        });
        return Array.from(tagMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [songs]);

    // Extract keys present in the library
    const availableKeys = useMemo(() => {
        const keySet = new Set(songs.map(s => s.key).filter(Boolean) as string[]);
        return ALL_KEYS.filter(key => keySet.has(key));
    }, [songs]);

    const handleFilterClick = (type: 'tag' | 'artist' | 'key', value: string) => {
        if (activeFilter?.type === type && activeFilter?.value === value) {
            onFilterChange(null); // Deselect if clicking the same filter
        } else {
            onFilterChange({ type, value });
        }
        if (isMobile && onClose) {
            onClose();
        }
    };

    const handleClearAll = () => {
        onFilterChange(null);
        if (isMobile && onClose) {
            onClose();
        }
    };

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Browse</Typography>
                {isMobile && onClose && (
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>

            <Divider />

            {/* Active Filter Display */}
            {activeFilter && (
                <Box sx={{ p: 2, bgcolor: 'action.hover' }}>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                        <Chip
                            label={`${activeFilter.type}: ${activeFilter.value}`}
                            onDelete={handleClearAll}
                            color="primary"
                            size="small"
                        />
                    </Stack>
                </Box>
            )}

            {/* Navigation Items */}
            <Box sx={{
                flexGrow: 1,
                overflowY: 'auto',
                // Custom scrollbar styling - subtle and doesn't affect width
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: 'rgba(0, 0, 0, 0.3)',
                },
                // Firefox
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
            }}>
                <List sx={{ py: 0 }}>
                    {/* All Songs */}
                    <ListItem disablePadding>
                        <ListItemButton
                            selected={!activeFilter}
                            onClick={handleClearAll}
                        >
                            <MusicNoteIcon sx={{ mr: 2, color: 'action.active' }} />
                            <ListItemText
                                primary="All Songs"
                                secondary={`${songs.length} total`}
                                primaryTypographyProps={{ fontWeight: !activeFilter ? 'bold' : 'normal' }}
                            />
                        </ListItemButton>
                    </ListItem>

                    <Divider sx={{ my: 1 }} />

                    {/* Keys Section */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setKeysExpanded(!keysExpanded)}>
                            <KeyIcon sx={{ mr: 2, color: 'action.active' }} />
                            <ListItemText primary="By Key" />
                            <Badge badgeContent={availableKeys.length} color="primary" sx={{ mr: 2 }}>
                                <Box sx={{ width: 0 }} />
                            </Badge>
                            {keysExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={keysExpanded} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {availableKeys.map(key => (
                                <ListItemButton
                                    key={key}
                                    sx={{ pl: 7 }}
                                    selected={activeFilter?.type === 'key' && activeFilter?.value === key}
                                    onClick={() => handleFilterClick('key', key)}
                                >
                                    <ListItemText
                                        primary={key}
                                        primaryTypographyProps={{
                                            fontWeight: activeFilter?.type === 'key' && activeFilter?.value === key ? 'bold' : 'normal'
                                        }}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>

                    <Divider sx={{ my: 1 }} />

                    {/* Artists Section */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setArtistsExpanded(!artistsExpanded)}>
                            <PersonIcon sx={{ mr: 2, color: 'action.active' }} />
                            <ListItemText primary="By Artist" />
                            <Badge badgeContent={artists.length} color="primary" sx={{ mr: 2 }}>
                                <Box sx={{ width: 0 }} />
                            </Badge>
                            {artistsExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={artistsExpanded} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {artists.map(artist => (
                                <ListItemButton
                                    key={artist.name}
                                    sx={{ pl: 7 }}
                                    selected={activeFilter?.type === 'artist' && activeFilter?.value === artist.name}
                                    onClick={() => handleFilterClick('artist', artist.name)}
                                >
                                    <ListItemText
                                        primary={artist.name}
                                        secondary={`${artist.count} song${artist.count !== 1 ? 's' : ''}`}
                                        primaryTypographyProps={{
                                            fontWeight: activeFilter?.type === 'artist' && activeFilter?.value === artist.name ? 'bold' : 'normal'
                                        }}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>

                    <Divider sx={{ my: 1 }} />

                    {/* Tags/Genres Section */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setTagsExpanded(!tagsExpanded)}>
                            <LocalOfferIcon sx={{ mr: 2, color: 'action.active' }} />
                            <ListItemText primary="By Genre/Tag" />
                            <Badge badgeContent={tags.length} color="primary" sx={{ mr: 2 }}>
                                <Box sx={{ width: 0 }} />
                            </Badge>
                            {tagsExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={tagsExpanded} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {tags.map(tag => (
                                <ListItemButton
                                    key={tag.name}
                                    sx={{ pl: 7 }}
                                    selected={activeFilter?.type === 'tag' && activeFilter?.value === tag.name}
                                    onClick={() => handleFilterClick('tag', tag.name)}
                                >
                                    <ListItemText
                                        primary={tag.name}
                                        secondary={`${tag.count} song${tag.count !== 1 ? 's' : ''}`}
                                        primaryTypographyProps={{
                                            fontWeight: activeFilter?.type === 'tag' && activeFilter?.value === tag.name ? 'bold' : 'normal'
                                        }}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>
                </List>
            </Box>

            {/* Version Footer */}
            <Box sx={{
                p: 2,
                borderTop: 1,
                borderColor: 'divider',
                textAlign: 'center'
            }}>
                <Typography variant="caption" color="text.secondary">
                    v{APP_VERSION}
                </Typography>
            </Box>
        </Box>
    );

    if (isMobile) {
        return (
            <Drawer
                anchor="left"
                open={open}
                onClose={onClose}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        );
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    position: 'relative',
                    height: '100vh',
                    borderRight: `1px solid ${theme.palette.divider}`,
                },
            }}
        >
            {drawerContent}
        </Drawer>
    );
};
