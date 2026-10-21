import { deflateRawSync } from 'node:zlib';

interface ZipPart {
  name: string;
  text: string;
  /** Whether the file is compressed. */
  compress?: boolean;
}

/**
 * Build a ZIP archive in memory, so that a test can import one.
 */
export const buildZip = (parts: ZipPart[]): Buffer => {
  const encoder = new TextEncoder();
  const local: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const part of parts) {
    const name = encoder.encode(part.name);
    const raw = encoder.encode(part.text);
    const data = part.compress ? new Uint8Array(deflateRawSync(raw)) : raw;
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

  return Buffer.from(archive);
};
