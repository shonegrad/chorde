import type { Song } from '../types';

export const exportToChordPro = (song: Song) => {
    // Ensure content has metadata tags if they are missing from the raw content
    let content = song.content || '';

    // Check and prepend metadata if not present in content
    if (!content.includes('{title:') && !content.includes('{t:')) {
        content = `{title: ${song.title}}\n${content}`;
    }
    if (!content.includes('{artist:') && !content.includes('{a:') && !content.includes('{subtitle:}')) {
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
    const filename = `${song.title} - ${song.artist}`.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.cho';

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
