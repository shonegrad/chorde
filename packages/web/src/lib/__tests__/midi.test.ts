import { describe, it, expect } from 'vitest';
import { buildMidi, buildSongMidi } from '../midi';
import type { Song } from '../../types';

const readUint32 = (bytes: Uint8Array, offset: number): number =>
  ((bytes[offset] << 24) |
    (bytes[offset + 1] << 16) |
    (bytes[offset + 2] << 8) |
    bytes[offset + 3]) >>>
  0;

const readUint16 = (bytes: Uint8Array, offset: number): number =>
  (bytes[offset] << 8) | bytes[offset + 1];

const text = (bytes: Uint8Array, offset: number, length: number): string =>
  String.fromCharCode(...bytes.subarray(offset, offset + length));

interface MidiEvent {
  delta: number;
  kind: 'on' | 'off' | 'meta';
  note?: number;
  metaType?: number;
  data?: Uint8Array;
}

/**
 * Read the events of a MIDI file, so that the file can be checked rather than
 * just counted.
 */
const readEvents = (bytes: Uint8Array): MidiEvent[] => {
  const events: MidiEvent[] = [];
  let offset = 8 + readUint32(bytes, 4);

  // The track chunk.
  offset += 4;
  const length = readUint32(bytes, offset);
  offset += 4;
  const end = offset + length;

  let running = 0;

  while (offset < end) {
    let delta = 0;
    for (;;) {
      const byte = bytes[offset++];
      delta = (delta << 7) | (byte & 0x7f);
      if (!(byte & 0x80)) break;
    }

    let status = bytes[offset];
    if (status < 0x80) {
      status = running;
    } else {
      offset += 1;
    }
    running = status;

    if (status === 0xff) {
      const metaType = bytes[offset++];
      let size = 0;
      for (;;) {
        const byte = bytes[offset++];
        size = (size << 7) | (byte & 0x7f);
        if (!(byte & 0x80)) break;
      }
      const data = bytes.subarray(offset, offset + size);
      offset += size;
      events.push({ delta, kind: 'meta', metaType, data });
      continue;
    }

    if (status === 0x90 || status === 0x80) {
      const note = bytes[offset++];
      offset += 1;
      events.push({ delta, kind: status === 0x90 ? 'on' : 'off', note });
      continue;
    }

    // Anything else: a control change or a pitch bend.
    offset += status === 0xc0 || status === 0xd0 ? 1 : 2;
  }

  return events;
};

const notesOn = (bytes: Uint8Array): number[] =>
  readEvents(bytes)
    .filter((event) => event.kind === 'on')
    .map((event) => event.note ?? 0);

const metaOf = (bytes: Uint8Array, type: number): Uint8Array | undefined =>
  readEvents(bytes).find((event) => event.metaType === type)?.data;

describe('the MIDI file of a song', () => {
  it('starts with a header', () => {
    const bytes = buildMidi(['C', 'G']);

    expect(text(bytes, 0, 4)).toBe('MThd');
    expect(readUint32(bytes, 4)).toBe(6);
    // One track, and the usual number of ticks in a quarter note.
    expect(readUint16(bytes, 8)).toBe(0);
    expect(readUint16(bytes, 10)).toBe(1);
    expect(readUint16(bytes, 12)).toBe(480);
  });

  it('has a track, and the length of the track is right', () => {
    const bytes = buildMidi(['C', 'G']);

    expect(text(bytes, 14, 4)).toBe('MTrk');
    expect(readUint32(bytes, 18)).toBe(bytes.length - 22);
  });

  it('says how fast it is', () => {
    const bytes = buildMidi(['C'], { bpm: 120 });

    const tempo = metaOf(bytes, 0x51);
    expect(tempo).toBeDefined();

    const microseconds = ((tempo?.[0] ?? 0) << 16) | ((tempo?.[1] ?? 0) << 8) | (tempo?.[2] ?? 0);
    expect(microseconds).toBe(500000);
  });

  it('says how many beats are in a bar', () => {
    const bytes = buildMidi(['C'], { beatsPerBar: 3 });

    const signature = metaOf(bytes, 0x58);
    expect(signature?.[0]).toBe(3);
  });

  it('plays the notes of a chord', () => {
    const notes = notesOn(buildMidi(['C']));

    // The shape of a C, which is five strings.
    expect(notes).toEqual([48, 52, 55, 60, 64]);
  });

  it('lets every note go at the end of the bar', () => {
    const events = readEvents(buildMidi(['C']));
    const off = events.filter((event) => event.kind === 'off');

    expect(off).toHaveLength(5);
  });

  it('plays one chord to a bar', () => {
    const one = buildMidi(['C']);
    const two = buildMidi(['C', 'G']);

    // Two chords are longer than one.
    expect(two.length).toBeGreaterThan(one.length);
    expect(notesOn(two)).toHaveLength(11);
  });

  it('leaves out a chord it cannot work out', () => {
    const notes = notesOn(buildMidi(['C', 'N.C.']));

    expect(notes).toHaveLength(5);
  });

  it('writes the chords of a song, in order', () => {
    const song: Song = {
      id: 'song-1',
      title: 'A Song',
      artist: 'Someone',
      content: '[C]One [C]Two [G]Three',
      bpm: 100,
      timeSignature: '3/4',
      attribution: {
        sourceName: 'test',
        sourceUrl: '',
        license: 'public-domain',
        verifiedBy: 'auto',
      },
      rightsStatus: 'open',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };

    const bytes = buildSongMidi(song);

    // Two chords: the C and the G.
    const notes = notesOn(bytes);
    expect(notes).toHaveLength(11);
    // The shape of the C, and then the shape of the G.
    expect(notes.slice(0, 5)).toEqual([48, 52, 55, 60, 64]);
    expect(notes.slice(5)).toEqual([43, 47, 50, 55, 59, 67]);
  });

  it('names the track after the song', () => {
    const song: Song = {
      id: 'song-1',
      title: 'A Song',
      artist: 'Someone',
      content: '[C]One',
      attribution: {
        sourceName: 'test',
        sourceUrl: '',
        license: 'public-domain',
        verifiedBy: 'auto',
      },
      rightsStatus: 'open',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };

    const name = metaOf(buildSongMidi(song), 0x03);

    expect(new TextDecoder().decode(name)).toBe('A Song');
  });
});
