import { useState } from 'react';
import { useSongs } from './hooks/useSongs';
import { SongList } from './components/SongList';
import { SongViewer } from './components/SongViewer';
import { SongEditor } from './components/SongEditor';
import { SongImporter } from './components/SongImporter';
import ChordBrowser from './components/ChordBrowser';
import type { Song } from './types';

type ViewState = 'LIST' | 'PLAY' | 'EDIT' | 'IMPORT' | 'CHORDS';

function App() {
  const { songs, saveSong, deleteSong } = useSongs();
  const [view, setView] = useState<ViewState>('LIST');
  const [activeSong, setActiveSong] = useState<Song | undefined>(undefined);
  const [filter, setFilter] = useState<{ type: 'tag' | 'artist' | 'key'; value: string } | null>(null);

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
  };

  const handleKeySelect = (key: string) => {
    if (key === 'All') {
      setFilter(null);
    } else {
      setFilter({ type: 'key', value: key });
    }
  };

  const handleClearFilter = () => {
    setFilter(null);
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

  return (
    <SongList
      songs={filteredSongs}
      onSelect={handleSelect}
      onCreate={handleCreate}
      onImportNav={handleImportClick}
      onChordsNav={handleChordsClick}
      activeFilter={filter}
      onClearFilter={handleClearFilter}
      onKeySelect={handleKeySelect}
    />
  );
}

export default App;
