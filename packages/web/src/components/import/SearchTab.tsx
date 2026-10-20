import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searchApi } from '../../services/searchApi';
import type { SearchResult, ImportSource, Source } from '../../types';
import { SearchResults } from './SearchResults';

interface SearchTabProps {
  onImport: (chordPro: string, source?: ImportSource) => void;
  onCancel: () => void;
}

interface FailedSource {
  source: string;
  name: string;
  error: string;
}

export const SearchTab: React.FC<SearchTabProps> = ({ onImport, onCancel }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedSources, setFailedSources] = useState<FailedSource[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  // The available sources are needed before a search can be narrowed down.
  useEffect(() => {
    let cancelled = false;
    searchApi
      .getSources()
      .then((available) => {
        if (!cancelled) setSources(available);
      })
      .catch(() => {
        // The list of sources is a nicety; a search still works without it.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleSource = (id: string) => {
    setSelectedSources((previous) =>
      previous.includes(id) ? previous.filter((source) => source !== id) : [...previous, id]
    );
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);
    setFailedSources([]);
    setExpandedId(null);
    setPreview(undefined);

    try {
      const response = await searchApi.search(
        query,
        selectedSources.length > 0 ? selectedSources : undefined
      );
      setResults(response.results);
      setFailedSources(response.failedSources ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
        setError(
          'Cannot connect to search server. Please ensure the API is running (npm run dev:api).'
        );
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = async (result: SearchResult) => {
    const resultId = `${result.source}-${result.id}`;

    // Toggle collapse
    if (expandedId === resultId) {
      setExpandedId(null);
      setPreview(undefined);
      return;
    }

    setExpandedId(resultId);
    setPreview(undefined);
    setPreviewLoading(true);

    try {
      const songContent = await searchApi.fetchSong(result.source, result.id);
      setPreview(songContent.chordPro);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load preview';
      setError(
        message.includes('Failed to fetch') ? 'Connection error. Check API server.' : message
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleImport = async (result: SearchResult) => {
    try {
      const songContent = await searchApi.fetchSong(result.source, result.id);
      onImport(songContent.chordPro, {
        name: songContent.sourceName ?? result.source,
        url: songContent.sourceUrl,
        license: songContent.license ?? result.license,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to import song';
      setError(
        message.includes('Failed to fetch') ? 'Connection error. Check API server.' : message
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Search Input */}
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          placeholder="Search for a song... (e.g., Amazing Grace)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={!query.trim() || loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
      </Stack>

      {/* Sources to search */}
      {sources.length > 1 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
          {sources.map((source) => {
            const selected = selectedSources.includes(source.id);
            return (
              <Chip
                key={source.id}
                label={source.name}
                color={selected ? 'primary' : 'default'}
                variant={selected ? 'filled' : 'outlined'}
                onClick={() => toggleSource(source.id)}
                clickable
                aria-pressed={selected}
              />
            );
          })}
          {selectedSources.length > 0 && (
            <Chip
              label="All sources"
              size="small"
              variant="outlined"
              onClick={() => setSelectedSources([])}
              clickable
            />
          )}
        </Stack>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Sources that could not be reached */}
      {failedSources.length > 0 && (
        <Alert severity="warning" onClose={() => setFailedSources([])}>
          {failedSources.length === 1
            ? `${failedSources[0].name} could not be searched: ${failedSources[0].error}`
            : `${failedSources.length} sources could not be searched: ${failedSources
                .map((source) => source.name)
                .join(', ')}`}
        </Alert>
      )}

      {/* Results */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <SearchResults
          results={results}
          onImport={handleImport}
          onExpand={handleExpand}
          expandedId={expandedId}
          preview={preview}
          loading={previewLoading}
        />
      )}

      {/* Cancel Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto', pt: 2 }}>
        <Button onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
};
