/**
 * Song Import Utility
 * 
 * This utility helps import songs from ChordPro format.
 * Usage: node scripts/importSongs.js <chordpro-file>
 */

import * as fs from 'fs';
import * as path from 'path';

interface SongData {
    title: string;
    artist: string;
    key?: string;
    capo?: number;
    tempo?: number;
    content: string;
}

/**
 * Parse ChordPro file and extract metadata
 */
export function parseChordProFile(filePath: string): SongData | null {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');

        // Extract metadata from ChordPro directives
        const titleMatch = content.match(/\{title:([^}]+)\}/i) || content.match(/\{t:([^}]+)\}/i);
        const artistMatch = content.match(/\{artist:([^}]+)\}/i) || content.match(/\{subtitle:([^}]+)\}/i);
        const keyMatch = content.match(/\{key:([^}]+)\}/i);
        const capoMatch = content.match(/\{capo:([^}]+)\}/i);
        const tempoMatch = content.match(/\{tempo:([^}]+)\}/i);

        if (!titleMatch) {
            console.error('No title found in ChordPro file');
            return null;
        }

        // Remove metadata directives from content
        let cleanContent = content
            .replace(/\{title:[^}]+\}/gi, '')
            .replace(/\{t:[^}]+\}/gi, '')
            .replace(/\{artist:[^}]+\}/gi, '')
            .replace(/\{subtitle:[^}]+\}/gi, '')
            .replace(/\{key:[^}]+\}/gi, '')
            .replace(/\{capo:[^}]+\}/gi, '')
            .replace(/\{tempo:[^}]+\}/gi, '')
            .trim();

        return {
            title: titleMatch[1].trim(),
            artist: artistMatch ? artistMatch[1].trim() : 'Unknown Artist',
            key: keyMatch ? keyMatch[1].trim() : undefined,
            capo: capoMatch ? parseInt(capoMatch[1]) : undefined,
            tempo: tempoMatch ? parseInt(tempoMatch[1]) : undefined,
            content: cleanContent
        };
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return null;
    }
}

/**
 * Generate TypeScript song object
 */
export function generateSongObject(data: SongData, id: string): string {
    const tags = inferTags(data.artist, data.title);

    return `    {
        id: '${id}',
        title: '${escapeString(data.title)}',
        artist: '${escapeString(data.artist)}',
        tags: ${JSON.stringify(tags)},
        key: '${data.key || 'C'}',
        capo: ${data.capo || 0},
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: \`${escapeBackticks(data.content)}\`
    }`;
}

/**
 * Infer tags based on artist/title
 */
function inferTags(artist: string, title: string): string[] {
    const tags: string[] = [];

    // Genre inference (basic)
    const rock = ['nirvana', 'oasis', 'radiohead', 'foo fighters', 'pearl jam'];
    const pop = ['taylor swift', 'ed sheeran', 'adele', 'beatles'];
    const country = ['johnny cash', 'dolly parton', 'willie nelson'];
    const indie = ['arctic monkeys', 'the strokes', 'vampire weekend'];

    const artistLower = artist.toLowerCase();

    if (rock.some(a => artistLower.includes(a))) tags.push('rock');
    if (pop.some(a => artistLower.includes(a))) tags.push('pop');
    if (country.some(a => artistLower.includes(a))) tags.push('country');
    if (indie.some(a => artistLower.includes(a))) tags.push('indie');

    // Era inference
    if (title.toLowerCase().includes('acoustic') || title.toLowerCase().includes('unplugged')) {
        tags.push('acoustic');
    }

    return tags.length > 0 ? tags : ['guitar'];
}

function escapeString(str: string): string {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function escapeBackticks(str: string): string {
    return str.replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

/**
 * Batch import songs from directory
 */
export function importSongsFromDirectory(dirPath: string): string {
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.cho') || f.endsWith('.crd') || f.endsWith('.pro'));

    const songs: string[] = [];

    files.forEach((file, index) => {
        const filePath = path.join(dirPath, file);
        const data = parseChordProFile(filePath);

        if (data) {
            const id = generateId(data.artist, data.title);
            songs.push(generateSongObject(data, id));
        }
    });

    return `import type { Song } from '../types';\n\nexport const SEED_SONGS: Song[] = [\n${songs.join(',\n')}\n];\n`;
}

function generateId(artist: string, title: string): string {
    const slugify = (str: string) => str.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return `${slugify(artist)}-${slugify(title)}`;
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage: ts-node importSongs.ts <chordpro-file-or-directory>');
        process.exit(1);
    }

    const inputPath = args[0];

    if (fs.statSync(inputPath).isDirectory()) {
        const output = importSongsFromDirectory(inputPath);
        console.log(output);
    } else {
        const data = parseChordProFile(inputPath);
        if (data) {
            const id = generateId(data.artist, data.title);
            console.log(generateSongObject(data, id));
        }
    }
}
