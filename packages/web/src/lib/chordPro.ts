import type { ParsedSong, ParsedLine, SongSection } from '../types';
import { parseChordName } from './voicings';

export interface SongMetadata {
  title: string;
  artist: string;
  key?: string;
  capo?: number;
  tempo?: number;
  timeSignature?: string;
  duration?: string;
}

export const extractMetadata = (content: string): SongMetadata => {
  const lines = content.split('\n');
  let title = 'Untitled Song';
  let artist: string | undefined;
  let subtitle: string | undefined;
  let key: string | undefined;
  let capo: number | undefined;
  let tempo: number | undefined;
  let timeSignature: string | undefined;
  let duration: string | undefined;

  for (const line of lines) {
    const trimmed = line.trim();

    // Title: {title: ...}, {t: ...}
    const titleMatch = trimmed.match(/\{(?:title|t):\s*([^}]+)\}/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
      continue;
    }

    // Artist: {artist: ...}, {a: ...}. Subtitle is kept as a fallback only.
    const artistMatch = trimmed.match(/\{(?:artist|a):\s*([^}]+)\}/i);
    if (artistMatch) {
      artist = artistMatch[1].trim();
      continue;
    }

    const subtitleMatch = trimmed.match(/\{(?:subtitle|st):\s*([^}]+)\}/i);
    if (subtitleMatch) {
      subtitle = subtitleMatch[1].trim();
      continue;
    }

    // Key: {key: ...}, {k: ...}
    const keyMatch = trimmed.match(/\{(?:key|k):\s*([^}]+)\}/i);
    if (keyMatch) {
      key = keyMatch[1].trim();
      continue;
    }

    // Capo: {capo: ...}, {c: ...}
    const capoMatch = trimmed.match(/\{(?:capo|c):\s*(\d+)\}/i);
    if (capoMatch) {
      capo = parseInt(capoMatch[1], 10);
      continue;
    }

    // Tempo: {tempo: ...}, {tempo: 120 bpm}
    const tempoMatch = trimmed.match(/\{(?:tempo):\s*(\d+)/i);
    if (tempoMatch) {
      tempo = parseInt(tempoMatch[1], 10);
      continue;
    }

    // Time signature: {time: ...}, {time: 4/4}
    const timeMatch = trimmed.match(/\{(?:time):\s*(\d+\s*\/\s*\d+)\}/i);
    if (timeMatch) {
      timeSignature = timeMatch[1].replace(/\s+/g, '');
      continue;
    }

    // Length: {duration: ...}, {duration: 4:28}
    const durationMatch = trimmed.match(/\{(?:duration):\s*([^}]+)\}/i);
    if (durationMatch) {
      duration = durationMatch[1].trim();
      continue;
    }
  }

  return {
    title,
    artist: artist || subtitle || 'Unknown Artist',
    key,
    capo,
    tempo,
    timeSignature,
    duration,
  };
};

interface SectionDefinition {
  keyword: string;
  type: SongSection['type'];
  label: string;
  /** Section types that repeat get an automatic counter ("Chorus 1", "Chorus 2"). */
  numbered: boolean;
}

const SECTION_DEFINITIONS: SectionDefinition[] = [
  { keyword: 'verse', type: 'verse', label: 'Verse', numbered: true },
  { keyword: 'chorus', type: 'chorus', label: 'Chorus', numbered: true },
  { keyword: 'bridge', type: 'bridge', label: 'Bridge', numbered: true },
  { keyword: 'intro', type: 'intro', label: 'Intro', numbered: false },
  { keyword: 'outro', type: 'outro', label: 'Outro', numbered: false },
  { keyword: 'solo', type: 'solo', label: 'Solo', numbered: false },
  { keyword: 'instrumental', type: 'instrumental', label: 'Instrumental', numbered: false },
  { keyword: 'tab', type: 'tab', label: 'Tab', numbered: false },
];

/** Short-form directives map straight onto a section type. */
const SHORT_DIRECTIVE_TYPES: Record<string, SectionDefinition['type']> = {
  sov: 'verse',
  soc: 'chorus',
  sob: 'bridge',
  soi: 'intro',
  soo: 'outro',
  sos: 'solo',
};

/**
 * The directives that say something about the song rather than about its
 * words. They are read by `extractMetadata` and are not part of the body.
 */
