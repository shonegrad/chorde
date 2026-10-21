/**
 * Printing a song.
 *
 * A sheet of paper is what a player needs when the screen is not in front of
 * them: a music stand, a songbook, a page to mark up. The app can print a
 * chord sheet, the changes of a song, and the shapes of the chords it uses.
 */

import type { ParsedSong, Song } from '../types';
import { parseChordPro } from './chordPro';
import { transposeChord, transposeKey } from './music';

export interface PrintOptions {
  /** Semitone offset applied to every chord. */
  transpose?: number;
  /** Capo position; the sounding key is capo semitones above the written key. */
  capo?: number;
  /** Spell chords using flats, matching the transposed key. */
  preferFlats?: boolean;
  /** How the song is written on the page. */
  layout?: 'chords' | 'chart';
  /** Whether the shapes of the chords are drawn. */
  diagrams?: boolean;
  /** The size of the words on the page, in points. */
  fontSize?: number;
}

export const DEFAULT_PRINT_OPTIONS: Required<
  Pick<PrintOptions, 'transpose' | 'capo' | 'layout' | 'diagrams' | 'fontSize'>
> = {
  transpose: 0,
  capo: 0,
  layout: 'chords',
  diagrams: false,
  fontSize: 12,
};

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The key the song sounds in, taking the capo into account. */
export const soundingKey = (song: Song, options: PrintOptions): string | undefined => {
  if (!song.key) return undefined;
  const written = transposeKey(song.key, options.transpose ?? 0, {
    preferFlats: options.preferFlats,
  });
  return options.capo
    ? transposeKey(written, options.capo, { preferFlats: options.preferFlats })
    : written;
};

/**
 * The song, with the transposition applied.
 */
const transposed = (song: Song, options: PrintOptions): ParsedSong => {
  const transpose = options.transpose ?? 0;
  const preferFlats = options.preferFlats;

  return parseChordPro(song.content).map((line) => ({
    ...line,
    items: line.items.map((item) => ({
      ...item,
      chord: item.chord ? transposeChord(item.chord, transpose, { preferFlats }) : undefined,
    })),
  }));
};

/**
 * The changes of a song: the chords of each section, in the order they are
 * played, with a chord that follows itself kept once.
 */
export interface ChartSection {
  label: string;
  chords: string[];
}

export const buildChordChart = (lines: ParsedSong): ChartSection[] => {
  const sections: ChartSection[] = [];
  let current: ChartSection | undefined;

  lines.forEach((line) => {
    if (line.section) {
      current = { label: line.section.label ?? line.section.type, chords: [] };
      sections.push(current);
    } else if (!current) {
      // The words before the first section are a part of their own.
      current = { label: '', chords: [] };
      sections.push(current);
    }

    const section = current;
    if (!section) return;

    line.items.forEach((item) => {
      const name = item.chord?.trim();
      if (!name) return;
      if (section.chords[section.chords.length - 1] === name) return;
      section.chords.push(name);
    });
  });

  return sections.filter((section) => section.chords.length > 0);
};

/**
 * Every chord a song uses, in the order they first appear.
 */
export const chordsUsed = (lines: ParsedSong): string[] => {
  const chords: string[] = [];

  lines.forEach((line) => {
    line.items.forEach((item) => {
      const name = item.chord?.trim();
      if (!name || chords.includes(name)) return;
      chords.push(name);
    });
  });

  return chords;
};

/**
 * The words of a line, with the chord over the word it belongs to.
 */
const lineHtml = (line: ParsedSong[number]): string => {
  const section = line.section
    ? `<div class="section">${escapeHtml(line.section.label ?? '')}</div>`
    : '';

  if (line.annotation) {
    if (line.annotation.kind === 'comment') {
      return `<div class="line">${section}<div class="comment">${escapeHtml(
        line.annotation.text
      )}</div></div>`;
    }
    if (line.annotation.kind === 'tab') {
      return `<div class="line">${section}<pre class="tab">${escapeHtml(
        line.annotation.raw ?? ''
      )}</pre></div>`;
    }
    if (line.annotation.kind === 'chords') {
      const chords = (line.annotation.chords ?? []).map((chord) => escapeHtml(chord));
      return `<div class="line">${section}<div class="chord-row">${chords.join(
        '</div><div class="chord-row">'
      )}</div></div>`;
    }
    if (line.annotation.kind === 'grid') {
      const chords = (line.annotation.chords ?? []).map((chord) => escapeHtml(chord));
      return `<div class="line">${section}<div class="chord-row">${chords.join(
        ' &middot; '
      )}</div></div>`;
    }
    return `<div class="line">${section}<div class="comment">${escapeHtml(
      line.annotation.text
    )}</div></div>`;
  }

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
};

/**
 * The changes of a song, as a chart.
 */
const chartHtml = (lines: ParsedSong): string =>
  buildChordChart(lines)
    .map((section) => {
      const chords = section.chords.map(
        (chord) => `<span class="chart-chord">${escapeHtml(chord)}</span>`
      );
      return (
        `<div class="chart-section">` +
        `<div class="section">${escapeHtml(section.label)}</div>` +
        `<div class="chart-chords">${chords.join('')}</div>` +
        `</div>`
      );
    })
    .join('\n');

