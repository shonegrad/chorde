import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { SongViewer } from '../SongViewer';
import theme from '../../theme';
import type { Song } from '../../types';

const renderViewer = (song: Song, props: Partial<React.ComponentProps<typeof SongViewer>> = {}) => {
  const onClose = vi.fn();
  const onEdit = vi.fn();
  const utils = render(
    <ThemeProvider theme={theme}>
      <SongViewer song={song} onClose={onClose} onEdit={onEdit} {...props} />
    </ThemeProvider>
  );
  return { ...utils, onClose, onEdit };
};

const song: Song = {
  id: 'song-1',
  title: 'Amazing Grace',
  artist: 'John Newton',
  key: 'G',
  content: '{start_of_chorus}\n[G]Amazing [C]grace how sweet',
  tags: ['hymn'],
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

describe('SongViewer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the song title and artist', () => {
    renderViewer(song);
    expect(screen.getByRole('heading', { name: 'Amazing Grace' })).toBeInTheDocument();
    expect(screen.getByText('John Newton')).toBeInTheDocument();
  });

  it('renders the chord over the word it belongs to', () => {
    renderViewer(song);

    const chord = screen.getByRole('button', { name: /show chord diagram for G/i });
    const anchor = chord.closest('.chord-anchor');
    expect(anchor).not.toBeNull();
    expect(anchor?.querySelector('.chord-word')?.textContent).toBe('Amazing');
  });

  it('works out the key when the song does not say', () => {
    renderViewer({
      ...song,
      key: undefined,
      content: '{start_of_verse}\n[G]Amazing [C]grace how [G]sweet the [D7]sound',
    });

    expect(screen.getByText('Key G (detected)')).toBeInTheDocument();
  });

  it('shows the written key when nothing is transposed', () => {
    renderViewer(song);
    expect(screen.getByText('Key G')).toBeInTheDocument();
  });

  it('shows the transposed key and the original key after transposing up', () => {
    renderViewer(song);

    fireEvent.click(screen.getByRole('button', { name: /transpose up one semitone/i }));

    expect(screen.getByText('Key G# (from G)')).toBeInTheDocument();
  });

  it('offers a reset once the song is transposed', () => {
    renderViewer(song);

    expect(screen.queryByRole('button', { name: /reset transposition/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /transpose up one semitone/i }));

    const reset = screen.getByRole('button', { name: /reset transposition/i });
    expect(reset).toBeInTheDocument();

    fireEvent.click(reset);
    expect(screen.getByText('Key G')).toBeInTheDocument();
  });

  it('transposes the chords that are displayed', () => {
    renderViewer(song);

    fireEvent.click(screen.getByRole('button', { name: /transpose up one semitone/i }));

    expect(screen.getByRole('button', { name: 'Show chord diagram for G#' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Show chord diagram for G' })
    ).not.toBeInTheDocument();
  });

  it('shows the sounding key for the selected capo', () => {
    renderViewer(song);

    fireEvent.mouseDown(screen.getByLabelText('Capo position'));
    fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: '2' }));

    expect(screen.getByText(/Capo 2/)).toBeInTheDocument();
    expect(screen.getByText(/sounds in A/)).toBeInTheDocument();
  });

  it('keeps "no capo" when the song was written with one', () => {
    const withCapo = { ...song, capo: 2 };

    const { unmount } = renderViewer(withCapo);

    fireEvent.mouseDown(screen.getByLabelText('Capo position'));
    fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: 'None' }));

    unmount();

    renderViewer(withCapo);

    expect(screen.getByLabelText('Capo position')).toHaveTextContent('None');
    expect(screen.queryByText(/Capo 2/)).not.toBeInTheDocument();
  });

  it('starts from the capo the song was written with', () => {
    renderViewer({ ...song, capo: 2 });

    expect(screen.getByLabelText('Capo position')).toHaveTextContent('2');
  });

  it('shows the note written on the song', () => {
    renderViewer({ ...song, notes: 'Play quietly here' });

    expect(screen.getByText('Play quietly here')).toBeInTheDocument();
  });

  it('keeps the tempo of the song, so that it is there next time', () => {
    const onUpdateSong = vi.fn();
    renderViewer({ ...song, bpm: 100 }, { onUpdateSong });

    fireEvent.click(screen.getByRole('button', { name: /details/i }));

    const tempo = screen.getByLabelText('The tempo of the song');
    expect(tempo).toHaveValue(100);

    fireEvent.change(tempo, { target: { value: '120' } });
    fireEvent.blur(tempo);

    expect(onUpdateSong).toHaveBeenCalledWith(expect.objectContaining({ bpm: 120 }));
  });

  it('shows no note when the song has none', () => {
    renderViewer(song);

    expect(screen.queryByLabelText('Note for this song')).not.toBeInTheDocument();
  });

  it('shows the current text size and changes it', () => {
    renderViewer(song);

    const readout = screen.getByLabelText(/text size 20 pixels/i);
    expect(readout).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /increase text size/i }));
    expect(screen.getByLabelText(/text size 22 pixels/i)).toBeInTheDocument();
  });

  it('offers chords, Nashville, tabs and notes as display modes', () => {
    renderViewer(song);

    expect(screen.getByRole('button', { name: 'Chords' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nashville' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tabs' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Notes' })).toBeInTheDocument();
  });

  it('renders Nashville numbers when the Nashville mode is selected', () => {
    renderViewer(song);

    fireEvent.click(screen.getByRole('button', { name: 'Nashville' }));

    // In the key of G, C is the fourth degree and G is the tonic.
    expect(
      screen.getByRole('button', { name: /^4 — show chord diagram for C$/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^1 — show chord diagram for G$/ })
    ).toBeInTheDocument();
  });

  it('remembers the text size and display mode for the next song', () => {
    const { unmount } = renderViewer(song);

    fireEvent.click(screen.getByRole('button', { name: /increase text size/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Nashville' }));
    unmount();

    renderViewer(song);
    expect(screen.getByLabelText(/text size 22 pixels/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nashville' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('lists the sections of the song', () => {
    renderViewer(song);
    expect(screen.getAllByText('Chorus 1').length).toBeGreaterThan(0);
  });

  it('exposes accessible names on the toolbar controls', () => {
    renderViewer(song);

    expect(screen.getByRole('button', { name: /back to library/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /increase tempo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /decrease tempo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start auto-scroll/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download chordpro file/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /print or save as pdf/i })).toBeInTheDocument();
  });

  it('counts in on the beat rather than once a second', () => {
    vi.useFakeTimers();
    // The scrolling loop is not what is being tested here, and in a browser
    // without a layout it would stop the count-in straight away.
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(0);

    try {
      renderViewer({ ...song, bpm: 120 });

      fireEvent.click(screen.getByRole('button', { name: /start auto-scroll/i }));

      // The count-in starts at four beats.
      expect(screen.getByText('4')).toBeInTheDocument();

      // At 120 beats a minute a beat is half a second.
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(screen.getByText('3')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(screen.getByText('2')).toBeInTheDocument();
    } finally {
      raf.mockRestore();
      vi.useRealTimers();
    }
  });

  describe('keyboard shortcuts', () => {
    it('transposes with the arrow keys', () => {
      renderViewer(song);

      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(screen.getByText('Key G# (from G)')).toBeInTheDocument();

      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(screen.getByText('Key G')).toBeInTheDocument();
    });

    it('changes the text size with plus and minus', () => {
      renderViewer(song);

      fireEvent.keyDown(window, { key: '+' });
      expect(screen.getByLabelText(/text size 22 pixels/i)).toBeInTheDocument();

      fireEvent.keyDown(window, { key: '-' });
      expect(screen.getByLabelText(/text size 20 pixels/i)).toBeInTheDocument();
    });

    it('shows the shortcut list with the question mark', () => {
      renderViewer(song);

      fireEvent.keyDown(window, { key: '?' });

      expect(screen.getByText('Keyboard shortcuts')).toBeInTheDocument();
      expect(screen.getByText('Transpose down a semitone')).toBeInTheDocument();
    });

    it('closes the shortcut list with Escape', async () => {
      renderViewer(song);

      fireEvent.keyDown(window, { key: '?' });
      expect(screen.getByText('Keyboard shortcuts')).toBeInTheDocument();

      fireEvent.keyDown(window, { key: 'Escape' });
      await waitFor(() => expect(screen.queryByText('Keyboard shortcuts')).not.toBeInTheDocument());
    });

    it('leaves the keyboard alone while the user is typing', () => {
      renderViewer(song);

      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();

      fireEvent.keyDown(input, { key: 'ArrowRight' });

      expect(screen.getByText('Key G')).toBeInTheDocument();
      input.remove();
    });
  });
});
