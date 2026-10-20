import React from 'react';
import { Alert, Box } from '@mui/material';

/**
 * Shown when the browser refused to give us persistent storage.
 *
 * Without this, the app silently falls back to an in-memory library and every
 * save fails with a generic error.
 */
export const StorageWarning: React.FC = () => (
  <Box sx={{ px: 2, pt: 2 }}>
    <Alert severity="warning" variant="filled">
      Storage is unavailable in this browser, so changes cannot be saved. Your library will reset
      when the page is reloaded. Try a normal (non-private) browsing window.
    </Alert>
  </Box>
);