const METADATA_DIRECTIVES = new Set([
  'title',
  't',
  'artist',
  'a',
  'subtitle',
  'st',
  'composer',
  'lyricist',
  'album',
  'year',
  'key',
  'k',
  'capo',
  'tempo',
  'time',
  'duration',
  'copyright',
  'tags',
  'tag',
  'keynote',
  'define',
]);

/** The directives that carry a comment or a playing instruction. */
const COMMENT_DIRECTIVES = new Set(['comment', 'comment_start', 'comment_end', 'c_start', 'c_end']);

/**
 * Work out the label for a section directive.
 *
 * `{start_of_chorus1}` -> "Chorus 1", `{start_of_verse: My verse}` -> "My verse",
 * and a bare `{start_of_chorus}` -> "Chorus 1" using a per-type counter.
 */
export const resolveSectionLabel = (
  typePart: string,
  customLabel: string,
  definition: SectionDefinition,
  counter: number
): string => {
  if (customLabel) return customLabel;

  const trailingNumber = typePart.trim().match(/(\d+)\s*$/);
  if (trailingNumber) {
    return `${definition.label} ${parseInt(trailingNumber[1], 10)}`;
  }

  return definition.numbered ? `${definition.label} ${counter}` : definition.label;
};

const findSectionDefinition = (typePart: string): SectionDefinition | undefined =>
  SECTION_DEFINITIONS.find((definition) => typePart.includes(definition.keyword));

/**
 * A piece of a line: either words, or a directive.
 */
interface Segment {
  kind: 'text' | 'directive';
  /** The words, or the whole directive as it was written. */
  text: string;
  /** The name of the directive, in lower case. */
  name: string;
  /** The text after the colon of the directive. */
  value: string;
}

/**
 * Split a line into its words and its directives.
 *
 * A directive is anything in braces. The name is what comes before the first
 * colon, and the value is what comes after it.
 */
const splitLine = (line: string): Segment[] => {
  const segments: Segment[] = [];
  const pattern = /\{([^{}]*)\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        kind: 'text',
        text: line.slice(lastIndex, match.index),
        name: '',
        value: '',
      });
    }

    const body = match[1];
    const colon = body.indexOf(':');
    const name = (colon === -1 ? body : body.slice(0, colon)).trim().toLowerCase();
    const value = colon === -1 ? '' : body.slice(colon + 1).trim();

    segments.push({ kind: 'directive', text: match[0], name, value });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < line.length) {
    segments.push({ kind: 'text', text: line.slice(lastIndex), name: '', value: '' });
  }

  return segments;
};

/** The chords written on a line of their own. */
const chordsOfLine = (line: string): string[] => {
  const cleaned = line.replace(/\[|\]/g, ' ').trim();
  return cleaned ? cleaned.split(/\s+/) : [];
};

/**
 * The names a `{define:}` directive gives to something else.
 *
 * A definition of a chord is a chord under another name: "Am" means "A
 * minor". A definition of anything else is a word that stands for a phrase.
 */
interface Definitions {
  chords: Map<string, string>;
  words: { name: string; value: string }[];
}

const collectDefinitions = (content: string): Definitions => {
  const chords = new Map<string, string>();
  const words: { name: string; value: string }[] = [];

  const pattern = /\{\s*define\s*:\s*([^}]*)\}/gi;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    const body = match[1].trim();
    const space = body.search(/\s/);
    if (space === -1) continue;

    const name = body.slice(0, space);
    const value = body.slice(space + 1).trim();
    if (!name || !value) continue;

    // A chord defined as another chord is played as that chord. Anything else
    // is a word that stands for a phrase.
    if (parseChordName(name) && parseChordName(value)) {
      chords.set(name.toLowerCase(), value);
    } else {
      words.push({ name, value });
    }
  }

  return { chords, words };
};

/**
 * Put the defined words back into the words of the song.
 *
 * A name is only replaced when it stands on its own, so that a name that
 * happens to be part of a longer word is left alone.
 */
const applyWords = (text: string, words: { name: string; value: string }[]): string => {
  let result = text;
  for (const { name, value } of words) {
    const pattern = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    result = result.replace(pattern, value);
  }
  return result;
};

