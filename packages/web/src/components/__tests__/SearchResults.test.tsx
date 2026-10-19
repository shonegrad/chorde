import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchResults } from '../import/SearchResults';
import type { SearchResult } from '../../services/searchApi';

const mockResults: SearchResult[] = [
  { id: '1', source: 'openhymnal', title: 'Amazing Grace', artist: 'John Newton', key: 'G' },
  { id: '2', source: 'hymnary', title: 'Amazing Grace', artist: 'John Newton', hasChords: false },
];

describe('SearchResults', () => {
  const defaultProps = {
    results: mockResults,
    onImport: vi.fn(),
    onExpand: vi.fn(),
    expandedId: null as string | null,
    preview: undefined as string | undefined,
    loading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all results', () => {
    render(<SearchResults {...defaultProps} />);
    expect(screen.getAllByText('Amazing Grace')).toHaveLength(2);
  });

  it('shows result count', () => {
    render(<SearchResults {...defaultProps} />);
    expect(screen.getByText('2 results found')).toBeInTheDocument();
  });

  it('shows singular result count', () => {
    render(<SearchResults {...defaultProps} results={[mockResults[0]]} />);
    expect(screen.getByText('1 result found')).toBeInTheDocument();
  });

  it('shows empty state when no results', () => {
    render(<SearchResults {...defaultProps} results={[]} />);
    expect(screen.getByText('No results found. Try a different search term.')).toBeInTheDocument();
  });

  it('shows error state when error provided', () => {
    render(<SearchResults {...defaultProps} results={[]} error="Search failed" />);
    expect(screen.getByText('Search failed')).toBeInTheDocument();
  });

  it('shows key chip when key provided', () => {
    render(<SearchResults {...defaultProps} />);
    expect(screen.getByText('Key: G')).toBeInTheDocument();
  });

  it('shows "Lyrics Only" badge for results without chords', () => {
    render(<SearchResults {...defaultProps} />);
    expect(screen.getByText('Lyrics Only')).toBeInTheDocument();
  });

  it('calls onExpand when expand button clicked', () => {
    render(<SearchResults {...defaultProps} />);
    const expandButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(expandButtons[0]);
    expect(defaultProps.onExpand).toHaveBeenCalledWith(mockResults[0]);
  });

  it('calls onImport when Import button clicked', () => {
    render(<SearchResults {...defaultProps} />);
    const importButtons = screen.getAllByText('Import');
    fireEvent.click(importButtons[0]);
    expect(defaultProps.onImport).toHaveBeenCalledWith(mockResults[0]);
  });

  it('shows preview when expanded', () => {
    render(
      <SearchResults
        {...defaultProps}
        expandedId="openhymnal-1"
        preview="[G]Amazing grace how sweet the sound"
      />
    );
    expect(screen.getByText('[G]Amazing grace how sweet the sound')).toBeInTheDocument();
  });

  it('shows loading spinner when preview loading', () => {
    render(<SearchResults {...defaultProps} expandedId="openhymnal-1" loading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows source chip', () => {
    render(<SearchResults {...defaultProps} />);
    expect(screen.getByText('openhymnal')).toBeInTheDocument();
    expect(screen.getByText('hymnary')).toBeInTheDocument();
  });
});
