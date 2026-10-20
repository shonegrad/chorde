import type { Setlist } from '@chorde/shared';
import type { Song } from '../types';

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Print the running order of a setlist.
 *
 * A sheet of paper is what you want when you are playing from a stand, and it
 * is the one thing a setlist cannot show you on a screen.
 */
export const printSetlist = (setlist: Setlist, songById: Map<string, Song>): void => {
  const rows = setlist.songs
    .map((entry, index) => {
      const song = songById.get(entry.songId);
      const title = song?.title ?? 'A song that is no longer in your library';
      const artist = song?.artist ?? '';

      const details = [
        song?.key ? `Key ${song.key}` : null,
        entry.transpose ? `Transpose ${entry.transpose > 0 ? '+' : ''}${entry.transpose}` : null,
        entry.capo ? `Capo ${entry.capo}` : null,
        song?.duration ?? null,
      ]
        .filter(Boolean)
        .join(' · ');

      return `<tr>
        <td class="number">${index + 1}</td>
        <td>
          <div class="title">${escapeHtml(title)}</div>
          <div class="artist">${escapeHtml(artist)}</div>
          ${entry.note ? `<div class="note">${escapeHtml(entry.note)}</div>` : ''}
        </td>
        <td class="details">${escapeHtml(details)}</td>
      </tr>`;
    })
    .join('\n');

  const win = window.open('', '_blank');
  if (!win) return;

  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(setlist.name)}</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; max-width: 760px; margin: 2rem auto; color: #1a1a1a; }
    h1 { margin-bottom: 0.25rem; font-size: 1.7rem; }
    .subtitle { color: #666; margin: 0 0 1.5rem; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 0.6rem 0.4rem; border-bottom: 1px solid #ddd; vertical-align: top; }
    td.number { width: 2rem; color: #888; }
    .title { font-weight: 600; }
    .artist, .details, .note { color: #666; font-size: 0.9rem; }
    .details { text-align: right; white-space: nowrap; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(setlist.name)}</h1>
  <p class="subtitle">${
    setlist.targetKey ? `Played in ${escapeHtml(setlist.targetKey)}` : 'Running order'
  }</p>
  <table>${rows}</table>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`);
  win.document.close();
};