/**
 * Read a ChordPro song.
 *
 * Every directive is either something the app knows, or something it keeps so
 * that the reader can say "there is something here I do not understand".
 * Nothing is dropped: a line that carries a directive and some words keeps
 * its words.
 */
export const parseChordPro = (content: string): ParsedSong => {
  if (!content || !content.trim()) return [];

  const parsedLines: ParsedLine[] = [];
  const sectionCounters = new Map<string, number>();
  const definitions = collectDefinitions(content);
  let currentSection: SongSection | undefined;
  let inTab = false;
  let inChords = false;
  let lineIndex = 0;

  const push = (line: ParsedLine): void => {
    if (currentSection) {
      line.section = currentSection;
      currentSection = undefined; // Only mark the first line of each section
    }
    parsedLines.push(line);
    lineIndex++;
  };

  const startSection = (typePart: string, customLabel: string): boolean => {
    const shortType = SHORT_DIRECTIVE_TYPES[typePart.trim().toLowerCase()];
    const definition = shortType
      ? SECTION_DEFINITIONS.find((entry) => entry.type === shortType)
      : findSectionDefinition(typePart.trim().toLowerCase());
    if (!definition) return false;

    const counter = (sectionCounters.get(definition.type) ?? 0) + 1;
    sectionCounters.set(definition.type, counter);

    currentSection = {
      type: definition.type,
      label: resolveSectionLabel(typePart, customLabel, definition, counter),
      lineIndex,
    };
    return true;
  };

  for (const rawLine of content.split('\n')) {
    const trimmed = rawLine.trim();

    // A comment in the file itself.
    if (trimmed.startsWith('#')) continue;

    // Everything inside a block of tablature is kept exactly as it is.
    if (inTab) {
      if (trimmed === '{end_of_tab}') {
        inTab = false;
        continue;
      }
      // A new section ends the block, so that a file without an ending does
      // not swallow the rest of the song.
      if (!/^\{start_of_/i.test(trimmed)) {
        push({ items: [], annotation: { kind: 'tab', text: '', raw: rawLine } });
        continue;
      }
      inTab = false;
    }

    // Everything inside a block of chords on lines of their own.
    if (inChords) {
      const end = trimmed.indexOf('-}');
      const chordText = end === -1 ? trimmed : trimmed.slice(0, end);
      if (end !== -1) inChords = false;
      if (chordText.trim()) {
        push({
          items: [],
          annotation: { kind: 'chords', text: '', chords: chordsOfLine(chordText) },
        });
      }
      continue;
    }

    // The markers of a block of chords on lines of their own.
    if (trimmed === '{-') {
      inChords = true;
      continue;
    }
    if (trimmed === '-}') continue;

    // The whole block on one line, as in "{- C G -}".
    const inlineBlock = trimmed.match(/^\{-(.*)-\}$/);
    if (inlineBlock) {
      push({
        items: [],
        annotation: { kind: 'chords', text: '', chords: chordsOfLine(inlineBlock[1]) },
      });
      continue;
    }

    const segments = splitLine(rawLine);

    // A line with no directives is just words.
    if (!segments.some((segment) => segment.kind === 'directive')) {
      push(parseLine(rawLine, definitions));
      continue;
    }

    const words: string[] = [];
    const flushWords = (): void => {
      if (words.length === 0) return;
      const text = words.join('');
      words.length = 0;
      push(parseLine(text, definitions));
    };

    for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex++) {
      const segment = segments[segmentIndex];

      if (segment.kind === 'text') {
        words.push(segment.text);
        continue;
      }

      const { name, value } = segment;

      // The blocks.
      if (name === 'start_of_tab') {
        inTab = true;
        startSection('tab', '');
        continue;
      }
      if (name === 'end_of_tab') {
        inTab = false;
        continue;
      }
      if (name === '-') {
        inChords = true;
        continue;
      }

      // A section.
      if (name.startsWith('start_of_')) {
        const typePart = name.slice('start_of_'.length);
        // A type we do not know is kept, so that it is not lost.
        if (typePart !== 'tab' && !startSection(typePart, value)) {
          flushWords();
          push({ items: [], annotation: { kind: 'unknown', text: segment.text } });
        }
        continue;
      }
      if (name.startsWith('end_of_')) {
        currentSection = undefined;
        continue;
      }
      if (SHORT_DIRECTIVE_TYPES[name]) {
        startSection(name, value);
        continue;
      }

      // Something about the song rather than about its words.
      if (METADATA_DIRECTIVES.has(name)) continue;
      // "{c: 2}" is a capo, but "{c: play softly}" is a comment.
      if (name === 'c' && /^\d+$/.test(value)) continue;

      // A comment or a playing instruction.
      if (COMMENT_DIRECTIVES.has(name) || name === 'c') {
        flushWords();
        push({ items: [], annotation: { kind: 'comment', text: value } });
        continue;
      }

      // A chord grid, the way a jazz chart writes one. A row of them is a
      // grille, and is shown as a row.
      if (name === 'gc') {
        const chords = [value];
        let next = segmentIndex + 1;
        while (next < segments.length) {
          const following = segments[next];
          if (following.kind === 'text') {
            if (!following.text.trim()) {
              next += 1;
              continue;
            }
            break;
          }
          if (following.name !== 'gc') break;
          chords.push(following.value);
          next += 1;
        }
        segmentIndex = next - 1;
        flushWords();
        push({
          items: [],
          annotation: { kind: 'grid', text: chords.join(' '), chords },
        });
        continue;
      }

      // A directive the app does not know. It is kept, so that the reader can
      // show that there is something here it cannot read.
      flushWords();
      push({ items: [], annotation: { kind: 'unknown', text: segment.text } });
    }

    flushWords();
  }

  return parsedLines;
};

