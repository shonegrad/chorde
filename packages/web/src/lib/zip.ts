/**
 * Reading a ZIP file in the browser.
 *
 * The browser can inflate a stream of compressed data, so all that is left to
 * do is find the files inside the archive and hand their data to it. That
 * means a ZIP of songs can be read without a library.
 */

const END_OF_CENTRAL_DIRECTORY = 0x06054b50;
const CENTRAL_FILE_HEADER = 0x02014b50;
const LOCAL_FILE_HEADER = 0x04034b50;

const STORED = 0;
const DEFLATED = 8;

/** One file inside the archive. */
export interface ZipEntry {
  /** The path of the file inside the archive. */
  name: string;
  /** Whether the file was compressed. */
  compressed: boolean;
  /** The text of the file. */
  read(): Promise<string>;
}

const readUint16 = (view: DataView, offset: number): number => view.getUint16(offset, true);
const readUint32 = (view: DataView, offset: number): number => view.getUint32(offset, true);

/**
 * Find the end of the central directory.
 *
 * It is at the end of the file, but there may be a comment after it, so it is
 * searched for from the back.
 */
const findCentralDirectory = (view: DataView): number => {
  const start = Math.max(0, view.byteLength - 0xffff - 22);
  for (let offset = view.byteLength - 22; offset >= start; offset -= 1) {
    if (readUint32(view, offset) === END_OF_CENTRAL_DIRECTORY) return offset;
  }
  return -1;
};

const inflate = async (data: Uint8Array): Promise<Uint8Array> => {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('This browser cannot read a compressed archive.');
  }

  const source = new Response(data as BodyInit).body;
  if (!source) {
    throw new Error('The archive could not be read.');
  }

  const stream = source.pipeThrough(new DecompressionStream('deflate-raw'));
  const buffer = await new Response(stream).arrayBuffer();
  return new Uint8Array(buffer);
};

/**
 * The files inside a ZIP archive.
 */
export const readZip = async (file: File): Promise<ZipEntry[]> => {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);

  const end = findCentralDirectory(view);
  if (end === -1) {
    throw new Error('That file is not a ZIP archive.');
  }

  const count = readUint16(view, end + 10);
  let offset = readUint32(view, end + 16);

  const entries: ZipEntry[] = [];

  for (let index = 0; index < count; index += 1) {
    if (readUint32(view, offset) !== CENTRAL_FILE_HEADER) {
      throw new Error('The archive is damaged and cannot be read.');
    }

    const method = readUint16(view, offset + 10);
    const compressedSize = readUint32(view, offset + 20);
    const nameLength = readUint16(view, offset + 28);
    const extraLength = readUint16(view, offset + 30);
    const commentLength = readUint16(view, offset + 32);
    const localOffset = readUint32(view, offset + 42);
    const name = new TextDecoder().decode(new Uint8Array(buffer, offset + 46, nameLength));

    offset += 46 + nameLength + extraLength + commentLength;

    // A folder is a name that ends in a slash and holds no data.
    if (name.endsWith('/')) continue;

    entries.push({
      name,
      compressed: method === DEFLATED,
      read: async () => {
        if (readUint32(view, localOffset) !== LOCAL_FILE_HEADER) {
          throw new Error('The archive is damaged and cannot be read.');
        }

        const localNameLength = readUint16(view, localOffset + 26);
        const localExtraLength = readUint16(view, localOffset + 28);
        const start = localOffset + 30 + localNameLength + localExtraLength;
        const data = new Uint8Array(buffer, start, compressedSize);

        if (method === STORED) {
          return new TextDecoder().decode(data);
        }

        if (method !== DEFLATED) {
          throw new Error(`The archive uses a compression this browser cannot read.`);
        }

        return new TextDecoder().decode(await inflate(data));
      },
    });
  }

  return entries;
};
