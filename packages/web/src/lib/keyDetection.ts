import { pitchClassOf } from './guitar';

/**
 * Working out what key a song is in.
 *
 * The chords a song uses say far more about its key than the chord that
 * happens to appear most often: a song that starts and ends on Em is in E
 * minor far more often than it is in G major.
 */

export type KeyMode = 'major' | 'minor';

export type ChordQuality =
  | 'major'
  | 'minor'
  | 'diminished'
  | 'augmented'
  | 'suspended'
  | 'dominant'
  | 'power'
  | 'unknown';

export interface ChordSummary {
  /** The note the chord is built on, as a number of semitones. */
  root: number;
  quality: ChordQuality;
  /** The chord as it was written. */
  name: string;
}

export interface KeyGuess {
  /** The key, for example "G" or "Dm". */
  key: string;
  mode: KeyMode;
  /** How sure we are, from 0 to 1. */
  confidence: number;
  /** The other keys that fit, best first. */
  alternatives: { key: string; mode: KeyMode; confidence: number }[];
  /** The chords that do not belong to the key. */
  outside: string[];
}

const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

/** The name of a key, spelt the way a musician would write it. */
export const keyName = (root: number, mode: KeyMode, useFlats = false): string => {
  const name = (useFlats ? FLAT_NAMES : SHARP_NAMES)[root];
  return mode === 'minor' ? `${name}m` : name;
};

/**
 * Work out what a chord is, so it can be compared with a key.
 */
export const classifyChord = (chord: string): ChordSummary | null => {
  const match = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return null;

  const root = pitchClassOf(match[1]);
  if (root < 0) return null;

  const suffix = match[2].toLowerCase().replace(/[()]/g, '');

  let quality: ChordQuality = 'unknown';

  if (suffix === '' || suffix === 'maj' || suffix.startsWith('maj')) quality = 'major';
  else if (suffix === 'm' || suffix === 'min' || suffix.startsWith('m9')) quality = 'minor';
  else if (suffix.startsWith('dim') || suffix === 'o' || suffix === 'ø') quality = 'diminished';
  else if (suffix.startsWith('aug') || suffix === '+') quality = 'augmented';
  else if (suffix.startsWith('sus')) quality = 'suspended';
  else if (suffix === '5') quality = 'power';
  else if (suffix.startsWith('7')) quality = 'dominant';
  else if (suffix.startsWith('m')) quality = 'minor';

  // A minor seventh chord is still a minor chord, a dominant seventh is a
  // major chord with a flattened seventh.
  if (suffix.startsWith('m') && !suffix.startsWith('maj')) quality = 'minor';

  return { root, quality, name: chord };
};

/** The chords that belong to a key, and how common each of them is. */
const QUALITY_SUFFIX: Partial<Record<ChordQuality, string>> = {
  major: '',
  minor: 'm',
  diminished: 'dim',
  augmented: 'aug',
  dominant: '7',
  suspended: 'sus',
  power: '5',
};

interface DiatonicChord {
  root: number;
  quality: ChordQuality;
  weight: number;
  degree: string;
}

/* In the order they appear in the scale, with how common each one is. */
const MAJOR_DEGREES: { offset: number; quality: ChordQuality; weight: number; degree: string }[] = [
  { offset: 0, quality: 'major', weight: 1, degree: 'I' },
  { offset: 2, quality: 'minor', weight: 0.6, degree: 'ii' },
  { offset: 4, quality: 'minor', weight: 0.45, degree: 'iii' },
  { offset: 5, quality: 'major', weight: 0.8, degree: 'IV' },
  { offset: 7, quality: 'major', weight: 0.85, degree: 'V' },
  { offset: 9, quality: 'minor', weight: 0.7, degree: 'vi' },
  { offset: 11, quality: 'diminished', weight: 0.35, degree: 'vii' },
];

const MINOR_DEGREES: { offset: number; quality: ChordQuality; weight: number; degree: string }[] = [
  { offset: 0, quality: 'minor', weight: 1, degree: 'i' },
  { offset: 2, quality: 'diminished', weight: 0.35, degree: 'ii' },
  { offset: 3, quality: 'major', weight: 0.75, degree: 'III' },
  { offset: 5, quality: 'minor', weight: 0.8, degree: 'iv' },
  { offset: 7, quality: 'minor', weight: 0.85, degree: 'v' },
  { offset: 8, quality: 'major', weight: 0.7, degree: 'VI' },
  { offset: 10, quality: 'major', weight: 0.6, degree: 'VII' },
];

const diatonicChords = (tonic: number, mode: KeyMode): DiatonicChord[] => {
  const degrees = mode === 'major' ? MAJOR_DEGREES : MINOR_DEGREES;
  return degrees.map((degree) => ({
    root: (tonic + degree.offset) % 12,
    quality: degree.quality,
    weight: degree.weight,
    degree: degree.degree,
  }));
};

