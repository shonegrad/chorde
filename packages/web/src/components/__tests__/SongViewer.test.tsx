import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
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
});
