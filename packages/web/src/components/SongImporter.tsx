import React, { useState } from 'react';
import type { Song } from '../types';
import { extractMetadata } from '../lib/chordPro';
import {
    Container,
    Typography,
    Box,
    IconButton,
    Tabs,
    Tab
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PasteTab } from './import/PasteTab';
import { SearchTab } from './import/SearchTab';
import { FolderTab } from './import/FolderTab';

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

interface SongImporterProps {
    onImport: (song: Song) => void;
    onCancel: () => void;
}

export const SongImporter: React.FC<SongImporterProps> = ({ onImport, onCancel }) => {
    const [activeTab, setActiveTab] = useState(0);

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
                    <FolderTab onImport={handleImportFromContent} onCancel={onCancel} />
                )}
            </Box>
        </Container>
    );
};
