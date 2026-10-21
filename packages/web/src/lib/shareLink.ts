/**
 * Sharing a song with a link.
 *
 * The app is local-first and there is no server, so a link cannot point at a
 * song in a library. It can carry the song with it: the words of the song go
 * into the link, squeezed down so that the link is not too long, and the app
 * that opens it reads the song out again.
 */

import type { Song } from '../types';
import { deflate, inflate } from './deflate';

export const SHARE_PREFIX = '#song=';

/** What a link carries: the song and what is known about it. */
export interface SharedSong {
  title: string;
  artist: string;
  key?: string;
  capo?: number;
  bpm?: number;
  /** The words of the song, in ChordPro. */
  content: string;
}

/**
 * The data as text that is safe to put in a link.
 */
const toBase64Url = (bytes: Uint8Array): string => {
  let binary = '';
  const chunk = 0x8000;

  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (value: string): Uint8Array => {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
};

/**
 * A song, squeezed down and made safe for a link.
 */
export const encodeSong = async (song: SharedSong): Promise<string> => {
  const data = new TextEncoder().encode(JSON.stringify(song));
  return toBase64Url(await deflate(data));
};

/**
 * A song, read back out of a link.
 */
export const decodeSong = async (encoded: string): Promise<SharedSong> => {
  const data = await inflate(fromBase64Url(encoded));
  const parsed = JSON.parse(new TextDecoder().decode(data)) as Partial<SharedSong>;

  if (!parsed || typeof parsed.content !== 'string') {
    throw new Error('That link does not carry a song.');
  }

  return {
    title: parsed.title ?? 'Untitled Song',
    artist: parsed.artist ?? 'Unknown Artist',
    key: parsed.key,
    capo: parsed.capo,
    bpm: parsed.bpm,
    content: parsed.content,
  };
};

/**
 * A link that carries the song.
 *
 * The link points at the app itself, and the song is in the part after the
 * hash, so that the app can show it however it was opened.
 */
export const songLink = async (song: Song): Promise<string> => {
  const encoded = await encodeSong({
    title: song.title,
    artist: song.artist,
    key: song.key,
    capo: song.capo,
    bpm: song.bpm,
    content: song.content,
  });
  const { origin } = window.location;
  return `${origin}${import.meta.env.BASE_URL}${SHARE_PREFIX}${encoded}`;
};

/**
 * The song in the link, if there is one.
 */
export const readSharedSong = async (
  hash = window.location.hash
): Promise<SharedSong | undefined> => {
  if (!hash.startsWith(SHARE_PREFIX)) return undefined;

  const encoded = hash.slice(SHARE_PREFIX.length);
  if (!encoded) return undefined;

  try {
    return await decodeSong(encoded);
  } catch {
    return undefined;
  }
};

/**
 * Take the song out of the address bar, so that the link is not shared again
 * by accident.
 */
export const clearSharedSong = (): void => {
  const { pathname, search } = window.location;
  window.history.replaceState(null, '', `${pathname}${search}`);
};
