/**
 * OnSong files, turned into ChordPro.
 *
 * OnSong is the format a lot of worship charts are written in: a line of
 * metadata, then the sections, then the words with the chords in square
 * brackets. Both the app and the search API need to read it, so the reading
 * lives here, in the one place the two of them share.
 */

/** The sections OnSong uses, and the ChordPro sections they become. */
const SECTION_NAMES: Record<string, string> = {
  verse: 'verse',
  chorus: 'chorus',
  bridge: 'bridge',
  'pre-chorus': 'pre_chorus',
  intro: 'intro',
  outro: 'outro',
  interlude: 'interlude',
  tag: 'tag',
};

const SECTION_PATTERN = /^(Verse|Chorus|Bridge|Pre-Chorus|Intro|Outro|Interlude|Tag)\s*(\d*)/i;

/**
 * Read a line of OnSong.
 *
 * The chords are already in square brackets, which is what ChordPro uses, so
 * a line of words is a line of ChordPro.
 */
const convertLine = (line: string): string => line;

/**
 * Turn an OnSong file into ChordPro.
 *
 * The title comes from the file, and the name of the file is used when the
 * file does not have one.
 */
export const convertOnSongToChordPro = (content: string, filename = ''): string => {
  const lines = content.split('\n');
  const chordProLines: string[] = [];
  let inMetadata = true;
  let title = '';
  let artist = '';
  let key = '';
  let capo = '';
  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) continue;

    if (inMetadata) {
      if (trimmed.startsWith('Title:')) {
        title = trimmed.substring(6).trim();
        continue;
      }
      if (trimmed.startsWith('Artist:')) {
        artist = trimmed.substring(7).trim();
        continue;
      }
      if (trimmed.startsWith('Key:')) {
        key = trimmed.substring(4).trim().replace(/\[|\]/g, '');
        continue;
      }
      if (trimmed.startsWith('Capo:')) {
        capo = trimmed.substring(5).trim();
        continue;
      }
      if (
        trimmed.startsWith('CCLI:') ||
        trimmed.startsWith('Original Key:') ||
        trimmed.startsWith('Notes:') ||
        trimmed.startsWith('Book:')
      ) {
        continue;
      }

      // Any other line with a colon is metadata too, and is not shown.
      if (trimmed.includes(':') && !trimmed.match(/\[.*\]/) && !SECTION_PATTERN.test(trimmed)) {
        continue;
      }

      if (trimmed.match(/\[.*\]/) || trimmed.match(/\w/)) {
        inMetadata = false;
      }
    }

    if (!inMetadata) {
      const sectionMatch = trimmed.match(SECTION_PATTERN);
      if (sectionMatch) {
        const sectionType = SECTION_NAMES[sectionMatch[1].toLowerCase()] ?? 'verse';
        const num = sectionMatch[2];

        if (currentSection) {
          chordProLines.push(`{end_of_${currentSection}}`);
        }

        currentSection = num ? `${sectionType}${num}` : sectionType;
        chordProLines.push(`{start_of_${currentSection}}`);
        continue;
      }

      const chordProLine = convertLine(trimmed);
      if (chordProLine) {
        chordProLines.push(chordProLine);
      }
    }
  }

  if (currentSection) {
    chordProLines.push(`{end_of_${currentSection}}`);
  }

  const titleFromFilename = filename
    .replace(/\.(onsong|onsongpro|chordpro|cho)$/i, '')
    .replace(/_/g, ' ');

  const header: string[] = [];
  header.push(`{title: ${title || titleFromFilename || 'Untitled Song'}}`);
  if (artist) header.push(`{artist: ${artist}}`);
  if (key) header.push(`{key: ${key}}`);
  if (capo) header.push(`{capo: ${capo}}`);
  header.push('');

  return [...header, ...chordProLines].join('\n');
};
