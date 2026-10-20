import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';
import { SearchTab } from '../SearchTab';
import { searchApi } from '../../../services/searchApi';
import theme from '../../../theme';
import type { Source } from '../../../types';

vi.mock('../../../services/searchApi', () => ({
  searchApi: {
    getSources: vi.fn(),
    search: vi.fn(),
    fetchSong: vi.fn(),
  },
}));

const mockedSearchApi = vi.mocked(searchApi);

const sources: Source[] = [
  { id: 'openhymnal', name: 'OpenHymnal', enabled: true, license: 'public-domain' },
  { id: 'hymnary', name: 'Hymnary.org', enabled: true, license: 'public-domain' },
];

const renderTab = () =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <SearchTab onImport={vi.fn()} onCancel={vi.fn()} />
      </MemoryRouter>
    </ThemeProvider>
  );

describe('SearchTab source filter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedSearchApi.getSources.mockResolvedValue(sources);
    mockedSearchApi.search.mockResolvedValue({ results: [], totalCount: 0 });
  });

  it('offers the available sources', async () => {
    renderTab();

    await waitFor(() => expect(screen.getByText('OpenHymnal')).toBeInTheDocument());
    expect(screen.getByText('Hymnary.org')).toBeInTheDocument();
  });

  it('searches every source by default', async () => {
    renderTab();
    await waitFor(() => expect(screen.getByText('OpenHymnal')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText(/search for a song/i), {
      target: { value: 'amazing' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => expect(mockedSearchApi.search).toHaveBeenCalled());
    expect(mockedSearchApi.search).toHaveBeenCalledWith('amazing', undefined);
  });

  it('searches only the chosen source', async () => {
    renderTab();
    await waitFor(() => expect(screen.getByText('OpenHymnal')).toBeInTheDocument());

    fireEvent.click(screen.getByText('OpenHymnal'));
    fireEvent.change(screen.getByPlaceholderText(/search for a song/i), {
      target: { value: 'amazing' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => expect(mockedSearchApi.search).toHaveBeenCalled());
    expect(mockedSearchApi.search).toHaveBeenCalledWith('amazing', ['openhymnal']);
  });

  it('reports a source that could not be searched', async () => {
    mockedSearchApi.search.mockResolvedValue({
      results: [],
      totalCount: 0,
      failedSources: [{ source: 'session', name: 'The Session', error: 'Timed out' }],
    });

    renderTab();

    fireEvent.change(screen.getByPlaceholderText(/search for a song/i), {
      target: { value: 'amazing' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() =>
      expect(screen.getByText(/The Session could not be searched/i)).toBeInTheDocument()
    );
  });
});
