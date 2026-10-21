import React, { useMemo, useRef, useState, useEffect } from 'react';
import type { Song, SongFilter, ViewMode } from '../types';
import {
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  Chip,
  Stack,
  Box,
  InputAdornment,
  Alert,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import DownloadIcon from '@mui/icons-material/Download';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import CloseIcon from '@mui/icons-material/Close';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';

import { groupSongs, sortSongs, type GroupBy, type SortOrder } from '../lib/library';
import { parseDuration } from '../lib/duration';

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'title', label: 'Title (A-Z)' },
  { value: 'artist', label: 'Artist (A-Z)' },
  { value: 'key', label: 'Key' },
  { value: 'length', label: 'Length' },
  { value: 'tempo', label: 'Tempo' },
  { value: 'capo', label: 'Capo' },
  { value: 'played', label: 'Recently played' },
  { value: 'popular', label: 'Most played' },
  { value: 'known', label: 'Songs I know first' },
  { value: 'recent', label: 'Recently added' },
  { value: 'favourite', label: 'Favourites first' },
];

const GROUP_OPTIONS: { value: GroupBy; label: string }[] = [
  { value: 'none', label: 'No groups' },
  { value: 'artist', label: 'By artist' },
  { value: 'key', label: 'By key' },
  { value: 'tag', label: 'By tag' },
];

/** The plain lyrics of a song, with the ChordPro markup removed. */
const lyricsOf = (song: Song): string =>
  song.content
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .toLowerCase();

interface SongListProps {
  songs: Song[];
  /** The whole library, used to show every available tag even while filtered. */
  allSongs?: Song[];
  onSelect: (song: Song) => void;
  onCreate: () => void;
  onImportNav: () => void;
  onChordsNav: () => void;
  activeFilter?: SongFilter | null;
  onClearFilter?: () => void;
  /** Choose a tag, or none. The tag is in the URL, so the back button undoes it. */
  onTagFilter?: (tag: string | null) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleFavorite?: (song: Song) => void;
  onDeleteSongs?: (ids: string[]) => void;
  onDuplicateSong?: (song: Song) => void;
  onTagSongs?: (ids: string[], tag: string) => void;
  onTransposeSongs?: (ids: string[], semitones: number) => void;
  onAddToSetlist?: (songIds: string[], setlistId: string) => void;
  setlists?: { id: string; name: string }[];
}

