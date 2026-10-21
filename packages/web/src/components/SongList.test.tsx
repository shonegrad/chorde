import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { SongList } from './SongList';
import theme from '../theme';
import type { Song } from '../types';

// Helper to wrap components with theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

// Sample test data
const mockSongs: Song[] = [
  {
    id: 'test-1',
    title: 'Test Song One',
    artist: 'Test Artist',
    content: '[Verse]\n[C]Hello [G]World',
    tags: ['rock', 'classic'],
    attribution: {
      sourceName: 'test',
      sourceUrl: '',
      license: 'public-domain',
      verifiedBy: 'auto',
    },
    rightsStatus: 'open',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'test-2',
    title: 'Another Song',
    artist: 'Different Artist',
    content: '[Chorus]\n[Am]La la [F]la',
    tags: ['pop'],
    attribution: {
      sourceName: 'test',
      sourceUrl: '',
      license: 'public-domain',
      verifiedBy: 'auto',
    },
    rightsStatus: 'open',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

describe('SongList', () => {
  const defaultProps = {
    songs: mockSongs,
    onSelect: vi.fn(),
    onCreate: vi.fn(),
    onImportNav: vi.fn(),
    onChordsNav: vi.fn(),
    viewMode: 'grid' as const,
    onViewModeChange: vi.fn(),
  };

  it('renders song titles', () => {
    renderWithTheme(<SongList {...defaultProps} />);

    expect(screen.getByText('Test Song One')).toBeInTheDocument();
    expect(screen.getByText('Another Song')).toBeInTheDocument();
  });

  it('renders artist names', () => {
    renderWithTheme(<SongList {...defaultProps} />);

    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('Different Artist')).toBeInTheDocument();
  });

  it('filters songs by search query', () => {
    renderWithTheme(<SongList {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Another' } });

    expect(screen.queryByText('Test Song One')).not.toBeInTheDocument();
    expect(screen.getByText('Another Song')).toBeInTheDocument();
  });

  it('calls onSelect when a song is clicked', async () => {
    renderWithTheme(<SongList {...defaultProps} />);

    // Find the card by title and click its CardActionArea
    const songTitle = screen.getByText('Test Song One');
    const card = songTitle.closest('.MuiCard-root');
    const actionArea = card?.querySelector('.MuiCardActionArea-root');
    if (actionArea) fireEvent.click(actionArea);

    expect(defaultProps.onSelect).toHaveBeenCalledWith(mockSongs[0]);
  });

  it('displays empty state when no songs', () => {
    renderWithTheme(<SongList {...defaultProps} songs={[]} />);

    // Component shows "No songs found" when filtered list is empty
    expect(screen.getByText(/No songs found/i)).toBeInTheDocument();
  });

  it('shows song count in header', () => {
    renderWithTheme(<SongList {...defaultProps} />);

    // The component shows "Songs (2)" format
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Songs (2)');
  });

  it('sorts the songs by the chosen order', () => {
    renderWithTheme(<SongList {...defaultProps} />);

    fireEvent.mouseDown(screen.getByLabelText('Sort by'));
    fireEvent.click(screen.getByRole('option', { name: 'Artist (A-Z)' }));

    const titles = screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent);
    expect(titles).toEqual(['Another Song', 'Test Song One']);
  });

  it('finds a song by its lyrics once lyric search is switched on', () => {
    const lyricsOnly: Song = {
      ...mockSongs[0],
      id: 'test-3',
      title: 'A Hymn',
      artist: 'Someone',
      content: '{start_of_verse}\n[C]the wretch is saved',
    };

    renderWithTheme(<SongList {...defaultProps} songs={[lyricsOnly]} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'wretch' } });

    expect(screen.getByText(/No songs found/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /titles and artists only/i }));

    expect(screen.getByText('A Hymn')).toBeInTheDocument();
  });

  it('asks to favourite a song', () => {
    const onToggleFavorite = vi.fn();
    renderWithTheme(<SongList {...defaultProps} onToggleFavorite={onToggleFavorite} />);

    fireEvent.click(screen.getByRole('button', { name: 'Favourite Another Song' }));

    expect(onToggleFavorite).toHaveBeenCalledWith(mockSongs[1]);
  });

  it('selects songs and deletes them as a group', () => {
    const onDeleteSongs = vi.fn();
    renderWithTheme(<SongList {...defaultProps} onDeleteSongs={onDeleteSongs} />);

    fireEvent.click(screen.getByRole('button', { name: 'Select' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select Test Song One' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select Another Song' }));

    expect(screen.getByText('2 selected')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onDeleteSongs).toHaveBeenCalledWith(['test-1', 'test-2']);
  });

  it('tags the selected songs', () => {
    const onTagSongs = vi.fn();
    renderWithTheme(<SongList {...defaultProps} onTagSongs={onTagSongs} />);

    fireEvent.click(screen.getByRole('button', { name: 'Select' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select Test Song One' }));
    fireEvent.click(screen.getByRole('button', { name: 'Tag' }));

    const input = screen.getByLabelText('Tag');
    fireEvent.change(input, { target: { value: 'Favourites' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add tag' }));

    expect(onTagSongs).toHaveBeenCalledWith(['test-1'], 'favourites');
  });

  it('offers to duplicate a song from the card menu', () => {
    const onDuplicateSong = vi.fn();
    renderWithTheme(<SongList {...defaultProps} onDuplicateSong={onDuplicateSong} />);

    fireEvent.click(screen.getByRole('button', { name: 'More actions for Another Song' }));
    fireEvent.click(screen.getByRole('menuitem', { name: /duplicate/i }));

    expect(onDuplicateSong).toHaveBeenCalledWith(mockSongs[1]);
  });

  it('puts the tag in the URL, so that the back button takes it back', () => {
    const onTagFilter = vi.fn();
    renderWithTheme(<SongList {...defaultProps} onTagFilter={onTagFilter} />);

    fireEvent.click(screen.getByRole('button', { name: 'rock' }));

    expect(onTagFilter).toHaveBeenCalledWith('rock');
  });

  it('takes the tag back when the same tag is chosen again', () => {
    const onTagFilter = vi.fn();
    renderWithTheme(
      <SongList
        {...defaultProps}
        onTagFilter={onTagFilter}
        activeFilter={{ type: 'tag', value: 'rock' }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'rock' }));

    expect(onTagFilter).toHaveBeenCalledWith(null);
  });

  it('gathers the songs into groups', () => {
    renderWithTheme(<SongList {...defaultProps} />);

    fireEvent.mouseDown(screen.getByLabelText('Group by'));
    fireEvent.click(screen.getByRole('option', { name: 'By artist' }));

    expect(screen.getByRole('heading', { level: 2, name: /^Test Artist$/ })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /^Different Artist$/ })
    ).toBeInTheDocument();
  });

  it('finds the songs whose details are missing', () => {
    const complete: Song = {
      ...mockSongs[0],
      id: 'test-complete',
      title: 'A Complete Song',
      key: 'C',
      duration: '4:28',
    };

    renderWithTheme(<SongList {...defaultProps} songs={[complete, mockSongs[1]]} />);

    fireEvent.click(screen.getByRole('button', { name: /missing details/i }));

    expect(screen.getByText('Another Song')).toBeInTheDocument();
    expect(screen.queryByText('A Complete Song')).not.toBeInTheDocument();
  });

  it('transposes the selected songs', () => {
    const onTransposeSongs = vi.fn();
    renderWithTheme(<SongList {...defaultProps} onTransposeSongs={onTransposeSongs} />);

    fireEvent.click(screen.getByRole('button', { name: 'Select' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select Test Song One' }));
    fireEvent.click(screen.getByRole('button', { name: 'Transpose' }));

    const input = screen.getByLabelText('Semitones');
    fireEvent.change(input, { target: { value: '2' } });
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Transpose' }));

    expect(onTransposeSongs).toHaveBeenCalledWith(['test-1'], 2);
  });
});
