import type { ParsedSong, ParsedLine, SongSection } from '../types';

export interface SongMetadata {
    title: string;
    artist: string;
    key?: string;
    capo?: number;
}

export const extractMetadata = (content: string): SongMetadata => {
    const lines = content.split('\n');
    let title = 'Untitled Song';
    let artist = 'Unknown Artist';
    let key: string | undefined;
    let capo: number | undefined;

    for (const line of lines) {
        const trimmed = line.trim();

        // Title: {title: ...}, {t: ...}
        const titleMatch = trimmed.match(/\{(?:title|t):\s*([^}]+)\}/i);
        if (titleMatch) {
            title = titleMatch[1].trim();
            continue;
        }

        // Artist: {artist: ...}, {a: ...}, {subtitle: ...}, {st: ...}
        const artistMatch = trimmed.match(/\{(?:artist|a|subtitle|st):\s*([^}]+)\}/i);
        if (artistMatch) {
            artist = artistMatch[1].trim();
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
    }

    return { title, artist, key, capo };
};

export const parseChordPro = (content: string): ParsedSong => {
    const lines = content.split('\n');
    const parsedLines: ParsedLine[] = [];
    let currentSection: SongSection | undefined;
    let lineIndex = 0;

    for (const line of lines) {
        if (line.trim().startsWith('#')) continue; // Skip comments

        // Check for section directives
        const sectionMatch = line.match(/\{(start_of_|sov|soc|sob|soi|soo|sos)([^}]*)\}/i);
        if (sectionMatch) {
            const directive = sectionMatch[1].toLowerCase();
            const labelPart = sectionMatch[2] ? sectionMatch[2].trim() : '';

            // Extract section type and custom label
            // For "start_of_intro" or "start_of_verse: Verse 1", labelPart contains "intro" or "verse: Verse 1"
            const [sectionType, ...customLabelParts] = labelPart.split(':');
            const sectionTypeLower = sectionType.trim().toLowerCase();
            const customLabel = customLabelParts.join(':').trim();

            if (sectionTypeLower.includes('verse') || directive === 'sov') {
                currentSection = {
                    type: 'verse',
                    label: customLabel || `Verse ${Math.floor(lineIndex / 10) + 1}`,
                    lineIndex
                };
            } else if (sectionTypeLower.includes('chorus') || directive === 'soc') {
                currentSection = {
                    type: 'chorus',
                    label: customLabel || 'Chorus',
                    lineIndex
                };
            } else if (sectionTypeLower.includes('bridge') || directive === 'sob') {
                currentSection = {
                    type: 'bridge',
                    label: customLabel || 'Bridge',
                    lineIndex
                };
            } else if (sectionTypeLower.includes('intro') || directive === 'soi') {
                currentSection = {
                    type: 'intro',
                    label: customLabel || 'Intro',
                    lineIndex
                };
            } else if (sectionTypeLower.includes('outro') || directive === 'soo') {
                currentSection = {
                    type: 'outro',
                    label: customLabel || 'Outro',
                    lineIndex
                };
            } else if (sectionTypeLower.includes('solo') || directive === 'sos') {
                currentSection = {
                    type: 'solo',
                    label: customLabel || 'Solo',
                    lineIndex
                };
            }
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
}
