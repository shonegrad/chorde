#!/usr/bin/env node
// Import 248 songs from the public chorde site (best-effort)
async function run(){
  try{
    const res = await fetch('https://shonegrad.github.io/chorde/assets/index-HV1adWf9.js');
    const text = await res.text();
    const blocks = [];
    const songs = [];
    // Try to extract blocks containing id:'jazz-pack-'
    const re = /id:\s*'jazz-pack-([^']+)'[\s\S]*?content:\s*`([\s\S]*?)`/g;
    let m;
    const seen = new Set();
    while((m = re.exec(text)) !== null){
      const blockText = text.substring(Math.max(0, m.index-1000), m.index + m[0].length + 1000);
      const id = 'jazz-pack-' + (m[1]||'unknown');
      if (seen.has(id)) continue;
      seen.add(id);
      const titleMatch = blockText.match(/title:\s*'([^']+)'/i);
      const artistMatch = blockText.match(/artist:\s*'([^']+)'/i);
      const keyMatch = blockText.match(/key:\s*'([^']+)'/i);
      const content = m[2];
      const song = {
        id,
        title: titleMatch ? titleMatch[1] : id,
        artist: artistMatch ? artistMatch[1] : 'Unknown',
        content,
        key: keyMatch? keyMatch[1] : undefined,
        capo: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: []
      };
      songs.push(song);
    }
    const uniq = songs; // assume unique by id
    const out = `import type { Song } from '../types';\nexport const EXTERNAL_248_PACK: Song[] = ${JSON.stringify(uniq, null, 2)};`;
    const fs = require('fs');
    const path = require('path');
    fs.writeFileSync(path.resolve(__dirname, '../src/data/external_248.ts'), out, 'utf8');
    console.log('Wrote 248 entries to src/data/external_248.ts', uniq.length);
  }catch(e){ console.error('Failed to import external data', e); process.exit(1); }
}
run();