/**
 * The shapes of the chords a song uses.
 */
const diagramHtml = (chords: string[], diagrams: Record<string, string>): string => {
  if (chords.length === 0) return '';

  const shapes = chords
    .map((chord) => {
      const shape = diagrams[chord];
      if (!shape) return '';
      return (
        `<div class="diagram">` +
        `<div class="diagram-name">${escapeHtml(chord)}</div>` +
        `<div class="diagram-shape">${shape}</div>` +
        `</div>`
      );
    })
    .join('');

  if (!shapes) return '';

  return `<h3 class="diagrams-title">The chords</h3><div class="diagrams">${shapes}</div>`;
};

export const PRINT_CSS = `
  @page { margin: 16mm; }
  body { font-family: Georgia, 'Times New Roman', serif; max-width: 720px; margin: 1.5rem auto; color: #1a1a1a; }
  h1 { margin-bottom: 0.15rem; font-size: 1.9rem; }
  h2 { color: #555; font-weight: normal; margin-top: 0; font-size: 1.15rem; }
  .meta { color: #555; font-size: 0.9rem; margin-bottom: 1.2rem; }
  .note { border-left: 3px solid #999; padding-left: 0.6rem; margin: 0.8rem 0; font-style: italic; }
  .line { line-height: 1.9; margin-bottom: 0.55rem; }
  .section { font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: #777; margin-bottom: 0.35rem; }
  .chord-word { display: inline-block; vertical-align: bottom; }
  .chord { display: block; font-family: 'Courier New', monospace; font-weight: bold; font-size: 0.85em; }
  .word { display: block; white-space: nowrap; }
  .lyric { white-space: pre-wrap; }
  .comment { font-style: italic; color: #555; }
  .tab { font-family: 'Courier New', monospace; font-size: 0.85em; white-space: pre; margin: 0; }
  .chord-row { font-family: 'Courier New', monospace; font-weight: bold; display: inline-block; margin-right: 1.2rem; }
  .chart-section { margin-bottom: 1.4rem; }
  .chart-chords { display: flex; flex-wrap: wrap; gap: 0.4rem 1.1rem; }
  .chart-chord { font-family: 'Courier New', monospace; font-weight: bold; font-size: 1.15em; }
  .diagrams-title { font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; color: #777; margin-top: 2rem; }
  .diagrams { display: flex; flex-wrap: wrap; gap: 1rem 1.4rem; }
  .diagram { text-align: center; }
  .diagram-name { font-family: 'Courier New', monospace; font-weight: bold; font-size: 0.95em; }
  .diagram-shape svg { width: 90px; height: auto; }
  .diagram-shape svg line { stroke: #1a1a1a !important; }
  .diagram-shape svg text { fill: #1a1a1a !important; }
  .diagram-shape svg circle { fill: #1a1a1a !important; stroke: none !important; }
  .diagram-shape svg rect { fill: #1a1a1a !important; stroke: none !important; }
  .attribution, .source { color: #666; font-size: 0.8rem; margin: 0.25rem 0; }
  @media print {
    body { margin: 0; max-width: none; }
    .line { break-inside: avoid; }
    .chart-section { break-inside: avoid; }
    .diagram { break-inside: avoid; }
    .diagrams-title { break-after: avoid; }
  }
`;

/**
 * The whole page for a song.
 */
export const buildPrintSheet = (
  song: Song,
  options: PrintOptions = {},
  diagrams: Record<string, string> = {}
): string => {
  const capo = options.capo ?? 0;
  const layout = options.layout ?? 'chords';
  const lines = transposed(song, options);

  const key = soundingKey(song, options);
  const originalKey = song.key;

  const meta = [
    key ? `Key: ${key}` : null,
    originalKey && key && originalKey !== key ? `written in ${originalKey}` : null,
    capo ? `Capo ${capo}` : null,
    song.bpm ? `${song.bpm} bpm` : null,
    song.duration ?? null,
  ]
    .filter(Boolean)
    .join(' &middot; ');

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

  const body = layout === 'chart' ? chartHtml(lines) : lines.map(lineHtml).join('\n');

  const shapes = options.diagrams ? diagramHtml(chordsUsed(lines), diagrams) : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(song.title)}</title>
  <style>${PRINT_CSS}</style>
</head>
<body style="font-size: ${options.fontSize ?? DEFAULT_PRINT_OPTIONS.fontSize}pt">
  <h1>${escapeHtml(song.title)}</h1>
  <h2>${escapeHtml(song.artist)}</h2>
  ${meta ? `<div class="meta">${meta}</div>` : ''}
  ${song.notes ? `<p class="note">${escapeHtml(song.notes)}</p>` : ''}
  ${attribution ? `<p class="attribution">${escapeHtml(attribution)}</p>` : ''}
  ${source}
  <hr />
  ${body}
  ${shapes}
</body>
</html>`;
};

/**
 * Open a window with the song on it, and let the browser print it.
 */
export const printSong = (
  song: Song,
  options: PrintOptions = {},
  diagrams: Record<string, string> = {}
): boolean => {
  const win = window.open('', '_blank');
  if (!win) return false;

  win.document.write(buildPrintSheet(song, options, diagrams));
  win.document.close();
  return true;
};
