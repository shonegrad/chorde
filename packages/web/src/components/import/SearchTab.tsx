import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Alert,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searchApi } from '../../services/searchApi';
import type { SearchResult } from '../../services/searchApi';
import { SearchResults } from './SearchResults';

interface SearchTabProps {
  onImport: (chordPro: string) => void;
  onCancel: () => void;
}

export const SearchTab: React.FC<SearchTabProps> = ({ onImport, onCancel }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [previewLoading, setPreviewLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);
    setExpandedId(null);
    setPreview(undefined);

    try {
      const response = await searchApi.search(query);
      setResults(response.results);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
         setError('Cannot connect to search server. Please ensure the API is running (npm run dev:api).');
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
      setError(message.includes('Failed to fetch') ? 'Connection error. Check API server.' : message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleImport = async (result: SearchResult) => {
    try {
      const songContent = await searchApi.fetchSong(result.source, result.id);
      onImport(songContent.chordPro);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to import song';
      setError(message.includes('Failed to fetch') ? 'Connection error. Check API server.' : message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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
          onChange={e => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
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

      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
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
