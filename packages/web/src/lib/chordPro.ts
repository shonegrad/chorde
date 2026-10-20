import type { ParsedSong, ParsedLine, SongSection } from '../types';

export interface SongMetadata {
  title: string;
  artist: string;
  key?: string;
  capo?: number;
  tempo?: number;
  timeSignature?: string;
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
  }

  return {
    title,
    artist: artist || subtitle || 'Unknown Artist',
    key,
    capo,
    tempo,
    timeSignature,
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

export const parseChordPro = (content: string): ParsedSong => {
  if (!content || !content.trim()) return [];
  const lines = content.split('\n');
  const parsedLines: ParsedLine[] = [];
  let currentSection: SongSection | undefined;
  let lineIndex = 0;
  const sectionCounters = new Map<string, number>();

  for (const line of lines) {
    if (line.trim().startsWith('#')) continue; // Skip comments

    // Check for section directives
    const sectionMatch = line.match(
      /\{(start_of_|sov|soc|sob|soi|soo|sos|start_of_tab|end_of_tab)([^}]*)\}/i
    );
    if (sectionMatch) {
      const directive = sectionMatch[1].toLowerCase();
      const labelPart = sectionMatch[2] ? sectionMatch[2].trim() : '';

      // Handle tab directives
      if (directive === 'start_of_tab') {
        currentSection = {
          type: 'tab',
          label: 'Tab',
          lineIndex,
          isTab: true,
        };
        continue;
      }
      if (directive === 'end_of_tab') {
        currentSection = undefined; // Reset tab mode
        continue;
      }

      const shortType = SHORT_DIRECTIVE_TYPES[directive];
      // The type is taken from the part before any custom label, so that
      // `{start_of_chorus: Verse 2}` is still a chorus.
      const [typePart, ...customParts] = labelPart.split(':');
      const customLabel = customParts.join(':').trim();
      const definition = shortType
        ? SECTION_DEFINITIONS.find((entry) => entry.type === shortType)
        : findSectionDefinition(typePart.trim().toLowerCase());

      if (!definition) continue; // Unknown section type, ignore the directive.

      const counter = (sectionCounters.get(definition.type) ?? 0) + 1;
      sectionCounters.set(definition.type, counter);

      currentSection = {
        type: definition.type,
        label: resolveSectionLabel(typePart, customLabel, definition, counter),
        lineIndex,
      };
      continue; // Skip the directive line itself
    }

    // Skip other directives
    if (line.trim().startsWith('{')) continue;

    const parsedLine = parseLine(line);
    if (currentSection) {
      parsedLine.section = currentSection;
      currentSection = undefined; // Only mark the first line of each section
    }
    parsedLines.push(parsedLine);
    lineIndex++;
  }
  return parsedLines;
};

const parseLine = (line: string): ParsedLine => {
  const items: ParsedLine['items'] = [];
  const regex = /\[([^\]]+)\]/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    // Text before the chord
    const lyricBefore = line.substring(lastIndex, match.index);
    if (lyricBefore) {
      items.push({ lyric: lyricBefore });
    }

    // The chord itself
    const chord = match[1];
    items.push({ lyric: '', chord: chord });

    lastIndex = regex.lastIndex;
  }

  // Remaining text
  const lyricAfter = line.substring(lastIndex);
  if (lyricAfter) {
    items.push({ lyric: lyricAfter });
  }

  // Merge chord + following lyric
  const mergedItems: ParsedLine['items'] = [];

  for (let i = 0; i < items.length; i++) {
    const current = items[i];
    if (current.chord && !current.lyric && i + 1 < items.length) {
      // Merge with next
      const next = items[i + 1];
      mergedItems.push({ lyric: next.lyric, chord: current.chord });
      i++; // Skip next
    } else {
      mergedItems.push(current);
    }
  }

  return { items: mergedItems };
};
