#!/usr/bin/env node
// Fetch 248 songs from public chorde site (ESM compatible)
import { promises as fs } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async function(){
  try {
    const res = await fetch('https://shonegrad.github.io/chorde/assets/index-HV1adWf9.js');
    const text = await res.text();
    const songs = [];
    const seen = new Set();
    
    // Try to capture blocks with id:"jazz-pack-..." and their content
    const regex = /id:\s*'([^']+)'[\s\S]*?content:\s*`([\s\S]*?)`/g;
    let m;
    let matchCount = 0;
    while((m = regex.exec(text)) !== null){
      const blockStart = Math.max(0, m.index - 1000);
      const blockEnd = m.index + m[0].length + 1000;
      const blockText = text.substring(blockStart, blockEnd);
      const id = m[1];
      if (seen.has(id)) continue;
      seen.add(id);
      const titleMatch = blockText.match(/title:\s*'([^']+)'/i);
      const artistMatch = blockText.match(/artist:\s*'([^']+)'/i);
      const keyMatch = blockText.match(/key:\s*'([^']+)'/i);
      const content = m[2];
      // Build Song object
      const song = {
        id,
        title: titleMatch ? titleMatch[1] : id,
        artist: artistMatch ? artistMatch[1] : 'Unknown',
        content,
        key: keyMatch ? keyMatch[1] : undefined,
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: []
      };
      songs.push(song);
      matchCount++;
    }
    
    console.log('Matches found:', matchCount);
    console.log('Unique songs found:', songs.length);
    
    // Limit to 248 if more extracted
    const max = 248;
    const sliced = songs.slice(0, Math.min(max, songs.length));
    console.log('Writing', sliced.length, 'entries to external_248.ts');
    const out = `import type { Song } from '../types';\nexport const EXTERNAL_248_PACK: Song[] = ${JSON.stringify(sliced, null, 2)};`;
    const outPath = resolve(__dirname, '../src/data/external_248.ts');
    await fs.writeFile(outPath, out, 'utf8');
    console.log('Sample entries:', sliced.slice(0, 3).map(s => ({ id: s.id, title: s.title })));
    process.exit(0);
  } catch(e){ 
    console.error('Import failed:', e); 
    process.exit(1); 
  }
})();
