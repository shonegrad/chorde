import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Song, ImportSource, LicenseType } from '../types';
import { extractMetadata } from '../lib/chordPro';
import { createId } from '../lib/id';
import { isOnlineSearchEnabled } from '../lib/features';
import { useNotification } from '../context/NotificationContext';
import { Container, Typography, Box, IconButton, Tabs, Tab, Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LegalNoticeModal } from './import/LegalNoticeModal';
import { PasteTab } from './import/PasteTab';
import { SearchTab } from './import/SearchTab';
import { FolderTab } from './import/FolderTab';

const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

interface SongImporterProps {
  onImport: (song: Song) => void | Promise<void>;
  onCancel: () => void;
}

interface ImportSummary {
  total: number;
  added: number;
  pending: number;
  failed: number;
}

const isPublicDomain = (license: LicenseType): boolean => license === 'public-domain';

/**
 * Work out the licence of an imported song.
 *
 * A source that declares its licence wins. Otherwise we fall back to the
 * `{copyright:}` directive, and finally to "unknown".
 */
const resolveLicense = (
  content: string,
  source?: ImportSource
): { license: LicenseType; copyright: string } => {
  if (source?.license) {
    return { license: source.license, copyright: '' };
  }

  const copyrightMatch = content.match(/\{copyright:\s*(.+?)\}/i);
  if (!copyrightMatch) return { license: 'unknown', copyright: '' };

  const copyright = copyrightMatch[1].trim();
  const lowerCopyright = copyright.toLowerCase();
  if (lowerCopyright.includes('public domain') || lowerCopyright.includes('cc0')) {
    return { license: 'public-domain', copyright };
  }
  if (
    lowerCopyright.includes('creative commons') ||
    lowerCopyright.includes('cc-by') ||
    lowerCopyright.includes('cc by')
  ) {
    return { license: 'creative-commons-by', copyright };
  }

  return { license: 'unknown', copyright };
};

/** Tags declared inside the ChordPro content, if any. */
const extractTags = (content: string): string[] => {
  const match = content.match(/\{tags:\s*([^}]+)\}/i);
  if (!match) return [];
  return match[1]
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
};

export const SongImporter: React.FC<SongImporterProps> = ({ onImport, onCancel }) => {
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotification();
  const [activeTab, setActiveTab] = useState(0);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [pendingSongs, setPendingSongs] = useState<Song[]>([]);
  const onlineSearchEnabled = isOnlineSearchEnabled();

  const buildSong = (content: string, source?: ImportSource): Song => {
    const metadata = extractMetadata(content);
    const { license, copyright } = resolveLicense(content, source);
    const tags = Array.from(new Set(['imported', ...extractTags(content)]));

    return {
      id: createId(),
      title: metadata.title,
      artist: metadata.artist,
      content,
      format:
        content.includes('{start_of_') || content.includes('{title:') ? 'chordpro' : 'plaintext',
      capo: metadata.capo,
      tags,
      key: metadata.key,
      bpm: metadata.tempo,
      timeSignature: metadata.timeSignature ?? '4/4',
      attribution: {
        sourceName: source?.name ?? 'User Import',
        sourceUrl: source?.url ?? '',
        license,
        author: metadata.artist,
        notes: source ? `Imported from ${source.name}` : 'Imported by user',
        copyright,
        verifiedAt: new Date().toISOString(),
        verifiedBy: 'auto',
      },
      rightsStatus: isPublicDomain(license) ? 'open' : 'unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hash: simpleHash(content),
    };
  };

  const importSong = async (song: Song): Promise<void> => {
    await onImport(song);
  };

  /**
   * Import a single song.
   *
   * Public-domain material is imported straight away; anything else is queued
   * for a single rights confirmation.
   */
  const handleImportFromContent = async (content: string, source?: ImportSource) => {
    if (!content.trim()) return;

    const song = buildSong(content, source);

    if (!isPublicDomain(song.attribution.license)) {
      setPendingSongs([song]);
      return;
    }

    try {
      await importSong(song);
      notifySuccess(`Imported "${song.title}"`);
      navigate(`/song/${song.id}`);
    } catch {
      notifyError(`Failed to import "${song.title}"`);
    }
  };

  /**
   * Import many songs at once.
   *
   * Every song is either imported or queued for confirmation - nothing is
   * silently dropped, and the summary reports the real numbers.
   */
  const handleBatchImport = async (contents: string[]) => {
    let added = 0;
    let failed = 0;
    const queued: Song[] = [];

    for (const content of contents) {
      try {
        const song = buildSong(content);
        if (isPublicDomain(song.attribution.license)) {
          await importSong(song);
          added += 1;
        } else {
          queued.push(song);
        }
      } catch {
        failed += 1;
      }
    }

    setImportSummary({ total: contents.length, added, pending: queued.length, failed });

    if (queued.length > 0) {
      setPendingSongs(queued);
    } else if (added > 0) {
      notifySuccess(`Imported ${added} ${added === 1 ? 'song' : 'songs'}`);
    }
  };

  const confirmPending = async () => {
    const songs = pendingSongs;
    setPendingSongs([]);
    let added = 0;
    for (const song of songs) {
      try {
        await importSong(song);
        added += 1;
      } catch {
        // Ignore individual failures; the summary below reports the count.
      }
    }
    notifySuccess(`Imported ${added} ${added === 1 ? 'song' : 'songs'}`);
    setImportSummary((previous) =>
      previous
        ? { ...previous, added: previous.added + added, pending: 0 }
        : { total: songs.length, added, pending: 0, failed: 0 }
    );
  };

  const tabs = [
    { key: 'paste', label: 'Paste / Drop' },
    ...(onlineSearchEnabled ? [{ key: 'search', label: 'Search Online' }] : []),
    { key: 'folder', label: 'From Folder' },
  ];
  const activeTabKey = tabs[Math.min(activeTab, tabs.length - 1)].key;

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4, height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Import Song
        </Typography>
        <IconButton onClick={onCancel} size="large" aria-label="Close import">
          <CloseIcon />
        </IconButton>
      </Box>

      <LegalNoticeModal
        isOpen={pendingSongs.length > 0}
        onClose={() => setPendingSongs([])}
        onConfirm={confirmPending}
        songs={pendingSongs.map((song) => ({
          title: song.title,
          artist: song.artist,
          license: song.attribution.license,
          copyright: song.attribution.copyright,
          sourceName: song.attribution.sourceName,
        }))}
      />

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        {tabs.map((tab) => (
          <Tab key={tab.key} label={tab.label} />
        ))}
      </Tabs>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {activeTabKey === 'paste' && (
          <PasteTab onImport={handleImportFromContent} onCancel={onCancel} />
        )}
        {activeTabKey === 'search' && (
          <SearchTab onImport={handleImportFromContent} onCancel={onCancel} />
        )}
        {activeTabKey === 'folder' && (
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
          severity={
            importSummary?.failed === 0 && importSummary.pending === 0 ? 'success' : 'warning'
          }
          onClose={() => setImportSummary(null)}
        >
          {importSummary ? buildSummaryText(importSummary) : ''}
        </Alert>
      </Snackbar>
    </Container>
  );
};

const buildSummaryText = (summary: ImportSummary): string => {
  const parts = [`Imported ${summary.added}/${summary.total} songs`];
  if (summary.pending > 0) {
    parts.push(`${summary.pending} awaiting confirmation`);
  }
  if (summary.failed > 0) {
    parts.push(`${summary.failed} failed`);
  }
  return parts.join(' · ');
};
