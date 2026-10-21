import { describe, it, expect } from 'vitest';
import { readZip } from '../zip';

interface ZipPart {
  name: string;
  text: string;
  /** Whether the file is compressed. */
  compress?: boolean;
}

/**
 * A raw deflate stream that holds the data in stored blocks.
 *
 * A stored block is a valid part of a deflate stream, so the archive is a
 * real one and the browser's inflater does the work.
 */
const deflateStored = (data: Uint8Array): Uint8Array => {
  const max = 0xffff;
  const blocks: number[] = [];
  let offset = 0;

  for (;;) {
    const chunk = data.subarray(offset, offset + max);
    const isLast = offset + max >= data.length;

    // The first bit says whether this is the last block, the next two say
    // that it is stored rather than compressed.
    blocks.push(isLast ? 1 : 0);
    blocks.push(chunk.length & 0xff, (chunk.length >> 8) & 0xff);
    blocks.push(~chunk.length & 0xff, (~chunk.length >> 8) & 0xff);
    for (let index = 0; index < chunk.length; index += 1) {
      blocks.push(chunk[index]);
    }

    if (isLast) break;
    offset += max;
  }

  return new Uint8Array(blocks);
};

/**
 * Build a ZIP archive in memory, so that the reader is tested against real
 * files rather than against a mock of one.
 */
const buildZip = (parts: ZipPart[]): ArrayBuffer => {
  const encoder = new TextEncoder();
  const local: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const part of parts) {
    const name = encoder.encode(part.name);
    const raw = encoder.encode(part.text);
    const data = part.compress ? deflateStored(raw) : raw;
    const method = part.compress ? 8 : 0;

    const header = new Uint8Array(30 + name.length);
    const headerView = new DataView(header.buffer);
    headerView.setUint32(0, 0x04034b50, true);
    headerView.setUint16(4, 20, true);
    headerView.setUint16(8, method, true);
    headerView.setUint32(18, data.length, true);
    headerView.setUint32(22, raw.length, true);
    headerView.setUint16(26, name.length, true);
    header.set(name, 30);

    local.push(header, data);

    const entry = new Uint8Array(46 + name.length);
    const entryView = new DataView(entry.buffer);
    entryView.setUint32(0, 0x02014b50, true);
    entryView.setUint16(4, 20, true);
    entryView.setUint16(6, 20, true);
    entryView.setUint16(10, method, true);
    entryView.setUint32(20, data.length, true);
    entryView.setUint32(24, raw.length, true);
    entryView.setUint16(28, name.length, true);
    entryView.setUint32(42, offset, true);
    entry.set(name, 46);
    central.push(entry);

    offset += header.length + data.length;
  }

  const centralSize = central.reduce((total, part) => total + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, parts.length, true);
  endView.setUint16(10, parts.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);

  const all = [...local, ...central, end];
  const total = all.reduce((sum, part) => sum + part.length, 0);
  const archive = new Uint8Array(total);
  let position = 0;
  for (const part of all) {
    archive.set(part, position);
    position += part.length;
  }

  return archive.buffer as ArrayBuffer;
};

const zipFile = (parts: ZipPart[]): File =>
  new File([buildZip(parts)], 'songs.zip', { type: 'application/zip' });

describe('reading a ZIP archive', () => {
  it('finds the files inside', async () => {
    const entries = await readZip(zipFile([{ name: 'one.cho', text: 'first' }]));

    expect(entries).toHaveLength(1);
    expect(entries[0].name).toBe('one.cho');
    await expect(entries[0].read()).resolves.toBe('first');
  });

  it('reads a file that was compressed', async () => {
    const entries = await readZip(
      zipFile([{ name: 'one.cho', text: 'first song', compress: true }])
    );

    expect(entries[0].compressed).toBe(true);
    await expect(entries[0].read()).resolves.toBe('first song');
  });

  it('reads every file in the archive', async () => {
    const entries = await readZip(
      zipFile([
        { name: 'one.cho', text: 'first' },
        { name: 'two.cho', text: 'second', compress: true },
      ])
    );

    expect(entries.map((entry) => entry.name)).toEqual(['one.cho', 'two.cho']);
    await expect(entries[0].read()).resolves.toBe('first');
    await expect(entries[1].read()).resolves.toBe('second');
  });

  it('leaves out the folders', async () => {
    const entries = await readZip(
      zipFile([
        { name: 'songs/', text: '' },
        { name: 'songs/one.cho', text: 'first' },
      ])
    );

    expect(entries.map((entry) => entry.name)).toEqual(['songs/one.cho']);
  });

  it('says so when the file is not an archive', async () => {
    const file = new File(['not a zip'], 'song.cho', { type: 'text/plain' });

    await expect(readZip(file)).rejects.toThrow(/not a ZIP archive/i);
  });
});