/**
 * Split a file that holds more than one song.
 *
 * A song starts at its `{title:}`, and `{new_song:}` starts one too. A file
 * with only one song in it comes back as it went in.
 */
export const splitChordProSongs = (content: string): string[] => {
  if (!content.trim()) return [];

  const songs: string[] = [];
  let current: string[] = [];
  let seenTitle = false;

  const flush = (): void => {
    const text = current.join('\n');
    if (text.trim()) songs.push(text);
    current = [];
  };

  for (const line of content.split('\n')) {
    const name = line.match(/^\s*\{\s*([a-z_]+)\s*:/i)?.[1]?.toLowerCase();

    if (name === 'new_song') {
      flush();
      seenTitle = false;
      const title = line.match(/^\s*\{\s*new_song\s*:\s*([^}]*)\}/i)?.[1]?.trim();
      if (title) current.push(`{title: ${title}}`);
      continue;
    }

    if (name === 'title' || name === 't') {
      if (seenTitle) flush();
      seenTitle = true;
    }

    current.push(line);
  }

  flush();
  return songs;
};

const parseLine = (line: string, definitions: Definitions): ParsedLine => {
  const items: ParsedLine['items'] = [];
  const regex = /\[([^\]]+)\]/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    // Text before the chord
    const lyricBefore = line.substring(lastIndex, match.index);
    if (lyricBefore) {
      items.push({ lyric: applyWords(lyricBefore, definitions.words) });
    }

    // The chord itself, under the name it was given by a {define:} directive.
    const written = match[1];
    const chord = definitions.chords.get(written.trim().toLowerCase()) ?? written;
    items.push({ lyric: '', chord });

    lastIndex = regex.lastIndex;
  }

  // Remaining text
  const lyricAfter = line.substring(lastIndex);
  if (lyricAfter) {
    items.push({ lyric: applyWords(lyricAfter, definitions.words) });
  }

  // Merge chord + following lyric
  const mergedItems: ParsedLine['items'] = [];

  for (let i = 0; i < items.length; i++) {
    const current = items[i];
    if (current.chord && !current.lyric && i + 1 < items.length) {
      const next = items[i + 1];

      // Two chords in a row: the first one stands on its own, and the second
      // one goes with the words that follow. Neither is lost.
      if (next.chord) {
        mergedItems.push({ ...current });
        continue;
      }

      mergedItems.push({ lyric: next.lyric, chord: current.chord });
      i++; // Skip next
    } else {
      mergedItems.push({ ...current });
    }
  }

  /*
   * Where each item sits in the line.
   *
   * The words are counted, because a chord is written above the words and not
   * in them: the chord at the front of "Some[Am]thing" is drawn over the
   * "thing", and the space the words take up is what moves it there.
   */
  let column = 0;
  for (const item of mergedItems) {
    item.column = column;
    column += item.lyric.length;
  }

  return { items: mergedItems };
};
