/**
 * The sound of the app.
 *
 * The tone is meant to sound like a guitar rather than a test beep. A plucked
 * string is full of harmonics at the moment it is plucked and loses them as it
 * rings, so the guitar tone is a filtered sawtooth whose filter falls as the
 * note decays, rather than a plain sine wave.
 */

/** The timbres the app can play. */
export type ToneType = 'guitar' | 'triangle' | 'sine';

export const TONE_TYPES: ToneType[] = ['guitar', 'triangle', 'sine'];

/** The name shown for each tone. */
export const TONE_LABELS: Record<ToneType, string> = {
  guitar: 'Guitar',
  triangle: 'Soft',
  sine: 'Pure',
};

export interface AudioPreferences {
  /** How loud the app plays, from 0 to 1. */
  volume: number;
  /** The timbre the notes are played with. */
  tone: ToneType;
  /** Whether anything is played at all. */
  enabled: boolean;
}

export const DEFAULT_AUDIO_PREFERENCES: AudioPreferences = {
  volume: 0.3,
  tone: 'guitar',
  enabled: true,
};

const AUDIO_PREFS_KEY = 'chorde_audio_prefs';

/**
 * One note of a chord.
 *
 * The order is the order the string is strummed in, so the notes of a chord
 * are heard from the lowest string to the highest.
 */
export interface StrumNote {
  frequency: number;
  order?: number;
}

export interface SequenceStep {
  notes: StrumNote[];
  /** How long the step lasts, in seconds. */
  duration: number;
}

export interface SequenceHandle {
  /** Stop the sequence and silence anything it has scheduled. */
  stop: () => void;
}

/**
 * The preferences that were saved before the tone was chosen.
 *
 * The old setting was a raw waveform; it is folded into a tone so nobody
 * loses the volume they picked.
 */
const LEGACY_WAVEFORM_TONES: Record<string, ToneType> = {
  sawtooth: 'guitar',
  square: 'triangle',
  triangle: 'triangle',
  sine: 'sine',
};

const isToneType = (value: unknown): value is ToneType =>
  typeof value === 'string' && TONE_TYPES.includes(value as ToneType);

const readStoredPreferences = (): Partial<AudioPreferences> & { waveform?: string } => {
  if (typeof localStorage === 'undefined') return {};
  try {
    const stored = localStorage.getItem(AUDIO_PREFS_KEY);
    if (!stored) return {};
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Partial<AudioPreferences> & { waveform?: string };
  } catch {
    return {};
  }
};

/**
 * The preferences the app plays with.
 *
 * Anything unreadable falls back to the defaults rather than failing, because
 * a broken preference should not silence the app.
 */
export const getAudioPreferences = (): AudioPreferences => {
  const stored = readStoredPreferences();

  const volume =
    typeof stored.volume === 'number' && Number.isFinite(stored.volume)
      ? Math.min(1, Math.max(0, stored.volume))
      : DEFAULT_AUDIO_PREFERENCES.volume;

  const tone = isToneType(stored.tone)
    ? stored.tone
    : stored.waveform && LEGACY_WAVEFORM_TONES[stored.waveform]
      ? LEGACY_WAVEFORM_TONES[stored.waveform]
      : DEFAULT_AUDIO_PREFERENCES.tone;

  const enabled =
    typeof stored.enabled === 'boolean' ? stored.enabled : DEFAULT_AUDIO_PREFERENCES.enabled;

  return { volume, tone, enabled };
};

/** Remember the preferences the app plays with. */
export const saveAudioPreferences = (preferences: AudioPreferences): void => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(AUDIO_PREFS_KEY, JSON.stringify(preferences));
  } catch {
    // Best effort only; the preferences are a convenience, not critical state.
  }
};

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;

/** Every oscillator that is still sounding, so they can all be stopped. */
const activeOscillators = new Set<OscillatorNode>();

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;

  if (!audioContext) {
    const AudioContextCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: new () => AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return null;
    audioContext = new AudioContextCtor();
    masterGain = null;
  }

  return audioContext;
};

/**
 * The master chain.
 *
 * The compressor is there because a strummed chord adds several notes at once
 * and would otherwise clip.
 */
