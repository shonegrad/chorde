import { describe, it, expect } from 'vitest';
import { decodeSong, encodeSong, readSharedSong } from '../shareLink';
import type { SharedSong } from '../shareLink';

const song: SharedSong = {
  title: 'Amazing Grace',
  artist: 'Traditional Hymn',
  key: 'G',
  capo: 2,
  bpm: 90,
  content: '{start_of_verse}\n[G]Amazing [C]grace how sweet',
};

describe('a link that carries a song', () => {
  it('carries the song and what is known about it', async () => {
    const read = await decodeSong(await encodeSong(song));

    expect(read).toEqual(song);
  });

  it('makes a link that is not too long', async () => {
    const words = Array.from({ length: 40 }, (_, index) => `[G]Line ${index} of the song`).join(
      '\n'
    );
    const long: SharedSong = { ...song, content: words };

    const encoded = await encodeSong(long);

    // The words of the song are squeezed down, so the link is much shorter
    // than the song itself.
    expect(encoded.length).toBeLessThan(words.length / 2);
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
  });

  it('reads the song out of the link', async () => {
    const encoded = await encodeSong(song);

    const read = await readSharedSong(`#song=${encoded}`);

    expect(read?.title).toBe('Amazing Grace');
  });

  it('says there is no song when there is none', async () => {
    expect(await readSharedSong('')).toBeUndefined();
    expect(await readSharedSong('#other=1')).toBeUndefined();
    expect(await readSharedSong('#song=')).toBeUndefined();
  });

  it('says there is no song when the link is damaged', async () => {
    expect(await readSharedSong('#song=not-real-data')).toBeUndefined();
  });
});
