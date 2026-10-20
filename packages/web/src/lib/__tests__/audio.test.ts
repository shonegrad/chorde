import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * A stand-in for the Web Audio API.
 *
 * The audio module is only worth testing if the graph it builds is checked,
 * so the fake records what was connected and what was started.
 */
class FakeAudioParam {
  value = 0;
  setValueAtTime = vi.fn();
  linearRampToValueAtTime = vi.fn();
  exponentialRampToValueAtTime = vi.fn();
}

class FakeNode {
  connect = vi.fn((node: FakeNode) => node);
  disconnect = vi.fn();
}

class FakeOscillator extends FakeNode {
  type = 'sine';
  frequency = new FakeAudioParam();
  detune = new FakeAudioParam();
  start = vi.fn();
  stop = vi.fn();
  onended: (() => void) | null = null;
}

class FakeGainNode extends FakeNode {
  gain = new FakeAudioParam();
}

class FakeFilterNode extends FakeNode {
  type = 'lowpass';
  frequency = new FakeAudioParam();
  Q = new FakeAudioParam();
}

class FakeCompressorNode extends FakeNode {
  threshold = new FakeAudioParam();
  knee = new FakeAudioParam();
  ratio = new FakeAudioParam();
  attack = new FakeAudioParam();
  release = new FakeAudioParam();
}

interface Recorded {
  oscillators: FakeOscillator[];
  filters: FakeFilterNode[];
  gains: FakeGainNode[];
  compressors: FakeCompressorNode[];
}

const installFakeAudioContext = (): Recorded => {
  const recorded: Recorded = {
    oscillators: [],
    filters: [],
    gains: [],
    compressors: [],
  };

  class FakeAudioContext {
    currentTime = 0;
    state = 'running';
    destination = new FakeNode();

    createOscillator(): FakeOscillator {
      const oscillator = new FakeOscillator();
      recorded.oscillators.push(oscillator);
      return oscillator;
    }

    createGain(): FakeGainNode {
      const gain = new FakeGainNode();
      recorded.gains.push(gain);
      return gain;
    }

    createBiquadFilter(): FakeFilterNode {
      const filter = new FakeFilterNode();
      recorded.filters.push(filter);
      return filter;
    }

    createDynamicsCompressor(): FakeCompressorNode {
      const compressor = new FakeCompressorNode();
      recorded.compressors.push(compressor);
      return compressor;
    }

    resume = vi.fn(async () => undefined);
  }

  Object.defineProperty(window, 'AudioContext', {
    value: FakeAudioContext,
    configurable: true,
    writable: true,
  });

  return recorded;
};

type AudioModule = typeof import('../audio');

let audio: AudioModule;
let recorded: Recorded;

beforeEach(async () => {
  vi.resetModules();
  recorded = installFakeAudioContext();
  audio = await import('../audio');
});

describe('audio preferences', () => {
  it('starts with a guitar tone at a sensible volume', () => {
    expect(audio.getAudioPreferences()).toEqual({
      volume: 0.3,
      tone: 'guitar',
      enabled: true,
    });
  });

  it('remembers the preferences that were saved', () => {
    audio.saveAudioPreferences({ volume: 0.8, tone: 'sine', enabled: false });

    expect(audio.getAudioPreferences()).toEqual({
      volume: 0.8,
      tone: 'sine',
      enabled: false,
    });
  });

  it('keeps a volume that makes sense', () => {
    audio.saveAudioPreferences({ volume: 4, tone: 'sine', enabled: true });
    expect(audio.getAudioPreferences().volume).toBe(1);

    audio.saveAudioPreferences({ volume: -2, tone: 'sine', enabled: true });
    expect(audio.getAudioPreferences().volume).toBe(0);
  });

  it('falls back to the defaults when what was saved cannot be read', () => {
    localStorage.setItem('chorde_audio_prefs', 'not json');

    expect(audio.getAudioPreferences()).toEqual({
      volume: 0.3,
      tone: 'guitar',
      enabled: true,
    });
  });

  it('ignores a tone that does not exist', () => {
    localStorage.setItem(
      'chorde_audio_prefs',
      JSON.stringify({ volume: 0.5, tone: 'kazoo', enabled: true })
    );

    expect(audio.getAudioPreferences().tone).toBe('guitar');
  });

  it('folds the old waveform setting into a tone', () => {
    localStorage.setItem(
      'chorde_audio_prefs',
      JSON.stringify({ volume: 0.5, waveform: 'sawtooth', enabled: true })
    );

    expect(audio.getAudioPreferences()).toEqual({
      volume: 0.5,
      tone: 'guitar',
      enabled: true,
    });
  });
});

