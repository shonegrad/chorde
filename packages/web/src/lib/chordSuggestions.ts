import { CHORD_LIBRARY } from '../data/chordLibrary';
import { getChordsInKey } from './scales';
import { keyPrefersFlats } from './music';

/**
 * The chords worth offering while writing.
 *
 * Everything in the library, plus the chords that fit the key of the song, so
 * the ones you are likely to use are at the top.
 */

/** Extensions that are common enough to offer even when the library has none. */
const COMMON_EXTENSIONS = [
  'maj7',
  'm7',
  '7',
  'm',
  'dim',
  'm7b5',
  'sus2',
  'sus4',
  '6',
  'm6',
  '9',
  'm9',
  'add9',
  '11',
  '13',
  '7sus4',
  '7b5',
  '7b9',
  '7alt',
];

const ROOT_NAMES = [
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
];

/** Every chord name we know how to play. */
export const allChordNames = (): string[] => {
  const names = new Set<string>(Object.keys(CHORD_LIBRARY));

  for (const root of ROOT_NAMES) {
    names.add(root);
    for (const extension of COMMON_EXTENSIONS) {
      names.add(`${root}${extension}`);
    }
  }

  return Array.from(names).sort((a, b) => a.localeCompare(b));
};

/** The chords that fit a key, in the order they usually appear. */
export const chordsInKey = (key: string): string[] => {
  if (!key) return [];

  const match = key.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return [];

  const root = match[1];
  const isMinor = /^m(?!aj)/i.test(match[2]);
  const useFlats = keyPrefersFlats(key);

  // The library is written in sharps, so translate the root when needed.
  const sharpRoot = useFlats ? flatToSharp(root) : root;

  try {
    const chords = getChordsInKey(sharpRoot, isMinor ? 'minor' : 'major');
    return chords.map((chord) => (useFlats ? sharpToFlat(chord) : chord));
  } catch {
    return [];
  }
};

const FLAT_TO_SHARP: Record<string, string> = {
  Db: 'C#',
  Eb: 'D#',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
};

const SHARP_TO_FLAT: Record<string, string> = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb',
};

const flatToSharp = (note: string): string => FLAT_TO_SHARP[note] ?? note;
const sharpToFlat = (note: string): string => SHARP_TO_FLAT[note] ?? note;

/**
 * The chords to offer, best first.
 *
 * The chords the player reaches for most come first, because those are the
 * ones they are reaching for. Then the chords of the key, and then everything
 * that starts with what has been typed. With nothing typed and no key yet,
 * the open shapes are offered, which are the ones you reach for most.
 */
export const suggestChords = (
  query: string,
  key?: string,
  limit = 24,
  frequent: string[] = []
): string[] => {
  const trimmed = query.trim().toLowerCase();
  const inKey = chordsInKey(key ?? '');

  const matches = (name: string): boolean =>
    !trimmed || name.toLowerCase().startsWith(trimmed) || name.toLowerCase().includes(trimmed);

  const frequentFirst = frequent.filter(matches);

  if (!trimmed && inKey.length === 0 && frequentFirst.length === 0) {
    return openChords().slice(0, limit);
  }

  const startsWith: string[] = [];
  const contains: string[] = [];

  for (const name of allChordNames()) {
    const lower = name.toLowerCase();
    if (!trimmed) continue;
    if (lower.startsWith(trimmed)) startsWith.push(name);
    else if (lower.includes(trimmed)) contains.push(name);
  }

  const inKeyFirst = inKey.filter(matches);

  return Array.from(new Set([...frequentFirst, ...inKeyFirst, ...startsWith, ...contains])).slice(
    0,
    limit
  );
};

/** The shapes that can be played without moving up the neck. */
const openChords = (): string[] =>
  Object.values(CHORD_LIBRARY)
    .filter((definition) => definition.variations.some((variation) => variation.suffix === 'open'))
    .map((definition) => definition.name)
    .sort((a, b) => a.length - b.length || a.localeCompare(b));

/**
 * The chords in a song that do not fit its key.
 *
 * This is a hint, not a mistake: a borrowed chord is a real thing. It helps
 * catch a wrong chord while writing.
 */
export const chordsOutsideKey = (content: string, key?: string): string[] => {
  if (!key) return [];

  const inKey = chordsInKey(key);
  if (inKey.length === 0) return [];

  // Allow the common chords of the key, whatever their spelling.
  const allowed = new Set(inKey.map((chord) => chord.replace(/[^A-G]/g, '').toLowerCase()));

  const outside = new Set<string>();

  for (const match of content.matchAll(/\[([^\]]+)\]/g)) {
    const chord = match[1];
    const root = chord.match(/^[A-G][#b]?/)?.[0];
    if (!root) continue;

    const sharpRoot = FLAT_TO_SHARP[root] ?? root;
    if (!allowed.has(sharpRoot.toLowerCase())) outside.add(chord);
  }

  return Array.from(outside);
};
