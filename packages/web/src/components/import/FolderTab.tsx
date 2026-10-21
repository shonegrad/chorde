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
import { SUPPORTED_EXTENSIONS, isSupportedFileName, readSongFile } from '../../lib/importFormats';
import { readZip } from '../../lib/zip';

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

/**
 * Every file inside a dropped folder.
 *
 * A dropped folder is not a file, so the browser has to be asked for its
 * contents, one folder at a time.
 */
const filesInDirectory = async (entry: FileSystemDirectoryEntry): Promise<File[]> => {
  const reader = entry.createReader();
  const files: File[] = [];

  // readEntries returns at most a hundred entries at a time.
  for (;;) {
    const entries = await new Promise<FileSystemEntry[]>((resolve) => {
      reader.readEntries(resolve, () => resolve([]));
    });
    if (entries.length === 0) break;

    for (const child of entries) {
      if (child.isFile) {
        const file = await new Promise<File | null>((resolve) => {
          (child as FileSystemFileEntry).file(resolve, () => resolve(null));
        });
        if (file) files.push(file);
      } else if (child.isDirectory) {
        files.push(...(await filesInDirectory(child as FileSystemDirectoryEntry)));
      }
    }
  }

  return files;
};

/** Every file that was dropped, whether it is a file or a folder. */
const droppedFiles = async (dataTransfer: DataTransfer): Promise<File[]> => {
  const items = Array.from(dataTransfer.items ?? []);
  const entries = items
    .map((item) => (item.kind === 'file' ? item.webkitGetAsEntry?.() : null))
    .filter((entry): entry is FileSystemEntry => entry !== null && entry !== undefined);

  if (entries.length === 0) {
    return Array.from(dataTransfer.files ?? []);
  }

  const files: File[] = [];
  for (const entry of entries) {
    if (entry.isFile) {
      const file = await new Promise<File | null>((resolve) => {
        (entry as FileSystemFileEntry).file(resolve, () => resolve(null));
      });
      if (file) files.push(file);
    } else if (entry.isDirectory) {
      files.push(...(await filesInDirectory(entry as FileSystemDirectoryEntry)));
    }
  }

  return files;
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

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const selected = await droppedFiles(event.dataTransfer);
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
      const id = `${file.name}-${index}`;

      // An archive of songs is unpacked and each song inside it is imported.
      if (file.name.toLowerCase().endsWith('.zip')) {
        try {
          const entries = await readZip(file);
          let added = 0;

          for (const entry of entries) {
            if (!isSupportedFileName(entry.name)) continue;
            const text = await entry.read();
            if (!text.trim()) continue;
            validContents.push(text);
            added += 1;
          }

          if (added === 0) {
            throw new Error('No songs in the archive');
          }

          nextItems.push({ id, name: file.name, size: file.size, status: 'added' });
        } catch (err) {
          nextItems.push({
            id,
            name: file.name,
            size: file.size,
            status: 'failed',
            error: err instanceof Error ? err.message : 'Could not read the archive',
          });
        }
        continue;
      }

      if (!isSupportedFileName(file.name)) {
        nextItems.push({
          id,
          name: file.name,
          size: file.size,
          status: 'failed',
          error: 'Unsupported file type',
        });
        continue;
      }

      try {
        const content = await readSongFile(file);
        if (!content.trim()) {
          throw new Error('Empty file');
        }

        validContents.push(content);
        nextItems.push({ id, name: file.name, size: file.size, status: 'added' });
      } catch (err) {
        nextItems.push({
          id,
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
          Drop a folder of songs, a ZIP archive, or the files themselves here.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" component="label">
            Choose Files
            <input hidden multiple type="file" onChange={handleInputChange} />
          </Button>
          <Button variant="outlined" component="label">
            Choose a Folder
            <input
              hidden
              multiple
              type="file"
              onChange={handleInputChange}
              // @ts-expect-error - the folder picker is not in the type yet
              webkitdirectory=""
            />
          </Button>
        </Stack>
        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
          Supported: {SUPPORTED_EXTENSIONS.join(', ')}, .zip
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
