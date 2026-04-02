import React, { useState, Suspense } from 'react';
import { useApp } from './context/useApp';
import { SongList } from './components/SongList';
import { NavigationMenu } from './components/NavigationMenu';
import ErrorBoundary from './components/ErrorBoundary';
import type { Song } from './types';
import { Box, IconButton, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Lazy-loaded components for code splitting
const SongViewer = React.lazy(() => import('./components/SongViewer').then(m => ({ default: m.SongViewer })));
const SongEditor = React.lazy(() => import('./components/SongEditor').then(m => ({ default: m.SongEditor })));
const SongImporter = React.lazy(() => import('./components/SongImporter').then(m => ({ default: m.SongImporter })));
const ChordBrowser = React.lazy(() => import('./components/ChordBrowser'));
const Settings = React.lazy(() => import('./components/Settings').then(m => ({ default: m.Settings })));

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { songs, saveSong, deleteSong, view, setView, activeSong, setActiveSong, filter, setFilter, viewMode, setViewMode } = useApp();
  const [navOpen, setNavOpen] = useState(!isMobile);

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

  const handleSettingsClick = () => {
    setView('SETTINGS');
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

  // Loading fallback for lazy-loaded components
  const LoadingFallback = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );

   // Router switch
   if (view === 'PLAY' && activeSong) {
     return (
       <ErrorBoundary>
         <Suspense fallback={LoadingFallback}>
           <SongViewer
             song={activeSong}
             onClose={handleBackToList}
             onEdit={handleEdit}
             onTagClick={handleTagClick}
             onArtistClick={handleArtistClick}
           />
         </Suspense>
       </ErrorBoundary>
     );
   }

   if (view === 'EDIT') {
     return (
       <ErrorBoundary>
         <Suspense fallback={LoadingFallback}>
           <SongEditor
             initialSong={activeSong}
             onSave={handleSave}
             onCancel={activeSong ? () => setView('PLAY') : handleBackToList}
             onDelete={(id) => {
               deleteSong(id);
               handleBackToList();
             }}
           />
         </Suspense>
       </ErrorBoundary>
     );
   }

   if (view === 'IMPORT') {
     return (
       <ErrorBoundary>
         <Suspense fallback={LoadingFallback}>
           <SongImporter
             onImport={(song) => {
               saveSong(song);
               setActiveSong(song);
               setView('PLAY');
             }}
             onCancel={handleBackToList}
           />
         </Suspense>
       </ErrorBoundary>
     );
   }

   if (view === 'CHORDS') {
     return (
       <ErrorBoundary>
         <Suspense fallback={LoadingFallback}>
           <ChordBrowser onBack={handleBackToList} />
         </Suspense>
       </ErrorBoundary>
     );
   }

   if (view === 'SETTINGS') {
     return (
       <ErrorBoundary>
         <Suspense fallback={LoadingFallback}>
           <Settings onBack={handleBackToList} />
         </Suspense>
       </ErrorBoundary>
     );
   }

  // Main list view with navigation
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <NavigationMenu
        songs={songs}
        activeFilter={filter}
        onFilterChange={handleFilterChange}
        onSettingsNav={handleSettingsClick}
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
          onViewModeChange={setViewMode}
        />
      </Box>
    </Box>
  );
}

export default App;
