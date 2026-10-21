import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
  useLocation,
  useOutletContext,
} from 'react-router-dom';
import { useLibraryStore } from './store/libraryStore';
import { useSetlistStore } from './store/setlistStore';
import { createId } from './lib/id';
import { useNotification } from './context/NotificationContext';
import { SongList } from './components/SongList';
import { NavigationMenu } from './components/NavigationMenu';
import { StorageWarning } from './components/StorageWarning';
import { MobileNav } from './components/MobileNav';
import ErrorBoundary from './components/ErrorBoundary';
import { useLibraryFilter } from './lib/useLibraryFilter';
import { transposeSong } from './lib/library';
// The shapes a player has drawn for themselves, so that the app draws those
// shapes for those chords from the start.
import './lib/customChords';
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
const KeyView = React.lazy(() =>
  import('./components/KeyView').then((m) => ({ default: m.KeyView }))
);
const Settings = React.lazy(() =>
  import('./components/Settings').then((m) => ({ default: m.Settings }))
);
const SetlistViewer = React.lazy(() =>
  import('./components/SetlistViewer').then((m) => ({ default: m.SetlistViewer }))
);
const SetlistPlayer = React.lazy(() =>
  import('./components/SetlistPlayer').then((m) => ({ default: m.SetlistPlayer }))
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

/**
 * The way round the app.
 *
 * On a big screen the sidebar is always there, and the music scrolls beside
 * it. On a phone it slides in when it is wanted, and the bottom bar carries
 * the main places.
 */
function AppLayout() {
  const songs = useLibraryStore((s) => s.songs);
  const [activeFilter, setFilter] = useLibraryFilter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
  const [navOpen, setNavOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', height: 'var(--app-height)' }}>
      <NavigationMenu
        songs={songs}
        activeFilter={activeFilter}
        onFilterChange={setFilter}
        open={navOpen}
        onClose={isMobile ? () => setNavOpen(false) : undefined}
      />
      <Box sx={{ flexGrow: 1, minWidth: 0, overflow: 'auto' }}>
        <Outlet context={{ openNav: () => setNavOpen(true) }} />
      </Box>
    </Box>
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
  const theme = useTheme();
  // noSsr keeps the first render in step with the real viewport, so the
  // drawer does not flash open on a phone before it is closed again.
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
  const { openNav } = useOutletContext<{ openNav: () => void }>();

  const [activeFilter] = useLibraryFilter();

  const filteredSongs = useMemo(() => {
    if (!activeFilter) return songs;
    return songs.filter((song) => {
      if (activeFilter.type === 'tag') return song.tags?.includes(activeFilter.value);
      if (activeFilter.type === 'artist') return song.artist === activeFilter.value;
      if (activeFilter.type === 'key') return song.key === activeFilter.value;
      if (activeFilter.type === 'favourite') return Boolean(song.favorite);
      if (activeFilter.type === 'known') return Boolean(song.known);
      if (activeFilter.type === 'played' || activeFilter.type === 'popular') {
        return (song.playCount ?? 0) > 0;
      }
      if (activeFilter.type === 'mine') {
        return song.origin === 'user' || song.origin === 'import';
      }
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

  const handleTransposeSongs = async (ids: string[], semitones: number) => {
    if (semitones === 0) return;
    try {
      for (const id of ids) {
        const song = songs.find((candidate) => candidate.id === id);
        if (!song) continue;
        await saveSong(transposeSong(song, semitones));
      }
      notifySuccess(
        `Transposed ${ids.length} ${ids.length === 1 ? 'song' : 'songs'} by ${
          semitones > 0 ? '+' : ''
        }${semitones}`
      );
    } catch {
      notifyError('Failed to transpose the songs');
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
    <Box>
      {isMobile && (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={openNav} aria-label="Open navigation menu">
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
        onTransposeSongs={handleTransposeSongs}
        onAddToSetlist={handleAddToSetlist}
        setlists={setlists.map((setlist) => ({ id: setlist.id, name: setlist.name }))}
      />
    </Box>
  );
}

function App() {
  const storageAvailable = useLibraryStore((s) => s.storageAvailable);
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Move the focus to the top of the page after a route change, so a keyboard
  // or screen reader user is not left where they were.
  useEffect(() => {
    mainRef.current?.focus();
  }, [location.pathname]);

  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </a>

      {!storageAvailable && <StorageWarning />}

      <main id="main-content" ref={mainRef} tabIndex={-1}>
        <Routes>
          {/* The screens with the sidebar beside them. */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<SongListView />} />
            <Route path="/song/:id" element={<SongViewerRoute />} />
            <Route path="/import" element={<SongImporterRoute />} />
            <Route
              path="/key/:key"
              element={
                <ErrorBoundary>
                  <Suspense fallback={LoadingFallback}>
                    <KeyView />
                  </Suspense>
                </ErrorBoundary>
              }
            />
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
          </Route>

          {/* The performance screens take the whole screen. */}
          <Route path="/song/:id/edit" element={<SongEditorRoute />} />
          <Route path="/song/new" element={<SongEditorRoute />} />
          <Route
            path="/setlist/:id/play"
            element={
              <ErrorBoundary>
                <Suspense fallback={LoadingFallback}>
                  <SetlistPlayer />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <MobileNav />
    </>
  );
}

export default App;
