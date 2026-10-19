import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'test-2',
    title: 'Another Song',
    artist: 'Different Artist',
    content: '[Chorus]\n[Am]La la [F]la',
    tags: ['pop'],
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

    // The component shows "My Songs (2)" format
    expect(screen.getByText(/My Songs/)).toBeInTheDocument();
    expect(screen.getByText('2', { exact: false })).toBeInTheDocument();
  });
});
