import type { Song } from '../types';

export const exportToChordPro = (song: Song) => {
  // Ensure content has metadata tags if they are missing from the raw content
  let content = song.content || '';

  // Check and prepend metadata if not present in content
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
      // Insert artist after title
      content = content.replace(match[0], `${match[0]}{artist: ${song.artist}}\n`);
    } else {
      // Or just prepend if no title tag found (unlikely due to check above)
      content = `{artist: ${song.artist}}\n${content}`;
    }
  }

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  // Sanitize filename
  const filename =
    `${song.title} - ${song.artist}`.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.cho';

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToPdf = (song: Song) => {
  const win = window.open('', '_blank');
  if (!win) return;
  const escapedTitle = song.title.replace(/</g, '&lt;');
  const escapedArtist = song.artist.replace(/</g, '&lt;');
  const escapedContent = (song.content || '').replace(/</g, '&lt;').replace(/\n/g, '<br/>');
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${escapedTitle}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 800px; margin: 2rem auto; color: #222; }
    h1 { margin-bottom: 0.25rem; }
    h2 { color: #555; font-weight: normal; margin-top: 0; }
    pre { white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.6; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>${escapedTitle}</h1>
  <h2>${escapedArtist}</h2>
  ${song.key ? `<p><strong>Key:</strong> ${song.key}</p>` : ''}
  ${song.capo ? `<p><strong>Capo:</strong> ${song.capo}</p>` : ''}
  <hr/>
  <pre>${escapedContent}</pre>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`);
  win.document.close();
};
