import React, { useState, useCallback } from 'react';
import type { Song } from '../../types';
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    Stack,
    TextField,
    Alert,
    Chip,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
    TextareaAutosize,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';
import { extractMetadata } from '../../lib/chordPro';
import { jszip } from 'jszip';
import * as JSZip from 'jszip';

// Simple hash function for content
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};

interface ImportItem {
  id: string; // temporary ID for tracking
  name: string;
  content: string;
  format: 'chordpro' | 'plaintext' | 'unknown';
  status: 'pending' | 'processing' | 'added' | 'updated' | 'skipped' | 'failed';
  error?: string;
  metadata?: any;
  song?: Song;
}

interface ImportReport {
  added: number;
  updated: number;
  skipped: number;
  failed: number;
  total: number;
  items: ImportItem[];
}

interface FolderTabProps {
  onImport: (song: Song) => void;
  onCancel: () => void;
}

export const FolderTab: React.FC<FolderTabProps> = ({ onImport, onCancel }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isZip, setIsZip] = useState(false);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [importing, setImporting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [needsReview, setNeedsReview] = useState<ImportItem[]>([]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setIsZip(false);
      setReport(null);
      setNeedsReview([]);
    }
  };

  // Handle ZIP file selection
  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setIsZip(true);
      setReport(null);
      setNeedsReview([]);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
      // Check if any file is a ZIP
      setIsZip(Array.from(e.dataTransfer.files).some(file => 
        file.name.toLowerCase().endsWith('.zip')
      ));
      setReport(null);
      setNeedsReview([]);
    }
  };

  // Parse file content
  const parseFileContent = async (file: File): Promise<{ content: string; format: 'chordpro' | 'plaintext' | 'unknown' }> => {
    const text = await file.text();
    
    // Simple format detection
    const format = text.includes('{start_of_') || text.includes('{title:') 
      ? 'chordpro' 
      : 'plaintext';
    
    return { content: text, format };
  };

  // Process a single file
  const processFile = async (file: File, index: tempId: string): Promise<ImportItem> => {
    try {
      const { content, format } = await parseFileContent(file);
      
      // Extract metadata
      const metadata = extractMetadata(content);
      
      // Create song object
      const song: Song = {
        id: crypto.randomUUID(),
        title: metadata.title,
        artist: metadata.artist,
        content: content,
        format: format,
        capo: metadata.capo,
        tags: ['imported'],
        key: metadata.key,
        bpm: undefined,
        timeSignature: '4/4',
        attribution: {
          sourceName: 'File Import',
          sourceUrl: '',
          license: 'Unknown',
          author: '',
          notes: `Imported from file: ${file.name}`
        },
        rightsStatus: 'unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hash: simpleHash(content)
      };
      
      return {
        id: tempId,
        name: file.name,
        content,
        format,
        status: 'pending',
        metadata,
        song
      };
    } catch (error) {
      return {
        id: tempId,
        name: file.name,
        content: '',
        format: 'unknown',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  // Start the import process
  const startImport = useCallback(async () => {
    if (files.length === 0) return;
    
    setImporting(true);
    setReport(null);
    
    // Create initial items
    const initialItems: ImportItem[] = await Promise.all(
      files.map((file, index) => processFile(file, `item-${index}`))
    );
    
    setNeedsReview(initialItems);
    
    // Process each item
    const results: ImportItem[] = [];
    
    for (const item of initialItems) {
      // Update status to processing
      setNeedsReview(prev => 
        prev.map(i => i.id === item.id ? { ...i, status: 'processing' } : i)
      );
      
      try {
        if (item.status === 'failed') {
          // Already failed during processing
          results.push(item);
          continue;
        }
        
        if (!item.song) {
          throw new Error('Song not created during processing');
        }
        
        // In a real implementation, we would check for duplicates here
        // For now, we'll just add all items
        onImport(item.song);
        
        // Mark as added
        setNeedsReview(prev => 
          prev.map(i => i.id === item.id ? { ...i, status: 'added', song: item.song } : i)
        );
        
        results.push({ ...item, status: 'added', song: item.song });
      } catch (error) {
        // Mark as failed
        setNeedsReview(prev => 
          prev.map(i => i.id === item.id ? { 
            ...i, 
            status: 'failed', 
            error: error instanceof Error ? error.message : 'Unknown error'
          } : i)
        );
        
        results.push({ 
          ...item, 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    // Generate report
    const added = results.filter(item => item.status === 'added').length;
    const updated = results.filter(item => item.status === 'updated').length;
    const skipped = results.filter(item => item.status === 'skipped').length;
    const failed = results.filter(item => item.status === 'failed').length;
    
    setReport({
      added,
      updated,
      skipped,
      failed,
      total: results.length,
      items: results
    });
    
    setImporting(false);
  }, [files, onImport]);

  // Handle importing all items
  const handleImportAll = () => {
    startImport();
  };

  // Handle retrying a failed item
  const handleRetryItem = async (itemId: string) => {
    setNeedsReview(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, status: 'pending' } : item
      )
    );
    
    // Find the original file for this item
    const item = needsReview.find(i => i.id === itemId);
    if (!item) return;
    
    const file = files.find(f => f.name === item.name);
    if (!file) return;
    
    // Re-process the file
    const processedItem = await processFile(file, itemId);
    
    setNeedsReview(prev => 
      prev.map(i => 
        i.id === itemId ? { ...processedItem, status: 'pending' } : i
      )
    );
  };

  // Handle skipping an item
  const handleSkipItem = (itemId: string) => {
    setNeedsReview(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, status: 'skipped' } : item
      )
    );
  };

  if (importing) {
    return (
      <Box sx={{ p: 3, width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
          <Button variant="contained" size="small" onClick={onCancel}>
            ← Back
          </Button>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Importing Files...
          </Typography>
          <Box sx={{ width: 36 }} /> {/* Spacer for alignment */}
        </Box>
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ flexGrow: 1, overflowY: 'auto', pb: 3 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            Processing {files.length} file{files.length !== 1 ? 's' : ''}...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
        <Button variant="contained" size="small" onClick={onCancel}>
          ← Back
        </Button>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Import from Files
        </Typography>
        <Box sx={{ width: 36 }} /> {/* Spacer for alignment */}
      </Box>
      <Divider sx={{ my: 2 }} />
      
      {!importing && !report && (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select files or a ZIP archive to import songs from.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="outlined" 
                component="label"
                sx={{ p: 2, borderRadius: 1, bgcolor: 'action.hover' }}
              >
                Select Files
                <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
              </Button>
              
              <Button 
                variant="outlined" 
                component="label"
                sx={{ p: 2, borderRadius: 1, bgcolor: 'action.hover' }}
              >
                Select ZIP Archive
                <input type="file" accept=".zip" onChange={handleZipChange} style={{ display: 'none' }} />
              </Button>
            </Box>
            
            <Typography sx={{ mt: 2, fontSize: '0.875rem', color: 'text.secondary' }}>
              Or drag and drop files here
            </Typography>
            
            <Box 
              sx={{ 
                border: '2px dashed', 
                borderColor: 'divider', 
                borderRadius: 2, 
                p: 4, 
                mt: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                onDragOver={handleDragOver},
                onDrop={handleDrop}
              }}
            >
              <Typography sx={{ mb: 1 }}>
                Drop files here
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                Supported formats: .txt, .cho, .chordpro, .pro, .zip
              </Typography>
            </Box>
          </Box>
          
          {files.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" component="h2" fontWeight="bold">
                Selected Files ({files.length})
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List sx={{ mt: 2 }}>
                {files.map((file, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemText 
                      primary={file.name} 
                      secondary={`${(file.size / 1024).toFixed(1)} KB`} 
                    />
                  </ListItem>
                ))}
              </List>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleImportAll}
                  sx={{ mx: 1 }}
                >
                  Import All
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={onCancel}
                  sx={{ mx: 1 }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </>
      )}
      
      {report && (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" component="h2" fontWeight="bold">
              Import Report
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={3}>
                <Typography variant="body2">Added:</Typography>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {report.added}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">Updated:</Typography>
                <Typography variant="h5" fontWeight="bold" color="info.main">
                  {report.updated}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">Skipped:</Typography>
                <Typography variant="h5" fontWeight="bold" color="warning.main">
                  {report.skipped}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">Failed:</Typography>
                <Typography variant="h5" fontWeight="bold" color="error.main">
                  {report.failed}
                </Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Items needing review:
              </Typography>
              <Divider sx={{ my: 2 }} />
              {needsReview.length > 0 && (
                <Box sx={{ height: 300, overflowY: 'auto', mb: 2 }}>
                  <List>
                    {needsReview.map((item, index) => (
                      <ListItem 
                        key={index} 
                        sx={{ py: 1, borderBottom: item.status === 'failed' ? '1px solid' : 'none', borderColor: item.status === 'failed' ? 'error.main' : 'divider' }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                            <Typography 
                              variant="body2" 
                              color={item.status === 'failed' ? 'error.main' : 'text.primary'}
                            >
                              {item.name}
                            </Typography>
                            {item.status !== 'pending' && (
                              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                                <Chip 
                                  label={item.status.charAt(0).toUpperCase() + item.status.slice(1)} 
                                  size="small"
                                  color={ 
                                    item.status === 'added' ? 'success' :
                                    item.status === 'updated' ? 'info' :
                                    item.status === 'skipped' ? 'warning' :
                                    item.status === 'failed' ? 'error' :
                                    'grey'
                                  }
                                />
                              </Box>
                            )}
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {item.status === 'failed' && (
                              <Button 
                                variant="text" 
                                size="small" 
                                onClick={() => handleRetryItem(item.id)}
                              >
                                Retry
                              </Button>
                            )}
                            {item.status !== 'added' && item.status !== 'updated' && (
                              <Button 
                                variant="text" 
                                size="small" 
                                onClick={() => handleSkipItem(item.id)}
                              >
                                Skip
                              </Button>
                            )}
                            {item.status === 'failed' && (
                              <Button 
                                variant="text" 
                                size="small" 
                                onClick={() => {
                                  // Show error details in a dialog or expandable section
                                  alert(`Error processing ${item.name}:${item.error}`);
                                }}
                              >
                                Details
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contracted" 
                  color="primary" 
                  onClick={handleImportAll}
                  sx={{ mx: 1 }}
                  disabled={importing}
                >
                  {importing ? 'Importing...' : 'Import All'}
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={onCancel}
                  sx={{ mx: 1 }}
                >
                  Close
                </Button>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};