/**
 * The formats a song can come in.
 *
 * ChordPro is what the app reads. Everything else is turned into ChordPro
 * first, so that there is only one format to read, one parser, and one set of
 * rules.
 */

import { convertOnSongToChordPro } from '@chorde/shared';
import { parseChordName } from './voicings';

/** The files the app can read. */
export const SUPPORTED_EXTENSIONS = [
  '.txt',
  '.cho',
  '.pro',
  '.chordpro',
  '.chopro',
  '.onsong',
  '.onsongpro',
  '.crd',
] as const;

/** Whether a file name is one the app can read. */
export const isSupportedFileName = (name: string): boolean => {
  const lower = name.toLowerCase();
  return SUPPORTED_EXTENSIONS.some((extension) => lower.endsWith(extension));
};

/** The name of a file without its extension, for use as a title. */
export const titleFromFileName = (name: string): string =>
  name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]/g, ' ')
    .trim();

/**
 * The sections a legacy ChordPro file can have.
 */
const CRD_SECTIONS: Record<string, string> = {
  verse: 'verse',
  chorus: 'chorus',
  bridge: 'bridge',
  intro: 'intro',
  outro: 'outro',
  interlude: 'interlude',
  tag: 'tag',
  'pre-chorus': 'pre_chorus',
  prechorus: 'pre_chorus',
};

const crdSectionOf = (name: string): string | undefined => {
  const match = name.match(
    /^(verse|chorus|bridge|intro|outro|interlude|tag|pre-?chorus)\s*(\d*)$/i
  );
  if (!match) return undefined;
  const type = CRD_SECTIONS[match[1].toLowerCase()] ?? 'verse';
  return match[2] ? `${type}${match[2]}` : type;
};

/** Whether a word could be a chord. */
const isChordName = (word: string): boolean => parseChordName(word) !== null;

/**
 * Whether a line of a legacy file is a line of chords.
 *
 * A line of chords holds nothing but chords, and the words are under it.
 */
const isChordLine = (line: string): boolean => {
  const trimmed = line.trim();
  if (!trimmed) return false;

  const words = trimmed.split(/\s+/);
  if (!words.every(isChordName)) return false;

  // A single letter is a chord, but it is far more often a word.
  if (words.length === 1 && words[0].length === 1) return false;

  return true;
};

/**
 * Put the chords of a legacy file over the words they belong to.
 *
 * In a legacy file the chords are written in a line above the words, and they
 * line up with the words by their place in the line. A chord belongs to the
 * first word that starts at or after it.
 */
const mergeCrdLines = (chordLine: string, lyricLine: string): string => {
  const chords: { column: number; name: string }[] = [];
  const chordPattern = /[A-G][#b]?[A-Za-z0-9#b()+\-./]*/g;
  let match: RegExpExecArray | null;

  while ((match = chordPattern.exec(chordLine)) !== null) {
    const name = match[0];
    if (!isChordName(name)) continue;
    chords.push({ column: match.index, name });
  }

  if (chords.length === 0) return lyricLine;

  const words: { start: number }[] = [];
  const wordPattern = /\S+/g;
  while ((match = wordPattern.exec(lyricLine)) !== null) {
    words.push({ start: match.index });
  }

  const parts: string[] = [];
  let cursor = 0;
  let chordIndex = 0;

  for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
    const word = words[wordIndex];
    const previousEnd = wordIndex === 0 ? -1 : words[wordIndex - 1].start;

    const group: string[] = [];
    while (chordIndex < chords.length && chords[chordIndex].column <= word.start) {
      if (chords[chordIndex].column > previousEnd) {
        group.push(chords[chordIndex].name);
      }
      chordIndex += 1;
    }

    if (group.length === 0) continue;

    parts.push(lyricLine.slice(cursor, word.start));
    parts.push(group.map((chord) => `[${chord}]`).join(''));
    cursor = word.start;
  }

  parts.push(lyricLine.slice(cursor));

  // A chord that is past the end of the words has no word of its own.
  const trailing = chords.slice(chordIndex);
  if (trailing.length > 0) {
    parts.push(trailing.map((chord) => `[${chord}]`).join(''));
  }

  return parts.join('');
};

/**
 * Turn a legacy ChordPro file into ChordPro.
 *
 * The old format has no directives for its sections: they are plain lines
 * that end in a colon. The chords are on a line of their own, above the
 * words, and they line up with the words by their place in the line.
 */
export const convertCrdToChordPro = (content: string, filename = ''): string => {
  const lines = content.split('\n');
  const out: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    // A directive is already ChordPro.
    if (/^\{[^{}]*\}$/.test(trimmed)) {
      out.push(trimmed);
      index += 1;
      continue;
    }

    // A section: a plain line that ends in a colon.
    const section = crdSectionOf(trimmed.replace(/:\s*$/, ''));
    if (section && trimmed.endsWith(':')) {
      out.push(`{start_of_${section}}`);
      index += 1;
      continue;
    }

    // A line of chords, with the words under it.
    const next = index + 1 < lines.length ? lines[index + 1] : undefined;
    if (next !== undefined && next.trim() && isChordLine(line) && !isChordLine(next)) {
      out.push(mergeCrdLines(line, next));
      index += 2;
      continue;
    }

    out.push(line);
    index += 1;
  }

  const text = out.join('\n');

  // A file with no title of its own is named after the file.
  if (!/\{title:/i.test(text)) {
    return `{title: ${titleFromFileName(filename) || 'Untitled Song'}}\n${text}`;
  }

  return text;
};

/**
 * Read a file of any of the supported formats as ChordPro.
 */
export const readSongFile = async (file: File): Promise<string> => {
  const text = await file.text();
  const lower = file.name.toLowerCase();

  if (lower.endsWith('.onsong') || lower.endsWith('.onsongpro')) {
    return convertOnSongToChordPro(text, file.name);
  }

  if (lower.endsWith('.crd')) {
    return convertCrdToChordPro(text, file.name);
  }

  return text;
};
