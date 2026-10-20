import type { Song } from '../types';
import { createId } from './id';

const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

export const REQUIRED_SONG_FIELDS = [
  'id',
  'title',
  'artist',
  'content',
  'createdAt',
  'updatedAt',
] as const;

export const RECOMMENDED_SONG_FIELDS = [
  'format',
  'key',
  'tags',
  'bpm',
  'timeSignature',
  'attribution',
  'rightsStatus',
  'hash',
] as const;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateSong = (song: Song): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const field of REQUIRED_SONG_FIELDS) {
    if (song[field as keyof Song] === undefined || song[field as keyof Song] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (!song.id || typeof song.id !== 'string') {
    errors.push('id must be a non-empty string');
  }

  if (!song.title || typeof song.title !== 'string') {
    errors.push('title must be a non-empty string');
  }

  if (!song.artist || typeof song.artist !== 'string') {
    errors.push('artist must be a non-empty string');
  }

  if (!song.content || typeof song.content !== 'string') {
    errors.push('content must be a non-empty string');
  }

  if (!song.hash) {
    warnings.push('Missing hash - add for change detection');
  }

  if (!song.format) {
    warnings.push('Missing format - add for parsing hints');
  }

  if (!song.attribution) {
    warnings.push('Missing attribution - add source/license info');
  }

  if (!song.rightsStatus) {
    warnings.push('Missing rightsStatus - add for copyright clarity');
  }

  if (!song.key) {
    warnings.push('Missing key - add for transposition');
  }

  if (!song.tags || song.tags.length === 0) {
    warnings.push('Missing tags - add for filtering');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

export const validateSongs = (songs: Song[], sourceName: string): ValidationResult => {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  const seenIds = new Set<string>();

  for (const song of songs) {
    const result = validateSong(song);

    if (!result.valid) {
      for (const error of result.errors) {
        allErrors.push(`[${sourceName}] ${song.id || '<unknown>'}: ${error}`);
      }
    }

    if (result.warnings.length > 0) {
      for (const warning of result.warnings) {
        allWarnings.push(`[${sourceName}] ${song.id || '<unknown>'}: ${warning}`);
      }
    }

    if (seenIds.has(song.id)) {
      allErrors.push(`[${sourceName}] Duplicate song id: ${song.id}`);
    }
    seenIds.add(song.id);
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
};

export const normalizeSong = (song: Partial<Song> & { content: string }): Song => {
  const now = new Date().toISOString();

  return {
    id: song.id || createId(),
    title: song.title || 'Untitled',
    artist: song.artist || 'Unknown Artist',
    content: song.content,
    format: song.format ?? 'chordpro',
    capo: song.capo,
    tags: song.tags ?? [],
    key: song.key,
    bpm: song.bpm,
    timeSignature: song.timeSignature ?? '4/4',
    attribution: song.attribution ?? {
      sourceName: 'Unknown',
      sourceUrl: '',
      license: 'Unknown',
      author: '',
      notes: '',
    },
    rightsStatus: song.rightsStatus ?? 'unknown',
    createdAt: song.createdAt ?? now,
    updatedAt: song.updatedAt ?? now,
    hash: song.hash ?? simpleHash(song.content),
  } as Song;
};