const getMasterGain = (ctx: AudioContext): GainNode => {
  if (!masterGain) {
    const gain = ctx.createGain();
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -14;
    compressor.knee.value = 12;
    compressor.ratio.value = 8;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.25;

    gain.connect(compressor);
    compressor.connect(ctx.destination);
    masterGain = gain;
  }

  return masterGain;
};

const trackOscillator = (oscillator: OscillatorNode): void => {
  activeOscillators.add(oscillator);
  oscillator.onended = () => {
    activeOscillators.delete(oscillator);
  };
};

/**
 * One plucked string.
 *
 * Two sawtooth waves a few cents apart give the beating that a real string
 * has, and the falling filter is what makes it sound plucked rather than
 * sustained.
 */
const scheduleGuitarNote = (
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  peak: number
): OscillatorNode[] => {
  const output = ctx.createGain();
  output.gain.setValueAtTime(0.0001, start);
  output.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), start + 0.008);
  output.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.Q.value = 0.8;
  const openCutoff = Math.min(Math.max(frequency * 8, 900), 6000);
  filter.frequency.setValueAtTime(openCutoff, start);
  filter.frequency.exponentialRampToValueAtTime(
    Math.max(frequency * 1.6, 220),
    start + Math.min(duration, 0.9)
  );
  filter.connect(output);

  const oscillators: OscillatorNode[] = [];

  [0, 7].forEach((detune) => {
    const oscillator = ctx.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = frequency;
    oscillator.detune.value = detune;
    oscillator.connect(filter);
    oscillator.start(start);
    oscillator.stop(start + duration);
    trackOscillator(oscillator);
    oscillators.push(oscillator);
  });

  output.connect(getMasterGain(ctx));

  return oscillators;
};

/** One plain note, for the softer tones. */
const schedulePlainNote = (
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  peak: number,
  waveform: OscillatorType
): OscillatorNode[] => {
  const output = ctx.createGain();
  const attack = 0.01;
  const release = Math.min(0.15, duration / 2);

  output.gain.setValueAtTime(0.0001, start);
  output.gain.linearRampToValueAtTime(Math.max(peak, 0.0002), start + attack);
  output.gain.setValueAtTime(Math.max(peak, 0.0002), start + Math.max(duration - release, attack));
  output.gain.linearRampToValueAtTime(0.0001, start + duration);

  const oscillator = ctx.createOscillator();
  oscillator.type = waveform;
  oscillator.frequency.value = frequency;
  oscillator.connect(output);
  oscillator.start(start);
  oscillator.stop(start + duration);
  trackOscillator(oscillator);

  output.connect(getMasterGain(ctx));

  return [oscillator];
};

const scheduleNote = (
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  peak: number,
  tone: ToneType
): OscillatorNode[] => {
  if (tone === 'guitar') return scheduleGuitarNote(ctx, frequency, start, duration, peak);
  return schedulePlainNote(
    ctx,
    frequency,
    start,
    duration,
    peak,
    tone === 'sine' ? 'sine' : 'triangle'
  );
};

/** How loud one note of a group of notes should be, so a chord does not clip. */
const peakFor = (noteCount: number): number => 0.7 / Math.sqrt(Math.max(noteCount, 1));

/**
 * Play a chord as a strum, from the lowest string to the highest.
 *
 * The gap between the strings is short enough to sound like one movement of
 * the hand rather than a run of separate notes.
 */
export const playStrummedChord = (
  notes: StrumNote[],
  duration: number = 1.5,
  options?: Partial<AudioPreferences> & { timePerString?: number }
): void => {
  const { timePerString = 0.03, ...audioOptions } = options ?? {};
  const prefs = { ...getAudioPreferences(), ...audioOptions };
  if (!prefs.enabled || notes.length === 0) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const peak = peakFor(notes.length);
  const start = ctx.currentTime;

  const ordered = [...notes].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  ordered.forEach((note, index) => {
    scheduleNote(ctx, note.frequency, start + index * timePerString, duration, peak, prefs.tone);
  });
};

/**
 * Play a sequence of notes, one after another.
 *
 * It is used for a scale, which is played up and then back down.
 */
