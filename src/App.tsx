import { useState, useEffect } from 'react';
import { useSongs } from './hooks/useSongs';
import { SongList } from './components/SongList';
import { SongViewer } from './components/SongViewer';
import { SongEditor } from './components/SongEditor';
import { SongImporter } from './components/SongImporter';
import { NavigationMenu } from './components/NavigationMenu';
import ChordBrowser from './components/ChordBrowser';
import type { Song, ViewMode } from './types';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

type ViewState = 'LIST' | 'PLAY' | 'EDIT' | 'IMPORT' | 'CHORDS';

const VIEW_MODE_KEY = 'chorde_view_mode';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { songs, saveSong, deleteSong } = useSongs();
  const [view, setView] = useState<ViewState>('LIST');
  const [activeSong, setActiveSong] = useState<Song | undefined>(undefined);
  const [filter, setFilter] = useState<{ type: 'tag' | 'artist' | 'key'; value: string } | null>(null);
  const [navOpen, setNavOpen] = useState(!isMobile); // Open by default on desktop

  // Initialize view mode from localStorage
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const stored = localStorage.getItem(VIEW_MODE_KEY);
    return (stored === 'list' || stored === 'grid') ? stored : 'grid';
  });

  // Persist view mode changes to localStorage
  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const filteredSongs = filter
    ? songs.filter((song) => {
      if (filter.type === 'tag') return song.tags?.includes(filter.value);
      if (filter.type === 'artist') return song.artist === filter.value;
      if (filter.type === 'key') return song.key === filter.value;
      return true;
    })
    : songs;

  const handleCreate = () => {
    setActiveSong(undefined);
    setView('EDIT');
    setFilter(null);
  };

  const handleImportClick = () => {
    setView('IMPORT');
    setFilter(null);
  };

  const handleChordsClick = () => {
    setView('CHORDS');
    setFilter(null);
    if (isMobile) setNavOpen(false);
  };

  const handleSelect = (song: Song) => {
    setActiveSong(song);
    setView('PLAY');
  };

  const handleEdit = () => {
    // Active song is already set from Play view
    setView('EDIT');
  };

  const handleSave = (song: Song) => {
    saveSong(song);
    setActiveSong(song); // Update active song ref
    setView('PLAY'); // Go back to play view
  };

  const handleBackToList = () => {
    setActiveSong(undefined);
    setView('LIST');
  };

  const handleTagClick = (tag: string) => {
    setFilter({ type: 'tag', value: tag });
    setActiveSong(undefined);
    setView('LIST');
  };

  const handleArtistClick = (artist: string) => {
    setFilter({ type: 'artist', value: artist });
    setActiveSong(undefined);
    setView('LIST');
    if (isMobile) setNavOpen(false);
  };

  const handleFilterChange = (newFilter: { type: 'tag' | 'artist' | 'key'; value: string } | null) => {
    setFilter(newFilter);
  };

  const handleClearFilter = () => {
    setFilter(null);
  };

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  // Router switch
  if (view === 'PLAY' && activeSong) {
    return (
      <SongViewer
        song={activeSong}
        onClose={handleBackToList}
        onEdit={handleEdit}
        onTagClick={handleTagClick}
        onArtistClick={handleArtistClick}
      />
    );
  }

  if (view === 'EDIT') {
    return (
      <SongEditor
        initialSong={activeSong}
        onSave={handleSave}
        onCancel={activeSong ? () => setView('PLAY') : handleBackToList}
        onDelete={(id) => {
          deleteSong(id);
          handleBackToList();
        }}
      />
    );
  }

  if (view === 'IMPORT') {
    return (
      <SongImporter
        onImport={(song) => {
          saveSong(song);
          setActiveSong(song);
          setView('PLAY');
        }}
        onCancel={handleBackToList}
      />
    );
  }

  if (view === 'CHORDS') {
    return <ChordBrowser onBack={handleBackToList} />;
  }

  // Main list view with navigation
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <NavigationMenu
        songs={songs}
        activeFilter={filter}
        onFilterChange={handleFilterChange}
        open={navOpen}
        onClose={isMobile ? toggleNav : undefined}
      />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {isMobile && (
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={toggleNav}>
              <MenuIcon />
            </IconButton>
          </Box>
        )}
        <SongList
          songs={filteredSongs}
          onSelect={handleSelect}
          onCreate={handleCreate}
          onImportNav={handleImportClick}
          onChordsNav={handleChordsClick}
          activeFilter={filter}
          onClearFilter={handleClearFilter}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
      </Box>
    </Box>
  );
}

export default App;