export const SongList: React.FC<SongListProps> = ({
  songs,
  allSongs,
  onSelect,
  onCreate,
  onImportNav,
  onChordsNav,
  activeFilter,
  onClearFilter,
  onTagFilter,
  viewMode,
  onViewModeChange,
  onToggleFavorite,
  onDeleteSongs,
  onDuplicateSong,
  onTagSongs,
  onTransposeSongs,
  onAddToSetlist,
  setlists = [],
}) => {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('title');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [onlyIncomplete, setOnlyIncomplete] = useState(false);
  const [onlyKnown, setOnlyKnown] = useState(false);
  const [searchLyrics, setSearchLyrics] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuSong, setMenuSong] = useState<Song | null>(null);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [tagDraft, setTagDraft] = useState('');
  const [setlistDialogOpen, setSetlistDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [transposeDialogOpen, setTransposeDialogOpen] = useState(false);
  const [transposeDraft, setTransposeDraft] = useState(0);
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);

  /*
   * A filter that is about playing says how the songs should be ordered too.
   *
   * "Recently played" is no use if the songs are then shown by title.
   */
  const impliedSort: SortOrder | undefined =
    activeFilter?.type === 'played'
      ? 'played'
      : activeFilter?.type === 'popular'
        ? 'popular'
        : activeFilter?.type === 'known'
          ? 'known'
          : undefined;

  const [lastImpliedSort, setLastImpliedSort] = useState<string | undefined>(undefined);
  if (impliedSort && impliedSort !== lastImpliedSort) {
    setLastImpliedSort(impliedSort);
    setSortOrder(impliedSort);
  }

  // Every tag in the library, so a tag can be switched to without clearing
  // the current filter first.
  const allTags = useMemo(
    () => Array.from(new Set((allSongs ?? songs).flatMap((s) => s.tags ?? []))).sort(),
    [allSongs, songs]
  );

  /*
   * The tag is in the URL, so that the back button takes back the tag and not
   * the whole library.
   */
  const [localTag, setLocalTag] = useState<string | null>(null);
  const selectedTag = onTagFilter
    ? activeFilter?.type === 'tag'
      ? activeFilter.value
      : null
    : localTag;

  const chooseTag = (tag: string | null) => {
    if (onTagFilter) {
      onTagFilter(tag);
      return;
    }
    setLocalTag(tag);
  };

  const lyricsById = useMemo(() => {
    const map = new Map<string, string>();
    songs.forEach((song) => map.set(song.id, lyricsOf(song)));
    return map;
  }, [songs]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const matches = songs.filter((s) => {
      const matchesSearch =
        !query ||
        s.title.toLowerCase().includes(query) ||
        s.artist.toLowerCase().includes(query) ||
        (searchLyrics && (lyricsById.get(s.id) ?? '').includes(query));
      const matchesTag = !selectedTag || (s.tags && s.tags.includes(selectedTag));
      // A song that is missing something can be found, because a songbook
      // that does not say what key it is in is not finished.
      const matchesComplete =
        !onlyIncomplete || !s.key || !s.duration || parseDuration(s.duration) === undefined;
      // The songs the player says they know.
      const matchesKnown = !onlyKnown || Boolean(s.known);
      return matchesSearch && matchesTag && matchesComplete && matchesKnown;
    });

    return sortSongs(matches, sortOrder);
  }, [songs, search, searchLyrics, selectedTag, sortOrder, lyricsById, onlyIncomplete, onlyKnown]);

  const [visibleCount, setVisibleCount] = useState(12);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Show the first page again whenever the result set changes. Adjusting the
  // state during render avoids an extra pass of rendering.
  const resultKey = `${search}|${searchLyrics}|${selectedTag}|${sortOrder}|${groupBy}|${onlyIncomplete}|${onlyKnown}|${activeFilter?.type ?? ''}:${activeFilter?.value ?? ''}`;
  const [lastResultKey, setLastResultKey] = useState(resultKey);
  if (resultKey !== lastResultKey) {
    setLastResultKey(resultKey);
    setVisibleCount(12);
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + 12);
      }
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [filtered.length]);

  const visibleSongs = filtered.slice(0, visibleCount);

  /*
   * The songs in groups.
   *
   * A songbook is arranged, and a list of songs is not, so the songs can be
   * gathered into groups by artist, key or tag.
   */
  const groups = useMemo(() => groupSongs(visibleSongs, groupBy), [visibleSongs, groupBy]);

  const toggleGroup = (key: string) => {
    setCollapsedGroups((current) =>
      current.includes(key) ? current.filter((entry) => entry !== key) : [...current, key]
    );
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id]
    );
  };

  const leaveSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const openSongMenu = (event: React.MouseEvent<HTMLElement>, song: Song) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setMenuSong(song);
  };

  const closeSongMenu = () => {
    setMenuAnchor(null);
    setMenuSong(null);
  };

  const applyTagToSelection = () => {
    const tag = tagDraft.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && onTagSongs) {
      onTagSongs(selectedIds, tag);
    }
    setTagDraft('');
    setTagDialogOpen(false);
  };

  const addSelectionToSetlist = (setlistId: string) => {
    onAddToSetlist?.(selectedIds, setlistId);
    setSetlistDialogOpen(false);
    leaveSelectionMode();
  };

  const deleteSelection = () => {
    onDeleteSongs?.(selectedIds);
    setConfirmDeleteOpen(false);
    leaveSelectionMode();
  };

  const transposeSelection = () => {
    onTransposeSongs?.(selectedIds, transposeDraft);
    setTransposeDialogOpen(false);
    setTransposeDraft(0);
    leaveSelectionMode();
  };

  const renderCardActions = (song: Song) => (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {onToggleFavorite && (
        <IconButton
          size="small"
          onClick={() => onToggleFavorite(song)}
          aria-label={
            song.favorite ? `Remove ${song.title} from favourites` : `Favourite ${song.title}`
          }
          aria-pressed={Boolean(song.favorite)}
        >
          {song.favorite ? (
            <StarIcon fontSize="small" color="primary" />
          ) : (
            <StarBorderIcon fontSize="small" />
          )}
        </IconButton>
      )}
      <IconButton
        size="small"
        onClick={(event) => openSongMenu(event, song)}
        aria-label={`More actions for ${song.title}`}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
    </Stack>
  );

  const renderSelectionCheckbox = (song: Song) => (
    <Checkbox
      checked={selectedIds.includes(song.id)}
      onChange={() => toggleSelected(song.id)}
      onClick={(event) => event.stopPropagation()}
      inputProps={{ 'aria-label': `Select ${song.title}` }}
    />
  );

  const renderCard = (song: Song) => {
    const cardContent = (
      <CardContent sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1,
            // Room for the action buttons, which sit on top.
            pr: 7,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
            {selectionMode && renderSelectionCheckbox(song)}
            <Typography variant="h5" component="h2" fontWeight="bold">
              {song.title}
            </Typography>
          </Stack>
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
          {(song.capo || 0) > 0 && (
            <Typography variant="body2" color="primary">
              Capo: {song.capo}
            </Typography>
          )}
          {song.known && (
            <Typography variant="body2" color="success.main">
              You know this
            </Typography>
          )}
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 0.5 }}>
          {song.tags?.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="filled"
              sx={{ borderRadius: 1, bgcolor: 'action.hover' }}
            />
          ))}
        </Stack>
      </CardContent>
    );

    return (
      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={song.id}>
        <Card
          sx={{
            height: '100%',
            position: 'relative',
            transition: 'all 0.2s',
            '&:hover': { transform: 'translateY(-4px)' },
          }}
        >
          {selectionMode ? (
            // A plain box in selection mode, so the checkbox is not
            // nested inside a button.
            <Box
              role="button"
              tabIndex={0}
              onClick={() => toggleSelected(song.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  toggleSelected(song.id);
                }
              }}
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'start',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
            >
              {cardContent}
            </Box>
          ) : (
            <CardActionArea
              onClick={() => onSelect(song)}
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'start',
                flexDirection: 'column',
              }}
            >
              {cardContent}
            </CardActionArea>
          )}

          {/* Kept outside the action area so the buttons are not nested. */}
          {!selectionMode && (
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>{renderCardActions(song)}</Box>
          )}
        </Card>
      </Grid>
    );
  };

  const renderRow = (song: Song) => (
    <Paper key={song.id} elevation={0} sx={{ mb: 1, borderRadius: 1, overflow: 'hidden' }}>
      <ListItem disablePadding sx={{ position: 'relative' }}>
        {selectionMode ? (
          // A plain box in selection mode, so the checkbox is not
          // nested inside a button.
          <Box
            role="button"
            tabIndex={0}
            onClick={() => toggleSelected(song.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleSelected(song.id);
              }
            }}
            sx={{ py: 2, pr: 8, cursor: 'pointer' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1.5 }}>
              {renderSelectionCheckbox(song)}
              <MusicNoteIcon color="action" />
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="h6" fontWeight="bold" noWrap>
                  {song.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {song.artist}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                {song.key && <Chip label={song.key} size="small" variant="outlined" />}
                {song.tags?.slice(0, 3).map((tag) => (
                  <Chip key={tag} label={tag} size="small" sx={{ bgcolor: 'action.hover' }} />
                ))}
              </Stack>
            </Box>
          </Box>
        ) : (
          <ListItemButton onClick={() => onSelect(song)} sx={{ py: 2, pr: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1.5 }}>
              <MusicNoteIcon color="action" />
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="h6" fontWeight="bold" noWrap>
                  {song.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {song.artist}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                {song.key && <Chip label={song.key} size="small" variant="outlined" />}
                {(song.capo || 0) > 0 && (
                  <Chip
                    label={`Capo ${song.capo}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {song.tags?.slice(0, 3).map((tag) => (
                  <Chip key={tag} label={tag} size="small" sx={{ bgcolor: 'action.hover' }} />
                ))}
              </Stack>
            </Box>
          </ListItemButton>
        )}

        {/* Kept outside the button so the buttons are not nested. */}
        {!selectionMode && (
          <Box sx={{ position: 'absolute', top: 12, right: 8 }}>{renderCardActions(song)}</Box>
        )}
      </ListItem>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h3" component="h1" fontWeight="bold">
          Songs ({filtered.length})
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {selectionMode ? (
            <>
              <Chip
                label={`${selectedIds.length} selected`}
                color="primary"
                sx={{ alignSelf: 'center' }}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<PlaylistAddIcon />}
                disabled={selectedIds.length === 0 || !onAddToSetlist}
                onClick={() => setSetlistDialogOpen(true)}
              >
                To setlist
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CheckBoxIcon />}
                disabled={selectedIds.length === 0 || !onTagSongs}
                onClick={() => setTagDialogOpen(true)}
              >
                Tag
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<SwapCallsIcon />}
                disabled={selectedIds.length === 0 || !onTransposeSongs}
                onClick={() => setTransposeDialogOpen(true)}
              >
                Transpose
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                disabled={selectedIds.length === 0 || !onDeleteSongs}
                onClick={() => setConfirmDeleteOpen(true)}
              >
                Delete
              </Button>
              <Button variant="text" size="small" onClick={leaveSelectionMode}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CheckBoxIcon />}
                onClick={() => setSelectionMode(true)}
                disabled={filtered.length === 0}
              >
                Select
              </Button>
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
            </>
          )}
        </Stack>
      </Box>

      {activeFilter && (
        <Alert
          severity="info"
          action={
            <IconButton aria-label="close" color="inherit" size="small" onClick={onClearFilter}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 3 }}
        >
          Showing results for{' '}
          <strong>
            {activeFilter.type === 'key'
              ? 'Key'
              : activeFilter.type === 'artist'
                ? 'Artist'
                : activeFilter.type === 'favourite'
                  ? 'Favourites'
                  : activeFilter.type === 'known'
                    ? 'Songs I Know'
                    : activeFilter.type === 'played'
                      ? 'Recently Played'
                      : activeFilter.type === 'popular'
                        ? 'Most Played'
                        : activeFilter.type === 'mine'
                          ? 'My Songs'
                          : 'Tag'}
            :{' '}
            {activeFilter.type === 'favourite' ||
            activeFilter.type === 'mine' ||
            activeFilter.type === 'known' ||
            activeFilter.type === 'played' ||
            activeFilter.type === 'popular'
              ? ''
              : activeFilter.value}
          </strong>
        </Alert>
      )}

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search songs, artists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: 2 },
          }}
        />

        <FormControl variant="outlined" sx={{ minWidth: 180 }}>
          <InputLabel id="sort-order-label">Sort by</InputLabel>
          <Select
            labelId="sort-order-label"
            label="Sort by"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as SortOrder)}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ minWidth: 150 }}>
          <InputLabel id="group-by-label">Group by</InputLabel>
          <Select
            labelId="group-by-label"
            label="Group by"
            value={groupBy}
            onChange={(event) => setGroupBy(event.target.value as GroupBy)}
          >
            {GROUP_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => newMode && onViewModeChange(newMode)}
          aria-label="view mode"
        >
          <ToggleButton value="grid" aria-label="grid view">
            <GridViewIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
        <Chip
          label="All Tags"
          onClick={() => chooseTag(null)}
          color={!selectedTag ? 'primary' : 'default'}
          variant={!selectedTag ? 'filled' : 'outlined'}
          clickable
        />
        {allTags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onClick={() => chooseTag(selectedTag === tag ? null : tag)}
            color={selectedTag === tag ? 'primary' : 'default'}
            variant={selectedTag === tag ? 'filled' : 'outlined'}
            clickable
          />
        ))}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 3 }} alignItems="center" flexWrap="wrap">
        <Chip
          label={searchLyrics ? 'Searching lyrics' : 'Titles and artists only'}
          color={searchLyrics ? 'primary' : 'default'}
          variant="outlined"
          onClick={() => setSearchLyrics((prev) => !prev)}
          clickable
          role="button"
          aria-pressed={searchLyrics}
        />
        <Chip
          label="Missing details"
          color={onlyIncomplete ? 'primary' : 'default'}
          variant={onlyIncomplete ? 'filled' : 'outlined'}
          onClick={() => setOnlyIncomplete((prev) => !prev)}
          clickable
          role="button"
          aria-pressed={onlyIncomplete}
          title="The songs that do not say what key they are in, or how long they take"
        />
        <Chip
          label="Songs I know"
          color={onlyKnown ? 'primary' : 'default'}
          variant={onlyKnown ? 'filled' : 'outlined'}
          onClick={() => setOnlyKnown((prev) => !prev)}
          clickable
          role="button"
          aria-pressed={onlyKnown}
          title="The songs you have learned"
        />
      </Stack>

      {groups.map((group) => (
        <Box key={group.key} sx={{ mb: 4 }}>
          {group.label && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Typography
                variant="h5"
                component="h2"
                fontWeight="bold"
                sx={{ fontFamily: 'var(--font-mono)' }}
              >
                {group.label}
              </Typography>
              <Chip label={group.songs.length} size="small" variant="outlined" />
              <Button
                size="small"
                onClick={() => toggleGroup(group.key)}
                aria-label={`${collapsedGroups.includes(group.key) ? 'Open' : 'Close'} ${group.label}`}
              >
                {collapsedGroups.includes(group.key) ? 'Show' : 'Hide'}
              </Button>
            </Box>
          )}

          {!collapsedGroups.includes(group.key) &&
            (viewMode === 'grid' ? (
              <Grid container spacing={3}>
                {group.songs.map(renderCard)}
              </Grid>
            ) : (
              <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                {group.songs.map(renderRow)}
              </List>
            ))}
        </Box>
      ))}

      {visibleSongs.length < filtered.length && (
        <div ref={loadMoreRef} style={{ width: '100%', height: '20px', margin: '20px 0' }} />
      )}

      {filtered.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <MusicNoteIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6">No songs found</Typography>
          <Typography>Try adjusting your search query or filters.</Typography>
        </Box>
      )}

      {/* Per-song actions */}
      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={closeSongMenu}>
        <MenuItem
          onClick={() => {
            if (menuSong && onDuplicateSong) onDuplicateSong(menuSong);
            closeSongMenu();
          }}
        >
          <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />
          Duplicate
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSelectedIds(menuSong ? [menuSong.id] : []);
            setSetlistDialogOpen(true);
            closeSongMenu();
          }}
          disabled={!onAddToSetlist || setlists.length === 0}
        >
          <PlaylistAddIcon fontSize="small" sx={{ mr: 1 }} />
          Add to setlist
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSelectedIds(menuSong ? [menuSong.id] : []);
            setConfirmDeleteOpen(true);
            closeSongMenu();
          }}
          disabled={!onDeleteSongs}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Tag the selection */}
      <Dialog open={tagDialogOpen} onClose={() => setTagDialogOpen(false)} maxWidth="xs">
        <DialogTitle>Tag {selectedIds.length} songs</DialogTitle>
        <DialogContent>
          <MuiTextField
            autoFocus
            fullWidth
            size="small"
            label="Tag"
            value={tagDraft}
            onChange={(event) => setTagDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                applyTagToSelection();
              }
            }}
            helperText="The tag is added to every selected song."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTagDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={applyTagToSelection}>
            Add tag
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transpose the selection */}
      <Dialog
        open={transposeDialogOpen}
        onClose={() => setTransposeDialogOpen(false)}
        maxWidth="xs"
      >
        <DialogTitle>Transpose {selectedIds.length} songs</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              The chords of every selected song are moved, and the key each song says it is in is
              moved with them.
            </Typography>
            <TextField
              type="number"
              size="small"
              label="Semitones"
              value={transposeDraft}
              onChange={(event) => setTransposeDraft(Number(event.target.value))}
              inputProps={{ 'aria-label': 'Semitones' }}
              helperText="Up is positive, down is negative."
            />
            <Stack direction="row" spacing={1}>
              <Button size="small" onClick={() => setTransposeDraft((value) => value - 1)}>
                Down
              </Button>
              <Button size="small" onClick={() => setTransposeDraft((value) => value + 1)}>
                Up
              </Button>
              <Button size="small" onClick={() => setTransposeDraft(0)}>
                Back to the original
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransposeDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={transposeSelection}>
            Transpose
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add to a setlist */}
      <Dialog open={setlistDialogOpen} onClose={() => setSetlistDialogOpen(false)} maxWidth="xs">
        <DialogTitle>Add to setlist</DialogTitle>
        <DialogContent>
          {setlists.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              You have no setlists yet. Create one from the navigation menu.
            </Typography>
          ) : (
            <List disablePadding>
              {setlists.map((setlist) => (
                <ListItem key={setlist.id} disablePadding>
                  <ListItemButton onClick={() => addSelectionToSetlist(setlist.id)}>
                    {setlist.name}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSetlistDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete the selection */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} maxWidth="xs">
        <DialogTitle>
          {selectedIds.length === 1 ? 'Delete this song?' : `Delete ${selectedIds.length} songs?`}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {selectedIds.length === 1
              ? 'The song will be removed from your library. This cannot be undone.'
              : 'These songs will be removed from your library. This cannot be undone.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={deleteSelection}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
