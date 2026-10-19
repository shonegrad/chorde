import React, { Suspense, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useLibraryStore } from './store/libraryStore';
import { useNotification } from './context/NotificationContext';
import { SongList } from './components/SongList';
import { NavigationMenu } from './components/NavigationMenu';
import ErrorBoundary from './components/ErrorBoundary';
import type { Song } from './types';
import { Box, IconButton, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const SongViewer = React.lazy(() =>
  import('./components/SongViewer').then((m) => ({ default: m.SongViewer }))
);
const SongEditor = React.lazy(() =>
  import('./components/SongEditor').then((m) => ({ default: m.SongEditor }))
);
const SongImporter = React.lazy(() =>
  import('./components/SongImporter').then((m) => ({ default: m.SongImporter }))
);
const ChordBrowser = React.lazy(() => import('./components/ChordBrowser'));
const Settings = React.lazy(() =>
  import('./components/Settings').then((m) => ({ default: m.Settings }))
);
const SetlistViewer = React.lazy(() =>
  import('./components/SetlistViewer').then((m) => ({ default: m.SetlistViewer }))
);

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

function SongViewerRoute() {
  const songs = useLibraryStore((s) => s.songs);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const song = songs.find((s) => s.id === id);

  if (!song) {
    return <Navigate to="/" replace />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={LoadingFallback}>
        <SongViewer
          song={song}
          onClose={() => navigate('/')}
          onEdit={() => navigate(`/song/${song.id}/edit`)}
          onTagClick={(tag: string) => navigate(`/?tag=${encodeURIComponent(tag)}`)}
          onArtistClick={(artist: string) => navigate(`/?artist=${encodeURIComponent(artist)}`)}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

function SongEditorRoute() {
  const songs = useLibraryStore((s) => s.songs);
  const saveSong = useLibraryStore((s) => s.saveSong);
  const deleteSong = useLibraryStore((s) => s.deleteSong);
  const { notifySuccess, notifyError } = useNotification();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const song = id ? songs.find((s) => s.id === id) : undefined;

  return (
    <ErrorBoundary>
      <Suspense fallback={LoadingFallback}>
        <SongEditor
          initialSong={song}
          onSave={async (savedSong: Song) => {
            try {
              await saveSong(savedSong);
              notifySuccess('Song saved!');
              navigate(`/song/${savedSong.id}`);
            } catch {
              notifyError('Failed to save song');
            }
          }}
          onCancel={song ? () => navigate(`/song/${song.id}`) : () => navigate('/')}
          onDelete={async (deletedId: string) => {
            try {
              await deleteSong(deletedId);
              notifySuccess('Song deleted');
              navigate('/');
            } catch {
              notifyError('Failed to delete song');
            }
          }}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

function SongImporterRoute() {
  const saveSong = useLibraryStore((s) => s.saveSong);
  const { notifySuccess, notifyError } = useNotification();
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <Suspense fallback={LoadingFallback}>
        <SongImporter
          onImport={async (song: Song) => {
            try {
              await saveSong(song);
              notifySuccess('Song imported!');
              navigate(`/song/${song.id}`);
            } catch {
              notifyError('Failed to import song');
            }
          }}
          onCancel={() => navigate('/')}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

function SongListView() {
  const songs = useLibraryStore((s) => s.songs);
  const filter = useLibraryStore((s) => s.filter);
  const setFilter = useLibraryStore((s) => s.setFilter);
  const viewMode = useLibraryStore((s) => s.viewMode);
  const setViewMode = useLibraryStore((s) => s.setViewMode);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [navOpen, setNavOpen] = useState(!isMobile);

  const searchParams = new URLSearchParams(location.search);
  const urlTag = searchParams.get('tag');
  const urlArtist = searchParams.get('artist');
  const urlKey = searchParams.get('key');

  const activeFilter =
    filter ||
    (urlTag
      ? { type: 'tag' as const, value: urlTag }
      : urlArtist
        ? { type: 'artist' as const, value: urlArtist }
        : urlKey
          ? { type: 'key' as const, value: urlKey }
          : null);

  const filteredSongs = activeFilter
    ? songs.filter((song) => {
        if (activeFilter.type === 'tag') return song.tags?.includes(activeFilter.value);
        if (activeFilter.type === 'artist') return song.artist === activeFilter.value;
        if (activeFilter.type === 'key') return song.key === activeFilter.value;
        return true;
      })
    : songs;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <NavigationMenu
        songs={songs}
        activeFilter={activeFilter}
        onFilterChange={(newFilter) => {
          setFilter(newFilter);
          if (newFilter) {
            navigate(`/?${newFilter.type}=${encodeURIComponent(newFilter.value)}`, {
              replace: true,
            });
          } else {
            navigate('/', { replace: true });
          }
        }}
        onSettingsNav={() => navigate('/settings')}
        onChordsNav={() => navigate('/chords')}
        onImportNav={() => navigate('/import')}
        open={navOpen}
        onClose={isMobile ? () => setNavOpen(!navOpen) : undefined}
      />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {isMobile && (
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => setNavOpen(!navOpen)}>
              <MenuIcon />
            </IconButton>
          </Box>
        )}
        <SongList
          songs={filteredSongs}
          onSelect={(song: Song) => navigate(`/song/${song.id}`)}
          onCreate={() => navigate('/song/new')}
          onImportNav={() => navigate('/import')}
          onChordsNav={() => navigate('/chords')}
          activeFilter={activeFilter}
          onClearFilter={() => {
            setFilter(null);
            navigate('/', { replace: true });
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<SongListView />} />
      <Route path="/song/:id" element={<SongViewerRoute />} />
      <Route path="/song/:id/edit" element={<SongEditorRoute />} />
      <Route path="/song/new" element={<SongEditorRoute />} />
      <Route path="/import" element={<SongImporterRoute />} />
      <Route
        path="/chords"
        element={
          <ErrorBoundary>
            <Suspense fallback={LoadingFallback}>
              <ChordBrowser onBack={() => window.history.back()} />
            </Suspense>
          </ErrorBoundary>
        }
      />
      <Route
        path="/setlist/:id"
        element={
          <ErrorBoundary>
            <Suspense fallback={LoadingFallback}>
              <SetlistViewer />
            </Suspense>
          </ErrorBoundary>
        }
      />
      <Route
        path="/settings"
        element={
          <ErrorBoundary>
            <Suspense fallback={LoadingFallback}>
              <Settings onBack={() => window.history.back()} />
            </Suspense>
          </ErrorBoundary>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
