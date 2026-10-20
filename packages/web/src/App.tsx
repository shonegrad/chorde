import React, { Suspense, useMemo, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useLibraryStore } from './store/libraryStore';
import { useSetlistStore } from './store/setlistStore';
import { createId } from './lib/id';
import { useNotification } from './context/NotificationContext';
import { SongList } from './components/SongList';
import { NavigationMenu } from './components/NavigationMenu';
import { StorageWarning } from './components/StorageWarning';
import ErrorBoundary from './components/ErrorBoundary';
import type { Song, SongFilter } from './types';
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
  const saveSong = useLibraryStore((s) => s.saveSong);
  const setlists = useSetlistStore((s) => s.setlists);
  const addSongToSetlist = useSetlistStore((s) => s.addSong);
  const { notifySuccess, notifyError } = useNotification();
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
          onUpdateSong={async (updated: Song) => {
            try {
              await saveSong(updated);
            } catch {
              notifyError('Failed to save the song');
            }
          }}
          setlists={setlists.map((setlist) => ({ id: setlist.id, name: setlist.name }))}
          onAddToSetlist={(songId: string, setlistId: string) => {
            addSongToSetlist(setlistId, songId);
            const setlist = setlists.find((candidate) => candidate.id === setlistId);
            notifySuccess(`Added to "${setlist?.name ?? 'setlist'}"`);
          }}
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
  const { notifyError } = useNotification();
  const navigate = useNavigate();

  return (
    <ErrorBoundary>
      <Suspense fallback={LoadingFallback}>
        <SongImporter
          onImport={async (song: Song) => {
            try {
              await saveSong(song);
            } catch {
              notifyError('Failed to import song');
              throw new Error('Failed to import song');
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
  const saveSong = useLibraryStore((s) => s.saveSong);
  const deleteSongs = useLibraryStore((s) => s.deleteSongs);
  const viewMode = useLibraryStore((s) => s.viewMode);
  const setViewMode = useLibraryStore((s) => s.setViewMode);
  const setlists = useSetlistStore((s) => s.setlists);
  const addSongToSetlist = useSetlistStore((s) => s.addSong);
  const { notifySuccess, notifyError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [navOpen, setNavOpen] = useState(!isMobile);

  const searchParams = new URLSearchParams(location.search);
  const urlTag = searchParams.get('tag');
  const urlArtist = searchParams.get('artist');
  const urlKey = searchParams.get('key');
  const urlFavourite = searchParams.get('favourite');

  // The URL is the single source of truth for the active filter, so the
  // browser's back and forward buttons work as expected.
  const activeFilter = useMemo<SongFilter | null>(() => {
    if (urlTag) return { type: 'tag', value: urlTag };
    if (urlArtist) return { type: 'artist', value: urlArtist };
    if (urlKey) return { type: 'key', value: urlKey };
    if (urlFavourite) return { type: 'favourite', value: urlFavourite };
    return null;
  }, [urlTag, urlArtist, urlKey, urlFavourite]);

  const filteredSongs = useMemo(() => {
    if (!activeFilter) return songs;
    return songs.filter((song) => {
      if (activeFilter.type === 'tag') return song.tags?.includes(activeFilter.value);
      if (activeFilter.type === 'artist') return song.artist === activeFilter.value;
      if (activeFilter.type === 'key') return song.key === activeFilter.value;
      if (activeFilter.type === 'favourite') return Boolean(song.favorite);
      return true;
    });
  }, [songs, activeFilter]);

  const handleToggleFavorite = async (song: Song) => {
    try {
      await saveSong({ ...song, favorite: !song.favorite, updatedAt: new Date().toISOString() });
    } catch {
      notifyError('Failed to update the song');
    }
  };

  const handleDuplicateSong = async (song: Song) => {
    try {
      const copy: Song = {
        ...song,
        id: createId(),
        title: `${song.title} (copy)`,
        favorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveSong(copy);
      notifySuccess(`Duplicated "${song.title}"`);
    } catch {
      notifyError('Failed to duplicate the song');
    }
  };

  const handleDeleteSongs = async (ids: string[]) => {
    try {
      await deleteSongs(ids);
      notifySuccess(`Deleted ${ids.length} ${ids.length === 1 ? 'song' : 'songs'}`);
    } catch {
      notifyError('Failed to delete the songs');
    }
  };

  const handleTagSongs = async (ids: string[], tag: string) => {
    try {
      for (const id of ids) {
        const song = songs.find((candidate) => candidate.id === id);
        if (!song) continue;
        const tags = Array.from(new Set([...(song.tags ?? []), tag]));
        await saveSong({ ...song, tags, updatedAt: new Date().toISOString() });
      }
      notifySuccess(`Tagged ${ids.length} ${ids.length === 1 ? 'song' : 'songs'}`);
    } catch {
      notifyError('Failed to tag the songs');
    }
  };

  const handleAddToSetlist = (ids: string[], setlistId: string) => {
    ids.forEach((id) => addSongToSetlist(setlistId, id));
    const setlist = setlists.find((candidate) => candidate.id === setlistId);
    notifySuccess(
      `Added ${ids.length} ${ids.length === 1 ? 'song' : 'songs'} to "${setlist?.name ?? 'setlist'}"`
    );
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <NavigationMenu
        songs={songs}
        activeFilter={activeFilter}
        onFilterChange={(newFilter) => {
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
            <IconButton onClick={() => setNavOpen(!navOpen)} aria-label="Open navigation menu">
              <MenuIcon />
            </IconButton>
          </Box>
        )}
        <SongList
          songs={filteredSongs}
          allSongs={songs}
          onSelect={(song: Song) => navigate(`/song/${song.id}`)}
          onCreate={() => navigate('/song/new')}
          onImportNav={() => navigate('/import')}
          onChordsNav={() => navigate('/chords')}
          activeFilter={activeFilter}
          onClearFilter={() => navigate('/', { replace: true })}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onToggleFavorite={handleToggleFavorite}
          onDeleteSongs={handleDeleteSongs}
          onDuplicateSong={handleDuplicateSong}
          onTagSongs={handleTagSongs}
          onAddToSetlist={handleAddToSetlist}
          setlists={setlists.map((setlist) => ({ id: setlist.id, name: setlist.name }))}
        />
      </Box>
    </Box>
  );
}

function App() {
  const storageAvailable = useLibraryStore((s) => s.storageAvailable);
  const navigate = useNavigate();

  return (
    <>
      {!storageAvailable && <StorageWarning />}
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
                <ChordBrowser onBack={() => navigate('/')} />
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
                <Settings onBack={() => navigate('/')} />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