/** How well a chord belongs to a key. */
const fitOf = (chord: ChordSummary, chords: DiatonicChord[]): number => {
  const match = chords.find((candidate) => candidate.root === chord.root);
  if (!match) return 0;

  // A power chord has no third, so it fits any quality.
  if (chord.quality === 'power') return match.weight * 0.8;

  if (chord.quality === match.quality) return match.weight;
  if (chord.quality === 'unknown') return match.weight * 0.7;

  // The same root but a different quality is a borrowed chord. It belongs
  // sometimes, so it counts for something.
  if (chord.quality === 'major' || chord.quality === 'minor') return match.weight * 0.3;

  return 0;
};

/**
 * Work out the key a song is in from the chords it uses.
 *
 * The chords at the start and the end count for more, because a song usually
 * begins and ends on its tonic.
 */
export const detectKey = (chords: string[]): KeyGuess | null => {
  const summaries = chords
    .map(classifyChord)
    .filter((chord): chord is ChordSummary => Boolean(chord));
  if (summaries.length === 0) return null;

  const weights = summaries.map((_, index) => {
    const first = index === 0 ? 2 : 1;
    const last = index === summaries.length - 1 ? 1.6 : 1;
    return first * last;
  });

  const total = weights.reduce((sum, weight) => sum + weight, 0);

  const scored: { key: string; mode: KeyMode; confidence: number; outside: string[] }[] = [];

  for (let tonic = 0; tonic < 12; tonic += 1) {
    for (const mode of ['major', 'minor'] as KeyMode[]) {
      const diatonic = diatonicChords(tonic, mode);

      let score = 0;
      const outside: string[] = [];

      summaries.forEach((chord, index) => {
        const fit = fitOf(chord, diatonic);
        score += fit * weights[index];
        if (fit === 0 && !outside.includes(chord.name)) outside.push(chord.name);
      });

      scored.push({
        key: keyName(tonic, mode),
        mode,
        confidence: score / total,
        outside,
      });
    }
  }

  scored.sort((a, b) => b.confidence - a.confidence);

  const best = scored[0];
  const alternatives = scored
    .slice(1)
    .filter((candidate) => candidate.confidence < best.confidence - 0.0001)
    .slice(0, 3)
    .map(({ key, mode, confidence }) => ({ key, mode, confidence }));

  return {
    key: best.key,
    mode: best.mode,
    confidence: best.confidence,
    alternatives,
    outside: best.outside,
  };
};

/**
 * The chords that belong to a key, in the order they usually appear.
 */
export const chordsOfKey = (key: string): { name: string; degree: string }[] => {
  const match = key.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return [];

  const root = pitchClassOf(match[1]);
  if (root < 0) return [];

  const mode: KeyMode = /^m(?!aj)/i.test(match[2]) ? 'minor' : 'major';
  const useFlats = match[1].includes('b');

  return diatonicChords(root, mode).map((chord) => ({
    name: `${keyName(chord.root, 'major', useFlats)}${QUALITY_SUFFIX[chord.quality] ?? ''}`,
    degree: chord.degree,
  }));
};

/** The keys a scale reference can be shown for. */
export const SCALE_KEYS = [
  'C',
  'C#',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
  'Am',
  'Cm',
  'Dm',
  'Em',
  'Fm',
  'Gm',
  'Bm',
];

const SCALE_STEPS = [0, 2, 4, 5, 7, 9, 11];

/** The notes of a scale, spelled the way the key is. */
export const notesOfScale = (key: string): string[] => {
  const match = key.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return [];

  const root = pitchClassOf(match[1]);
  if (root < 0) return [];

  const mode: KeyMode = /^m(?!aj)/i.test(match[2]) ? 'minor' : 'major';
  const useFlats = match[1].includes('b');
  const names = useFlats ? FLAT_NAMES : SHARP_NAMES;

  const steps = mode === 'minor' ? [0, 2, 3, 5, 7, 8, 10] : SCALE_STEPS;

  return steps.map((step) => names[(root + step) % 12]);
};

/**
 * Where a chord sits in a key, for example "C is the IV in G major".
 */
export const chordInKey = (
  chord: string,
  key: string
): { degree: string; fits: boolean } | null => {
  const summary = classifyChord(chord);
  if (!summary) return null;

  const match = key.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return null;

  const tonic = pitchClassOf(match[1]);
  if (tonic < 0) return null;

  const mode: KeyMode = /^m(?!aj)/i.test(match[2]) ? 'minor' : 'major';
  const diatonic = diatonicChords(tonic, mode);
  const found = diatonic.find((candidate) => candidate.root === summary.root);

  if (!found) return { degree: '—', fits: false };
  return { degree: found.degree, fits: fitOf(summary, diatonic) > 0.3 };
};