export const playScale = (
  frequencies: number[],
  options?: {
    tempo?: number;
    ascending?: boolean;
    descending?: boolean;
    audioPrefs?: Partial<AudioPreferences>;
  }
): void => {
  const { tempo = 120, ascending = true, descending = false, audioPrefs } = options ?? {};

  const prefs = { ...getAudioPreferences(), ...audioPrefs };
  if (!prefs.enabled || frequencies.length === 0) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const beatDuration = 60 / tempo;
  const noteDuration = beatDuration * 0.8;

  let sequence = ascending ? [...frequencies] : [];
  if (descending) {
    sequence = [...sequence, ...[...frequencies].reverse().slice(1)];
  }

  const peak = peakFor(1);
  const start = ctx.currentTime;

  sequence.forEach((frequency, index) => {
    scheduleNote(ctx, frequency, start + index * beatDuration, noteDuration, peak, prefs.tone);
  });
};

/**
 * A metronome click.
 *
 * The first beat of a bar is louder and higher, so the bar can be found by
 * ear. It is a plain square wave, because a click that sounds like a click is
 * easier to keep time against than one that sounds like a note.
 */
export const playClick = (accent = false, options?: Partial<AudioPreferences>): void => {
  const prefs = { ...getAudioPreferences(), ...options };
  if (!prefs.enabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.value = accent ? 1400 : 1000;

  const gain = ctx.createGain();
  const now = ctx.currentTime;
  // The level is set so that the click is as loud at the usual volume as it
  // was when it was played on its own.
  gain.gain.setValueAtTime(accent ? 0.55 : 0.3, now);
  gain.gain.linearRampToValueAtTime(0, now + 0.06);

  oscillator.connect(gain);
  gain.connect(getMasterGain(ctx));

  oscillator.start(now);
  oscillator.stop(now + 0.06);
  trackOscillator(oscillator);
};

/**
 * Play a sequence of chords, one after another.
 *
 * The handle that comes back can stop the sequence, which silences the
 * chords that have not been played yet.
 */
export const playSequence = (
  steps: SequenceStep[],
  options?: {
    onStep?: (index: number) => void;
    onEnd?: () => void;
    audioPrefs?: Partial<AudioPreferences>;
  }
): SequenceHandle => {
  const { onStep, onEnd, audioPrefs } = options ?? {};

  const prefs = { ...getAudioPreferences(), ...audioPrefs };
  const ctx = prefs.enabled ? getAudioContext() : null;

  if (!ctx || steps.length === 0) {
    onEnd?.();
    return { stop: () => undefined };
  }

  const oscillators: OscillatorNode[] = [];
  const timers: ReturnType<typeof setTimeout>[] = [];
  let stopped = false;

  const start = ctx.currentTime;
  let elapsed = 0;

  steps.forEach((step, index) => {
    const stepStart = start + elapsed;
    const peak = peakFor(step.notes.length);

    step.notes.forEach((note) => {
      oscillators.push(
        ...scheduleNote(ctx, note.frequency, stepStart, step.duration, peak, prefs.tone)
      );
    });

    if (onStep) {
      const delay = Math.max(0, (stepStart - ctx.currentTime) * 1000);
      timers.push(
        setTimeout(() => {
          if (!stopped) onStep(index);
        }, delay)
      );
    }

    elapsed += step.duration;
  });

  if (onEnd) {
    timers.push(
      setTimeout(
        () => {
          if (!stopped) onEnd();
        },
        Math.max(0, elapsed * 1000)
      )
    );
  }

  const stop = () => {
    if (stopped) return;
    stopped = true;
    timers.forEach((timer) => clearTimeout(timer));
    oscillators.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch {
        // The oscillator may have already stopped on its own.
      }
      activeOscillators.delete(oscillator);
    });
  };

  return { stop };
};

/**
 * Resume the audio context.
 *
 * Browsers keep it suspended until the user has interacted with the page.
 */
export const resumeAudioContext = async (): Promise<void> => {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    await ctx.resume();
  }
};

/**
 * Stop everything that is sounding.
 */
export const stopAllSounds = (): void => {
  activeOscillators.forEach((oscillator) => {
    try {
      oscillator.stop();
    } catch {
      // The oscillator may have already stopped on its own.
    }
    activeOscillators.delete(oscillator);
  });
};
