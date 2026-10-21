import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSetlistStore } from '../store/setlistStore';
import type { Song, SongFilter } from '../types';
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
  useMediaQuery,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HistoryIcon from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import SettingsIcon from '@mui/icons-material/Settings';

interface NavigationMenuProps {
  songs: Song[];
  activeFilter: SongFilter | null;
  onFilterChange: (filter: SongFilter | null) => void;
  open: boolean;
  onClose?: () => void;
}

const DRAWER_WIDTH = 280;

const ALL_KEYS = [
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
  'Cm',
  'C#m',
  'Dm',
  'D#m',
  'Ebm',
  'Em',
  'Fm',
  'F#m',
  'Gm',
  'G#m',
  'Am',
  'A#m',
  'Bbm',
  'Bm',
];

/**
 * The way round the app.
 *
 * On a big screen it is always there, beside the music. On a phone it is a
 * drawer that slides in, and the bottom bar carries the main places.
 */
export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  songs,
  activeFilter,
  onFilterChange,
  open,
  onClose,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
  const navigate = useNavigate();
  const location = useLocation();
  const setlists = useSetlistStore((s) => s.setlists);
  const createSetlist = useSetlistStore((s) => s.createSetlist);

  const [keysExpanded, setKeysExpanded] = React.useState(false);
  const [artistsExpanded, setArtistsExpanded] = React.useState(false);
  const [tagsExpanded, setTagsExpanded] = React.useState(false);
  const [setlistsExpanded, setSetlistsExpanded] = React.useState(false);

  const path = location.pathname;

  const artists = useMemo(() => {
    const artistMap = new Map<string, number>();
    songs.forEach((song) => {
      artistMap.set(song.artist, (artistMap.get(song.artist) || 0) + 1);
    });
    return Array.from(artistMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [songs]);

  const tags = useMemo(() => {
    const tagMap = new Map<string, number>();
    songs.forEach((song) => {
      song.tags?.forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [songs]);

  const favouriteCount = useMemo(() => songs.filter((song) => song.favorite).length, [songs]);

  const mineCount = useMemo(
    () => songs.filter((song) => song.origin === 'user' || song.origin === 'import').length,
    [songs]
  );

  const knownCount = useMemo(() => songs.filter((song) => song.known).length, [songs]);

  const playedCount = useMemo(
    () => songs.filter((song) => (song.playCount ?? 0) > 0).length,
    [songs]
  );

  const availableKeys = useMemo(() => {
    const keySet = new Set(songs.map((s) => s.key).filter(Boolean) as string[]);
    return ALL_KEYS.filter((key) => keySet.has(key));
  }, [songs]);

  const closeIfMobile = () => {
    if (isMobile && onClose) onClose();
  };

  const handleFilterClick = (
    type: 'tag' | 'artist' | 'key' | 'favourite' | 'mine' | 'played' | 'popular' | 'known',
    value: string
  ) => {
    if (activeFilter?.type === type && activeFilter?.value === value) {
      onFilterChange(null);
    } else {
      onFilterChange({ type, value });
    }
    closeIfMobile();
  };

  const handleClearAll = () => {
    onFilterChange(null);
    closeIfMobile();
  };

  const goTo = (target: string) => {
    navigate(target);
    closeIfMobile();
  };

  /** Whether a place in the app is the one being looked at. */
  const isHere = (target: string): boolean =>
    target === '/' ? path === '/' : path.startsWith(target);

  const drawerContent = (
    <Box
      component="nav"
      aria-label="Main"
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">
          Chorde
        </Typography>
        {isMobile && onClose && (
          <IconButton onClick={onClose} size="small" aria-label="Close navigation menu">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Divider />

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

      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
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
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent',
        }}
      >
        <List sx={{ py: 0 }}>
          {/* Where you can go */}
          <ListItem disablePadding>
            <ListItemButton
              selected={isHere('/')}
              aria-current={isHere('/') ? 'page' : undefined}
              onClick={() => {
                handleClearAll();
                goTo('/');
              }}
            >
              <MusicNoteIcon sx={{ mr: 2, color: 'action.active' }} />
              <ListItemText
                primary="Songs"
                secondary={`${songs.length} ${songs.length === 1 ? 'song' : 'songs'}`}
                primaryTypographyProps={{ fontWeight: isHere('/') ? 'bold' : 'normal' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              selected={isHere('/chords')}
              aria-current={isHere('/chords') ? 'page' : undefined}
              onClick={() => goTo('/chords')}
            >
              <LibraryMusicIcon sx={{ mr: 2, color: 'action.active' }} />
              <ListItemText
                primary="Chords"
                primaryTypographyProps={{ fontWeight: isHere('/chords') ? 'bold' : 'normal' }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              selected={isHere('/import')}
              aria-current={isHere('/import') ? 'page' : undefined}
              onClick={() => goTo('/import')}
            >
              <DownloadIcon sx={{ mr: 2, color: 'action.active' }} />
              <ListItemText
                primary="Import"
                primaryTypographyProps={{ fontWeight: isHere('/import') ? 'bold' : 'normal' }}
              />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ my: 1 }} />

          <ListItem disablePadding>
            <ListItemButton
              selected={activeFilter?.type === 'mine'}
              onClick={() => handleFilterClick('mine', 'true')}
            >
              <EditIcon sx={{ mr: 2, color: 'action.active' }} />
              <ListItemText
                primary="My Songs"
                secondary={`${mineCount} ${mineCount === 1 ? 'song' : 'songs'}`}
                primaryTypographyProps={{
                  fontWeight: activeFilter?.type === 'mine' ? 'bold' : 'normal',
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              selected={activeFilter?.type === 'favourite'}
              onClick={() => handleFilterClick('favourite', 'true')}
            >
              <StarIcon sx={{ mr: 2, color: 'action.active' }} />
              <ListItemText
                primary="Favourites"
                secondary={`${favouriteCount} ${favouriteCount === 1 ? 'song' : 'songs'}`}
                primaryTypographyProps={{
                  fontWeight: activeFilter?.type === 'favourite' ? 'bold' : 'normal',
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              selected={activeFilter?.type === 'known'}
              onClick={() => handleFilterClick('known', 'true')}
            >
              <CheckCircleIcon sx={{ mr: 2, color: 'action.active' }} />
              <ListItemText
                primary="Songs I Know"
                secondary={`${knownCount} ${knownCount === 1 ? 'song' : 'songs'}`}
                primaryTypographyProps={{
                  fontWeight: activeFilter?.type === 'known' ? 'bold' : 'normal',
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              selected={activeFilter?.type === 'played'}
              onClick={() => handleFilterClick('played', 'true')}
            >
              <HistoryIcon sx={{ mr: 2, color: 'action.active' }} />
              <ListItemText
                primary="Recently Played"
                secondary={`${playedCount} ${playedCount === 1 ? 'song' : 'songs'}`}
                primaryTypographyProps={{
                  fontWeight: activeFilter?.type === 'played' ? 'bold' : 'normal',
                }}
              />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ my: 1 }} />

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
              {availableKeys.map((key) => (
                <ListItemButton
                  key={key}
                  sx={{ pl: 7 }}
                  selected={activeFilter?.type === 'key' && activeFilter?.value === key}
                  onClick={() => {
                    navigate(`/key/${encodeURIComponent(key)}`);
                    closeIfMobile();
                  }}
                >
                  <ListItemText
                    primary={key}
                    primaryTypographyProps={{
                      fontWeight:
                        activeFilter?.type === 'key' && activeFilter?.value === key
                          ? 'bold'
                          : 'normal',
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

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
              {artists.map((artist) => (
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
                      fontWeight:
                        activeFilter?.type === 'artist' && activeFilter?.value === artist.name
                          ? 'bold'
                          : 'normal',
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

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
              {tags.map((tag) => (
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
                      fontWeight:
                        activeFilter?.type === 'tag' && activeFilter?.value === tag.name
                          ? 'bold'
                          : 'normal',
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          <Divider sx={{ my: 1 }} />

          <ListItem disablePadding>
            <ListItemButton onClick={() => setSetlistsExpanded(!setlistsExpanded)}>
              <QueueMusicIcon sx={{ mr: 2, color: 'action.active' }} />
              <ListItemText primary="Setlists" />
              <Badge badgeContent={setlists.length} color="primary" sx={{ mr: 2 }}>
                <Box sx={{ width: 0 }} />
              </Badge>
              {setlistsExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={setlistsExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 7 }}
                onClick={() => {
                  const name = prompt('Setlist name?');
                  if (name) {
                    const sl = createSetlist(name);
                    navigate(`/setlist/${sl.id}`);
                    closeIfMobile();
                  }
                }}
              >
                <AddIcon sx={{ mr: 1 }} fontSize="small" />
                <ListItemText primary="New Setlist" />
              </ListItemButton>
              {setlists.map((sl) => (
                <ListItemButton
                  key={sl.id}
                  sx={{ pl: 7 }}
                  selected={isHere(`/setlist/${sl.id}`)}
                  onClick={() => goTo(`/setlist/${sl.id}`)}
                >
                  <ListItemText primary={sl.name} secondary={`${sl.songs.length} songs`} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          <Divider sx={{ my: 1 }} />

          <ListItem disablePadding>
            <ListItemButton
              selected={isHere('/settings')}
              aria-current={isHere('/settings') ? 'page' : undefined}
              onClick={() => goTo('/settings')}
            >
              <SettingsIcon sx={{ mr: 2, color: 'action.active' }} />
              <ListItemText
                primary="Settings"
                primaryTypographyProps={{ fontWeight: isHere('/settings') ? 'bold' : 'normal' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
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
          // The sidebar is as tall as the app, so it stays in view while the
          // music scrolls past it.
          height: '100%',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
