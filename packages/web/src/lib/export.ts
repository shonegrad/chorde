import type { Song } from '../types';
import { parseChordPro } from './chordPro';
import { transposeChord, transposeChordProContent, transposeKey } from './music';

export interface ExportOptions {
  /** Semitone offset applied to every chord. */
  transpose?: number;
  /** Capo position; the sounding key is capo semitones above the written key. */
  capo?: number;
  /** Spell chords using flats, matching the transposed key. */
  preferFlats?: boolean;
}

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const sanitizeFilename = (value: string): string => value.replace(/[^a-z0-9]/gi, '_').toLowerCase();

/** The key the song sounds in, taking the capo into account. */
const soundingKey = (song: Song, options: ExportOptions): string | undefined => {
  if (!song.key) return undefined;
  const written = transposeKey(song.key, options.transpose ?? 0, {
    preferFlats: options.preferFlats,
  });
  return options.capo
    ? transposeKey(written, options.capo, { preferFlats: options.preferFlats })
    : written;
};

/**
 * Build the ChordPro source for a song, with the current transposition and
 * capo applied so the downloaded file matches what is on screen.
 */
export const buildChordProContent = (song: Song, options: ExportOptions = {}): string => {
  let content = song.content || '';
  const transpose = options.transpose ?? 0;

  if (transpose !== 0) {
    content = transposeChordProContent(content, transpose, { preferFlats: options.preferFlats });
  }

  // Ensure the metadata directives are present.
  if (!content.includes('{title:') && !content.includes('{t:')) {
    content = `{title: ${song.title}}\n${content}`;
  }
  if (
    !content.includes('{artist:') &&
    !content.includes('{a:') &&
    !content.includes('{subtitle:}')
  ) {
    const titleRegex = /\{title:.*\}\n?/i;
    const match = content.match(titleRegex);
    if (match) {
      content = content.replace(match[0], `${match[0]}{artist: ${song.artist}}\n`);
    } else {
      content = `{artist: ${song.artist}}\n${content}`;
    }
  }

  // Reflect the transposition in the key directive.
  const key = soundingKey(song, options);
  if (key) {
    if (/\{(?:key|k):/i.test(content)) {
      content = content.replace(/\{(?:key|k):[^}]*\}/i, `{key: ${key}}`);
    } else {
      content = content.replace(/^(\{title:[^\n]*\n)/i, `$1{key: ${key}}\n`);
    }
  }

  if (options.capo && !/\{(?:capo|c):/i.test(content)) {
    content = content.replace(/^(\{title:[^\n]*\n)/i, `$1{capo: ${options.capo}}\n`);
  }

  return content;
};

export const exportToChordPro = (song: Song, options: ExportOptions = {}) => {
  const content = buildChordProContent(song, options);

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const filename = `${sanitizeFilename(`${song.title} - ${song.artist}`)}.cho`;

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Render the song as a printable chord sheet.
 *
 * The layout mirrors the on-screen view: the chord sits directly above the
 * word it belongs to, and the current transposition and capo are applied.
 */
export const exportToPdf = (song: Song, options: ExportOptions = {}) => {
  const win = window.open('', '_blank');
  if (!win) return;

  const transpose = options.transpose ?? 0;
  const preferFlats = options.preferFlats;
  const parsed = parseChordPro(song.content).map((line) => ({
    ...line,
    items: line.items.map((item) => ({
      ...item,
      chord: item.chord ? transposeChord(item.chord, transpose, { preferFlats }) : undefined,
    })),
  }));

  const body = parsed
    .map((line) => {
      const section = line.section
        ? `<div class="section">${escapeHtml(line.section.label ?? '')}</div>`
        : '';

      const content = line.items
        .map((item) => {
          const lyric = escapeHtml(item.lyric ?? '');
          if (!item.chord) return `<span class="lyric">${lyric}</span>`;

          const chord = escapeHtml(item.chord);
          // The chord belongs over the first word of the lyric that follows it.
          const match = (item.lyric ?? '').match(/^(\s*)(\S*)([\s\S]*)$/);
          const [, leading = '', word = '', rest = ''] = match ?? [];
          return (
            `<span class="chord-word"><span class="chord">${chord}</span>` +
            `<span class="word">${escapeHtml(leading + word)}</span></span>` +
            `<span class="lyric">${escapeHtml(rest)}</span>`
          );
        })
        .join('');

      return `<div class="line">${section}${content}</div>`;
    })
    .join('\n');

  const key = soundingKey(song, options);
  const originalKey = song.key;
  const attribution = [
    song.attribution?.sourceName,
    song.attribution?.author,
    song.attribution?.notes,
  ]
    .filter(Boolean)
    .join(' · ');
  const source = song.attribution?.sourceUrl
    ? `<p class="source">Source: <a href="${escapeHtml(song.attribution.sourceUrl)}">${escapeHtml(
        song.attribution.sourceUrl
      )}</a></p>`
    : '';

  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(song.title)}</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; max-width: 760px; margin: 2rem auto; color: #1a1a1a; }
    h1 { margin-bottom: 0.15rem; font-size: 1.9rem; }
    h2 { color: #555; font-weight: normal; margin-top: 0; font-size: 1.15rem; }
    .meta { color: #555; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .line { line-height: 1.9; margin-bottom: 0.55rem; }
    .section { font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: #777; margin-bottom: 0.35rem; }
    .chord-word { display: inline-block; vertical-align: top; }
    .chord { display: block; font-family: 'Courier New', monospace; font-weight: bold; font-size: 0.85em; }
    .word { display: block; white-space: nowrap; }
    .lyric { white-space: pre-wrap; }
    .attribution, .source { color: #666; font-size: 0.8rem; margin: 0.25rem 0; }
    @media print {
      body { margin: 0; max-width: none; }
      .line { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>${escapeHtml(song.title)}</h1>
  <h2>${escapeHtml(song.artist)}</h2>
  <div class="meta">
    ${key ? `Key: ${escapeHtml(key)}` : ''}
    ${originalKey && key && originalKey !== key ? ` (written in ${escapeHtml(originalKey)})` : ''}
    ${options.capo ? ` &middot; Capo ${options.capo}` : ''}
  </div>
  ${attribution ? `<p class="attribution">${escapeHtml(attribution)}</p>` : ''}
  ${source}
  <hr />
  ${body}
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`);
  win.document.close();
};
