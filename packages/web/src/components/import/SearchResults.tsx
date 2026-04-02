import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Collapse,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { SearchResult } from '../../services/searchApi';

interface SearchResultItemProps {
  result: SearchResult;
  onImport: (result: SearchResult) => void;
  onExpand: (result: SearchResult) => void;
  expanded: boolean;
  preview?: string;
  loading?: boolean;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  result,
  onImport,
  onExpand,
  expanded,
  preview,
  loading
}) => {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" alignItems="flex-start" spacing={2}>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {result.title}
            </Typography>
            {result.key && (
              <Chip label={`Key: ${result.key}`} size="small" color="primary" variant="outlined" />
            )}
            {result.hasChords === false && (
              <Chip label="Lyrics Only" size="small" color="warning" variant="outlined" />
            )}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {result.artist}
          </Typography>
          <Chip label={result.source} size="small" sx={{ textTransform: 'capitalize' }} />
        </Box>

        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={() => onExpand(result)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <Button
            variant="contained"
            size="small"
            onClick={() => onImport(result)}
          >
            Import
          </Button>
        </Stack>
      </Stack>

      <Collapse in={expanded}>
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : preview ? (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: 'background.default',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap',
                maxHeight: 300,
                overflow: 'auto'
              }}
            >
              {preview}
            </Paper>
          ) : (
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              Click to load preview...
            </Typography>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

interface SearchResultsProps {
  results: SearchResult[];
  onImport: (result: SearchResult) => void;
  onExpand: (result: SearchResult) => void;
  expandedId: string | null;
  preview?: string;
  loading?: boolean;
  error?: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onImport,
  onExpand,
  expandedId,
  preview,
  loading,
  error
}) => {
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (results.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="body1" color="text.secondary">
          No results found. Try a different search term.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {results.length} {results.length === 1 ? 'result' : 'results'} found
      </Typography>
      <Stack spacing={2}>
        {results.map(result => (
          <SearchResultItem
            key={`${result.source}-${result.id}`}
            result={result}
            onImport={onImport}
            onExpand={onExpand}
            expanded={expandedId === `${result.source}-${result.id}`}
            preview={expandedId === `${result.source}-${result.id}` ? preview : undefined}
            loading={expandedId === `${result.source}-${result.id}` && loading}
          />
        ))}
      </Stack>
    </Box>
  );
};
