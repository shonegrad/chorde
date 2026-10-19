import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

type ImportStatus = 'ready' | 'added' | 'failed';

interface ImportItem {
  id: string;
  name: string;
  size: number;
  status: ImportStatus;
  error?: string;
}

interface FolderTabProps {
  onImport: (contents: string[]) => void;
  onCancel: () => void;
}

const supportedExtensions = ['.txt', '.cho', '.pro', '.chordpro'];

const isSupportedFile = (file: File) => {
  const lower = file.name.toLowerCase();
  return supportedExtensions.some((ext) => lower.endsWith(ext));
};

export const FolderTab: React.FC<FolderTabProps> = ({ onImport, onCancel }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [items, setItems] = useState<ImportItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const counts = useMemo(() => {
    return {
      added: items.filter((item) => item.status === 'added').length,
      failed: items.filter((item) => item.status === 'failed').length,
      total: items.length,
    };
  }, [items]);

  const loadFiles = (selected: File[]) => {
    setError(null);
    setFiles(selected);
    setItems(
      selected.map((file, index) => ({
        id: `${file.name}-${index}`,
        name: file.name,
        size: file.size,
        status: 'ready',
      }))
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    loadFiles(selected);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const selected = Array.from(event.dataTransfer.files ?? []);
    loadFiles(selected);
  };

  const handleImportAll = async () => {
    if (files.length === 0) {
      setError('Select one or more files first.');
      return;
    }

    setImporting(true);
    const nextItems: ImportItem[] = [];
    const validContents: string[] = [];

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];

      if (!isSupportedFile(file)) {
        nextItems.push({
          id: `${file.name}-${index}`,
          name: file.name,
          size: file.size,
          status: 'failed',
          error: 'Unsupported file type',
        });
        continue;
      }

      try {
        const content = await file.text();
        if (!content.trim()) {
          throw new Error('Empty file');
        }

        validContents.push(content);
        nextItems.push({
          id: `${file.name}-${index}`,
          name: file.name,
          size: file.size,
          status: 'added',
        });
      } catch (err) {
        nextItems.push({
          id: `${file.name}-${index}`,
          name: file.name,
          size: file.size,
          status: 'failed',
          error: err instanceof Error ? err.message : 'Import failed',
        });
      }
    }

    setItems(nextItems);
    setImporting(false);

    if (validContents.length > 0) {
      onImport(validContents);
    }
  };

  return (
    <Stack spacing={3} sx={{ flex: 1, minHeight: 0 }}>
      {error && <Alert severity="error">{error}</Alert>}

      <Paper
        variant="outlined"
        sx={{
          p: 4,
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: dragging ? 'primary.main' : 'divider',
          bgcolor: dragging ? 'action.hover' : 'background.paper',
          textAlign: 'center',
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={handleDrop}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Import from files
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Drop supported song files here or choose them manually.
        </Typography>
        <Button variant="contained" component="label">
          Choose Files
          <input hidden multiple type="file" onChange={handleInputChange} />
        </Button>
        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
          Supported: {supportedExtensions.join(', ')}
        </Typography>
      </Paper>

      {items.length > 0 && (
        <Paper variant="outlined" sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          <Box sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
              <Chip label={`Total ${counts.total}`} size="small" />
              <Chip label={`Added ${counts.added}`} size="small" color="success" />
              <Chip label={`Failed ${counts.failed}`} size="small" color="error" />
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <List disablePadding>
              {items.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemText
                    primary={item.name}
                    secondary={item.error ?? `${(item.size / 1024).toFixed(1)} KB`}
                  />
                  <Chip
                    label={item.status}
                    size="small"
                    color={
                      item.status === 'added'
                        ? 'success'
                        : item.status === 'failed'
                          ? 'error'
                          : 'default'
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleImportAll}
          disabled={importing || files.length === 0}
        >
          {importing ? 'Importing...' : 'Import All'}
        </Button>
      </Box>
    </Stack>
  );
};