describe('the guitar tone', () => {
  it('plays a note as two strings a few cents apart', () => {
    audio.playStrummedChord([{ frequency: 440 }]);

    expect(recorded.oscillators).toHaveLength(2);
    recorded.oscillators.forEach((oscillator) => {
      expect(oscillator.type).toBe('sawtooth');
      expect(oscillator.frequency.value).toBe(440);
    });
    expect(recorded.oscillators[0].detune.value).toBe(0);
    expect(recorded.oscillators[1].detune.value).toBeGreaterThan(0);
  });

  it('filters the tone, so it sounds plucked rather than sustained', () => {
    audio.playStrummedChord([{ frequency: 440 }]);

    expect(recorded.filters).toHaveLength(1);
    expect(recorded.filters[0].type).toBe('lowpass');
    expect(recorded.filters[0].frequency.setValueAtTime).toHaveBeenCalled();
    expect(recorded.filters[0].frequency.exponentialRampToValueAtTime).toHaveBeenCalled();
  });

  it('plays a plain note for the softer tones', () => {
    audio.saveAudioPreferences({ volume: 0.3, tone: 'sine', enabled: true });
    audio.playStrummedChord([{ frequency: 440 }]);

    expect(recorded.oscillators).toHaveLength(1);
    expect(recorded.oscillators[0].type).toBe('sine');
    expect(recorded.filters).toHaveLength(0);
  });

  it('plays nothing when the sound is switched off', () => {
    audio.saveAudioPreferences({ volume: 0.3, tone: 'guitar', enabled: false });
    audio.playStrummedChord([{ frequency: 440 }, { frequency: 554 }]);
    audio.playScale([440, 554]);
    audio.playSequence([{ notes: [{ frequency: 440 }], duration: 1 }]);
    audio.playClick(true);

    expect(recorded.oscillators).toHaveLength(0);
  });

  it('keeps the sound out of clipping', () => {
    audio.playStrummedChord([
      { frequency: 220, order: 0 },
      { frequency: 277, order: 1 },
      { frequency: 330, order: 2 },
    ]);

    expect(recorded.compressors).toHaveLength(1);
    expect(recorded.compressors[0].connect).toHaveBeenCalled();
  });

  it('strums a chord from the lowest string to the highest', () => {
    audio.playStrummedChord([
      { frequency: 330, order: 2 },
      { frequency: 220, order: 0 },
      { frequency: 277, order: 1 },
    ]);

    // Each note is played by two strings, so each frequency appears twice.
    const frequencies = recorded.oscillators.map((oscillator) => oscillator.frequency.value);
    const started = recorded.oscillators.map((oscillator) => oscillator.start.mock.calls[0][0]);

    expect([...new Set(frequencies)]).toEqual([220, 277, 330]);
    expect(started[0]).toBeLessThan(started[2]);
    expect(started[2]).toBeLessThan(started[4]);
  });

  it('plays a scale up and then back down', () => {
    audio.saveAudioPreferences({ volume: 0.3, tone: 'sine', enabled: true });
    audio.playScale([220, 247, 262], { tempo: 120, ascending: true, descending: true });

    const frequencies = recorded.oscillators.map((oscillator) => oscillator.frequency.value);

    // Up, then down without playing the top note twice.
    expect(frequencies).toEqual([220, 247, 262, 247, 220]);
  });
});

describe('the count-in click', () => {
  it('is a square wave, and the first beat of a bar is higher', () => {
    audio.playClick(true);

    expect(recorded.oscillators).toHaveLength(1);
    expect(recorded.oscillators[0].type).toBe('square');
    expect(recorded.oscillators[0].frequency.value).toBe(1400);
  });

  it('is lower on the other beats', () => {
    audio.playClick(false);

    expect(recorded.oscillators[0].frequency.value).toBe(1000);
  });

  it('plays nothing when the sound is switched off', () => {
    audio.saveAudioPreferences({ volume: 0.3, tone: 'guitar', enabled: false });
    audio.playClick(true);

    expect(recorded.oscillators).toHaveLength(0);
  });
});

describe('playing a sequence', () => {
  it('plays one step after another and says which step it is', () => {
    vi.useFakeTimers();

    const steps = [
      { notes: [{ frequency: 220 }], duration: 1 },
      { notes: [{ frequency: 277 }], duration: 1 },
    ];
    const onStep = vi.fn();
    const onEnd = vi.fn();

    audio.playSequence(steps, { onStep, onEnd });

    vi.advanceTimersByTime(10);
    expect(onStep).toHaveBeenCalledWith(0);

    vi.advanceTimersByTime(1000);
    expect(onStep).toHaveBeenCalledWith(1);

    vi.advanceTimersByTime(1000);
    expect(onEnd).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('stops what it has scheduled when it is stopped', () => {
    const handle = audio.playSequence([
      { notes: [{ frequency: 220 }], duration: 5 },
      { notes: [{ frequency: 277 }], duration: 5 },
    ]);

    expect(recorded.oscillators.length).toBeGreaterThan(0);

    handle.stop();

    recorded.oscillators.forEach((oscillator) => {
      expect(oscillator.stop).toHaveBeenCalled();
    });
  });

  it('stops everything that is sounding', () => {
    audio.playStrummedChord([{ frequency: 440 }]);
    audio.stopAllSounds();

    recorded.oscillators.forEach((oscillator) => {
      expect(oscillator.stop).toHaveBeenCalled();
    });
  });
});
