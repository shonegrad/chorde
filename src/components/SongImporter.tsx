import React, { useState, useEffect } from 'react';
import type { Song } from '../types';
import { extractMetadata } from '../lib/chordPro';
import {
    Container,
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    Stack,
    Divider,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface SongImporterProps {
    onImport: (song: Song) => void;
    onCancel: () => void;
}

export const SongImporter: React.FC<SongImporterProps> = ({ onImport, onCancel }) => {
    const [content, setContent] = useState('');
    const [preview, setPreview] = useState<{ title: string; artist: string; key?: string; capo?: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!content.trim()) {
            setPreview(null);
            return;
        }
        const metadata = extractMetadata(content);
        setPreview(metadata);
    }, [content]);

    const handleImport = () => {
        if (!content.trim()) return;

        const metadata = extractMetadata(content);
        const song: Song = {
            id: crypto.randomUUID(),
            title: metadata.title,
            artist: metadata.artist,
            content: content,
            key: metadata.key,
            capo: metadata.capo,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            tags: ['imported']
        };

        onImport(song);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Import Song
                </Typography>
                <IconButton onClick={onCancel} size="large">
                    <CloseIcon />
                </IconButton>
            </Box>

            <Typography variant="body1" color="text.secondary" paragraph>
                Paste your ChordPro formatted song below or drop a file. We'll automatically extract metadata.
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ flex: 1, minHeight: 0 }}>
                {/* Input Area */}
                <Box
                    sx={{
                        flex: 1,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    onDragOver={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(true);
                    }}
                    onDragLeave={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(false);
                    }}
                    onDrop={async e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(false);

                        const file = e.dataTransfer.files[0];
                        if (file) {
                            let text = await file.text();
                            const metadata = extractMetadata(text);
                            if (!metadata.title || metadata.title === 'Untitled Song') {
                                const filenameTitle = file.name.replace(/\.(txt|cho|crd|chordpro)$/i, '').replace(/[-_]/g, ' ');
                                text = `{title: ${filenameTitle}}\n` + text;
                            }
                            setContent(text);
                        }
                    }}
                >
                    <TextField
                        multiline
                        fullWidth
                        placeholder="Paste ChordPro text here... OR Drop a file!"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        sx={{
                            flex: 1,
                            '& .MuiInputBase-root': {
                                height: '100%',
                                alignItems: 'flex-start',
                                fontFamily: 'monospace',
                                bgcolor: 'background.paper'
                            }
                        }}
                    />

                    {isDragging && (
                        <Box sx={{
                            position: 'absolute',
                            inset: 0,
                            bgcolor: 'rgba(234, 179, 8, 0.1)', // amber-500 with opacity
                            border: '2px dashed',
                            borderColor: 'primary.main',
                            zIndex: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(2px)',
                            borderRadius: 1
                        }}>
                            <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <CloudUploadIcon color="primary" sx={{ fontSize: 48 }} />
                                <Typography variant="h6" color="primary">
                                    Drop file to import!
                                </Typography>
                            </Paper>
                        </Box>
                    )}
                </Box>

                {/* Preview Panel */}
                <Paper variant="outlined" sx={{ width: { xs: '100%', md: 320 }, p: 3, height: 'fit-content' }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Preview
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {preview ? (
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Title</Typography>
                                <Typography variant="subtitle1" fontWeight="bold">{preview.title}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Artist</Typography>
                                <Typography variant="body1">{preview.artist}</Typography>
                            </Box>
                            <Stack direction="row" spacing={4}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Key</Typography>
                                    <Typography variant="body1">{preview.key || '-'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Capo</Typography>
                                    <Typography variant="body1">{preview.capo || '-'}</Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    ) : (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            Start typing to see preview...
                        </Typography>
                    )}

                    <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button onClick={onCancel}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleImport}
                            disabled={!content.trim()}
                        >
                            Import Song
                        </Button>
                    </Box>
                </Paper>
            </Stack>
        </Container>
    );
};
