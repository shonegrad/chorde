import React, { useState } from 'react';
import type { Song } from '../types';
import { extractMetadata } from '../lib/chordPro';
import {
    Container,
    Typography,
    Box,
    IconButton,
    Tabs,
    Tab,
    Snackbar,
    Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PasteTab } from './import/PasteTab';
import { SearchTab } from './import/SearchTab';
import { FolderTab } from './import/FolderTab';

const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

interface SongImporterProps {
    onImport: (song: Song) => void;
    onCancel: () => void;
}

export const SongImporter: React.FC<SongImporterProps> = ({ onImport, onCancel }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [importSummary, setImportSummary] = useState<{ total: number; added: number; failed: number } | null>(null);

    const handleImportFromContent = (content: string) => {
        if (!content.trim()) return;

        const metadata = extractMetadata(content);
        const song: Song = {
            id: crypto.randomUUID(),
            title: metadata.title,
            artist: metadata.artist,
            content: content,
            format: content.includes('{start_of_') || content.includes('{title:') ? 'chordpro' : 'plaintext',
            capo: metadata.capo,
            tags: ['imported'],
            key: metadata.key,
            bpm: undefined,
            timeSignature: '4/4',
            attribution: {
              sourceName: 'User Import',
              sourceUrl: '',
              license: 'Unknown',
              author: '',
              notes: 'Imported by user'
            },
            rightsStatus: 'unknown',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            hash: simpleHash(content)
        };

        onImport(song);
    };

    const handleBatchImport = (contents: string[]) => {
        let added = 0;
        let failed = 0;

        for (const content of contents) {
            try {
                handleImportFromContent(content);
                added += 1;
            } catch {
                failed += 1;
            }
        }

        setImportSummary({ total: contents.length, added, failed });
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

            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                <Tab label="Paste / Drop" />
                <Tab label="Search Online" />
                <Tab label="From Folder" />
            </Tabs>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                {activeTab === 0 && (
                    <PasteTab onImport={handleImportFromContent} onCancel={onCancel} />
                )}
                {activeTab === 1 && (
                    <SearchTab onImport={handleImportFromContent} onCancel={onCancel} />
                )}
                {activeTab === 2 && (
                    <FolderTab onImport={handleBatchImport} onCancel={onCancel} />
                )}
            </Box>

            <Snackbar
                open={!!importSummary}
                autoHideDuration={5000}
                onClose={() => setImportSummary(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={importSummary?.failed === 0 ? 'success' : 'warning'}
                    onClose={() => setImportSummary(null)}
                >
                    {importSummary
                        ? `Imported ${importSummary.added}/${importSummary.total} songs${importSummary.failed > 0 ? ` (${importSummary.failed} failed)` : ''}`
                        : ''}
                </Alert>
            </Snackbar>
        </Container>
    );
};
