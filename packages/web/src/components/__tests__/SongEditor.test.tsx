import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { SongEditor } from '../SongEditor';
import theme from '../../theme';
import type { Song } from '../../types';

const song: Song = {
  id: 'song-1',
  title: 'A Song',
  artist: 'Someone',
  content: '{title: A Song}\n\n[G]Hello',
  key: 'G',
  tags: ['gospel'],
  attribution: {
    sourceName: 'test',
    sourceUrl: '',
    license: 'public-domain',
    verifiedBy: 'auto',
  },
  rightsStatus: 'open',
  origin: 'user',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const renderEditor = (onSave = vi.fn(), initialSong?: Song) =>
  render(
    <ThemeProvider theme={theme}>
      <SongEditor initialSong={initialSong} onSave={onSave} onCancel={vi.fn()} onDelete={vi.fn()} />
    </ThemeProvider>
  );

describe('the writing desk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the metadata of the song being edited', () => {
    renderEditor(vi.fn(), song);

    expect(screen.getByLabelText('Title')).toHaveValue('A Song');
    expect(screen.getByLabelText('Artist')).toHaveValue('Someone');
    expect(screen.getByLabelText('Key')).toHaveTextContent('G');
    expect(screen.getByLabelText('Song')).toHaveValue(song.content);
  });

  it('shows the song as it will read', () => {
    renderEditor(vi.fn(), song);

    expect(screen.getByText('As it will read')).toBeInTheDocument();
    // The chord is over the word it belongs to, the way it will be read.
    const chord = screen.getByRole('button', { name: /show chord diagram for G/i });
    expect(chord.closest('.chord-anchor')?.querySelector('.chord-word')?.textContent).toBe('Hello');
  });

  it('saves without being asked, so nothing is lost', async () => {
    vi.useFakeTimers();

    try {
      const onSave = vi.fn();
      renderEditor(onSave, song);

      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'A Better Title' } });

      await act(async () => {
        vi.advanceTimersByTime(1500);
      });

      expect(onSave).toHaveBeenCalled();
      expect(onSave.mock.calls[0][0].title).toBe('A Better Title');
    } finally {
      vi.useRealTimers();
    }
  });

  it('undoes and redoes a change', () => {
    renderEditor(vi.fn(), song);

    const title = screen.getByLabelText('Title');
    fireEvent.change(title, { target: { value: 'Changed' } });
    expect(title).toHaveValue('Changed');

    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(title).toHaveValue('A Song');

    fireEvent.click(screen.getByRole('button', { name: 'Redo' }));
    expect(title).toHaveValue('Changed');
  });

  it('offers the chords of the key first', () => {
    renderEditor(vi.fn(), song);

    const palette = screen.getByLabelText('Chord palette');
    const chips = within(palette)
      .getAllByRole('button', { name: /^[A-G][#b]?/ })
      .map((chip) => chip.textContent);

    // The chords of G major, in the order they usually appear.
    expect(chips.slice(0, 4)).toEqual(['G', 'Am', 'Bm', 'C']);
  });

  it('puts a chord into the song when it is picked', () => {
    renderEditor(vi.fn(), song);

    const songBox = screen.getByLabelText('Song');
    fireEvent.change(songBox, { target: { value: '[G]Hello ' } });

    const palette = screen.getByLabelText('Chord palette');
    fireEvent.click(within(palette).getByRole('button', { name: 'Am' }));

    expect(songBox).toHaveValue('[G]Hello [Am]');
  });

  it('saves a song as one of your own', async () => {
    vi.useFakeTimers();

    try {
      const onSave = vi.fn();
      renderEditor(onSave);

      fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Mine' } });

      await act(async () => {
        vi.advanceTimersByTime(1500);
      });

      expect(onSave.mock.calls[0][0].origin).toBe('user');
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps the earlier versions so a change can be taken back', () => {
    renderEditor(vi.fn(), song);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Changed' } });

    fireEvent.click(screen.getByRole('button', { name: 'Earlier versions' }));

    expect(screen.getByText('Earlier versions')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /use this version/i })).toBeInTheDocument();
  });

  it('warns about a chord that is not in the key', () => {
    renderEditor(vi.fn(), { ...song, key: 'G', content: '[G]Hello [Db]there' });

    expect(screen.getByText(/Db is not a chord in G/)).toBeInTheDocument();
  });
});
