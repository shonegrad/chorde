/**
 * Compressing and uncompressing, with the browser's own tools.
 *
 * The browser can squeeze a stream of data and let it out again, so there is
 * no need for a library to do it.
 */

/**
 * Squeeze the data down.
 */
export const deflate = async (data: Uint8Array): Promise<Uint8Array> => {
  if (typeof CompressionStream === 'undefined') {
    // Without it the data is simply not squeezed, which is still readable.
    return data;
  }

  const source = new Response(data as BodyInit).body;
  if (!source) {
    throw new Error('The data could not be read.');
  }

  const buffer = await new Response(
    source.pipeThrough(new CompressionStream('deflate-raw'))
  ).arrayBuffer();
  return new Uint8Array(buffer);
};

/**
 * Let the data out again.
 */
export const inflate = async (data: Uint8Array): Promise<Uint8Array> => {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('This browser cannot read a compressed song.');
  }

  const source = new Response(data as BodyInit).body;
  if (!source) {
    throw new Error('The data could not be read.');
  }

  const buffer = await new Response(
    source.pipeThrough(new DecompressionStream('deflate-raw'))
  ).arrayBuffer();
  return new Uint8Array(buffer);
};
