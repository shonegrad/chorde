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

  const handleCreate = () => {
    setActiveSong(undefined);
    setView('EDIT');
  };

  const handleImportClick = () => {
    setView('IMPORT');
  };

  const handleChordsClick = () => {
    setView('CHORDS');
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

  // Router switch
  if (view === 'PLAY' && activeSong) {
    return (
      <SongViewer
        song={activeSong}
        onClose={handleBackToList}
        onEdit={handleEdit}
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
      songs={songs}
      onSelect={handleSelect}
      onCreate={handleCreate}
      onImportNav={handleImportClick}
      onChordsNav={handleChordsClick}
    />
  );
}

export default App;
