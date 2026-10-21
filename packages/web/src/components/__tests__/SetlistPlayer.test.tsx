import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SetlistPlayer } from '../SetlistPlayer';
import { useSetlistStore } from '../../store/setlistStore';
import { useLibraryStore } from '../../store/libraryStore';
import theme from '../../theme';
import type { Song } from '../../types';

const song: Song = {
  id: 'song-1',
  title: 'Amazing Grace',
  artist: 'John Newton',
  content: '{start_of_verse}\n[G]Amazing [C]grace',
  key: 'G',
  bpm: 120,
  attribution: {
    sourceName: 'test',
    sourceUrl: '',
    license: 'public-domain',
    verifiedBy: 'auto',
  },
  rightsStatus: 'open',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const secondSong: Song = {
  ...song,
  id: 'song-2',
  title: 'Second Song',
  key: 'C',
};

const renderPlayer = () => {
  const setlist = useSetlistStore.getState().createSetlist('Sunday');
  useSetlistStore.getState().addSong(setlist.id, 'song-1');
  useSetlistStore.getState().addSong(setlist.id, 'song-2');

  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[`/setlist/${setlist.id}/play`]}>
        <Routes>
          <Route path="/setlist/:id/play" element={<SetlistPlayer />} />
          <Route path="/setlist/:id" element={<div>the setlist</div>} />
          <Route path="/" element={<div>the library</div>} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe('the performance view', () => {
  beforeEach(() => {
    localStorage.clear();
    useSetlistStore.setState({ setlists: [] });
    useLibraryStore.setState({ songs: [song, secondSong] });
  });

  it('shows the first song of the set', async () => {
    renderPlayer();

    await waitFor(() => expect(screen.getByText('Amazing Grace')).toBeInTheDocument());
    expect(screen.getByText('1 of 2')).toBeInTheDocument();
  });

  it('shows the chords of the song', async () => {
    renderPlayer();

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /show chord diagram for G/i })).toBeInTheDocument()
    );
  });

  it('moves to the next song', async () => {
    renderPlayer();

    await waitFor(() => expect(screen.getByText('1 of 2')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Next song' }));

    await waitFor(() => expect(screen.getByText('Second Song')).toBeInTheDocument());
    expect(screen.getByText('2 of 2')).toBeInTheDocument();
  });

  it('moves back to the previous song', async () => {
    renderPlayer();

    await waitFor(() => expect(screen.getByText('1 of 2')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Next song' }));
    await waitFor(() => expect(screen.getByText('Second Song')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Previous song' }));
    await waitFor(() => expect(screen.getByText('Amazing Grace')).toBeInTheDocument());
  });

  it('transposes the song and remembers it on the setlist', async () => {
    renderPlayer();

    await waitFor(() => expect(screen.getByText('1 of 2')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Transpose up' }));

    await waitFor(() => expect(screen.getByText('Key G#')).toBeInTheDocument());

    const setlist = useSetlistStore.getState().setlists[0];
    expect(setlist.songs[0].transpose).toBe(1);
  });

  it('counts in before the song starts', async () => {
    renderPlayer();

    // The count-in is four beats by default.
    await waitFor(() => expect(screen.getByText('4')).toBeInTheDocument());
  });

  it('shows the note written on the song', async () => {
    useLibraryStore.setState({ songs: [{ ...song, notes: 'Play quietly here' }, secondSong] });
    renderPlayer();

    await waitFor(() => expect(screen.getByText('Play quietly here')).toBeInTheDocument());
  });

  it('says what is coming next', async () => {
    renderPlayer();

    await waitFor(() => expect(screen.getByText('Next: Second Song')).toBeInTheDocument());
  });

  it('offers the other ways of writing the words', async () => {
    renderPlayer();

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /show chord diagram for G/i })).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole('button', { name: 'Nashville' }));

    // The chord is written as a number, the way a Nashville number is written.
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /1 — show chord diagram for G/i })
      ).toBeInTheDocument()
    );
  });

  it('changes the size of the words', async () => {
    renderPlayer();

    await waitFor(() => expect(screen.getByLabelText(/text size 20 pixels/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /increase text size/i }));

    expect(screen.getByLabelText(/text size 22 pixels/i)).toBeInTheDocument();
  });

  it('shows the sections of the song, and where you are in it', async () => {
    useLibraryStore.setState({
      songs: [
        { ...song, content: '{start_of_verse}\n[G]One\n{start_of_chorus}\n[C]Two' },
        secondSong,
      ],
    });
    renderPlayer();

    const chorus = await screen.findByRole('button', { name: /chorus/i });
    expect(chorus).toBeInTheDocument();

    // Scrolling the song works out which section is on the screen.
    fireEvent.scroll(screen.getByLabelText('The song'));

    await waitFor(() => expect(chorus).toHaveAttribute('aria-current', 'true'));
  });

  it('says so when a song is no longer in the library', async () => {
    useLibraryStore.setState({ songs: [secondSong] });
    renderPlayer();

    await waitFor(() => expect(screen.getByText(/no longer in your library/i)).toBeInTheDocument());
  });
});
