// Web Audio API utilities for playing notes, chords, and scales

/**
 * Audio context singleton
 */
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
    return audioContext;
}

/**
 * Waveform types for oscillators
 */
export type WaveformType = 'sine' | 'triangle' | 'square' | 'sawtooth';

/**
 * Audio preferences (stored in localStorage)
 */
export interface AudioPreferences {
    volume: number; // 0-1
    waveform: WaveformType;
    enabled: boolean;
}

const DEFAULT_PREFS: AudioPreferences = {
    volume: 0.3,
    waveform: 'sine',
    enabled: true
};

/**
 * Get audio preferences from localStorage
 */
export function getAudioPreferences(): AudioPreferences {
    const stored = localStorage.getItem('chorde_audio_prefs');
    if (stored) {
        try {
            return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
        } catch (e) {
            return DEFAULT_PREFS;
        }
    }
    return DEFAULT_PREFS;
}

/**
 * Save audio preferences to localStorage
 */
export function saveAudioPreferences(prefs: AudioPreferences): void {
    localStorage.setItem('chorde_audio_prefs', JSON.stringify(prefs));
}

/**
 * Play a single note
 */
export function playNote(
    frequency: number,
    duration: number = 0.5,
    options?: Partial<AudioPreferences>
): void {
    const prefs = { ...getAudioPreferences(), ...options };
    if (!prefs.enabled) return;

    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Create oscillator
    const oscillator = ctx.createOscillator();
    oscillator.type = prefs.waveform;
    oscillator.frequency.value = frequency;

    // Create gain node for volume control and envelope
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0;

    // ADSR envelope (simplified)
    const attackTime = 0.01;
    const decayTime = 0.1;
    const sustainLevel = prefs.volume * 0.7;
    const releaseTime = 0.1;

    // Attack
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(prefs.volume, now + attackTime);

    // Decay to sustain
    gainNode.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);

    // Hold sustain
    gainNode.gain.setValueAtTime(sustainLevel, now + duration - releaseTime);

    // Release
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Play
    oscillator.start(now);
    oscillator.stop(now + duration);
}

/**
 * Play multiple notes simultaneously (chord)
 */
export function playChord(
    frequencies: number[],
    duration: number = 1.0,
    options?: Partial<AudioPreferences>
): void {
    const prefs = { ...getAudioPreferences(), ...options };
    if (!prefs.enabled || frequencies.length === 0) return;

    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Adjust volume for multiple notes
    const adjustedVolume = prefs.volume / Math.sqrt(frequencies.length);

    frequencies.forEach((freq, index) => {
        // Slightly stagger the attack for more natural sound
        const stagger = index * 0.005;

        const oscillator = ctx.createOscillator();
        oscillator.type = prefs.waveform;
        oscillator.frequency.value = freq;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0;

        // ADSR envelope
        const attackTime = 0.02;
        const decayTime = 0.15;
        const sustainLevel = adjustedVolume * 0.7;
        const releaseTime = 0.2;

        gainNode.gain.setValueAtTime(0, now + stagger);
        gainNode.gain.linearRampToValueAtTime(adjustedVolume, now + stagger + attackTime);
        gainNode.gain.linearRampToValueAtTime(sustainLevel, now + stagger + attackTime + decayTime);
        gainNode.gain.setValueAtTime(sustainLevel, now + duration - releaseTime);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(now + stagger);
        oscillator.stop(now + duration);
    });
}

/**
 * Play a sequence of notes (scale or melody)
 */
export function playScale(
    frequencies: number[],
    options?: {
        tempo?: number; // BPM
        ascending?: boolean;
        descending?: boolean;
        audioPrefs?: Partial<AudioPreferences>;
    }
): void {
    const {
        tempo = 120,
        ascending = true,
        descending = false,
        audioPrefs
    } = options || {};

    const prefs = { ...getAudioPreferences(), ...audioPrefs };
    if (!prefs.enabled || frequencies.length === 0) return;

    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Calculate note duration from tempo
    const beatDuration = 60 / tempo; // seconds per beat
    const noteDuration = beatDuration * 0.8; // slight gap between notes

    let sequence = ascending ? [...frequencies] : [];
    if (descending) {
        sequence = [...sequence, ...[...frequencies].reverse().slice(1)];
    }

    sequence.forEach((freq, index) => {
        const startTime = now + (index * beatDuration);

        const oscillator = ctx.createOscillator();
        oscillator.type = prefs.waveform;
        oscillator.frequency.value = freq;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0;

        // Quick attack and release for scale playback
        const attackTime = 0.01;
        const releaseTime = 0.05;

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(prefs.volume, startTime + attackTime);
        gainNode.gain.setValueAtTime(prefs.volume, startTime + noteDuration - releaseTime);
        gainNode.gain.linearRampToValueAtTime(0, startTime + noteDuration);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + noteDuration);
    });
}

/**
 * Resume audio context (required for user interaction on some browsers)
 */
export async function resumeAudioContext(): Promise<void> {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
        await ctx.resume();
    }
}

/**
 * Stop all currently playing sounds
 */
export function stopAllSounds(): void {
    if (audioContext) {
        // Close and recreate context to stop all sounds
        audioContext.close();
        audioContext = null;
    }
}
