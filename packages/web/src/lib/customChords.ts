/**
 * The shapes a player has drawn for themselves.
 *
 * A player has their own shapes for the chords they play, and the app has to
 * keep them: a shape that is lost when the tab is closed is no use to
 * anybody. They are kept on the device, like the rest of the library, and
 * they are never sent anywhere.
 */

import { useSyncExternalStore } from 'react';
import {
  registerChord,
  unregisterChord,
  type ChordDefinition,
  type ChordVariation,
} from '../data/chordLibrary';

const STORAGE_KEY = 'chorde_custom_chords';

/** A chord shape the player drew. */
export interface CustomChord extends ChordDefinition {
  /** The shape is the player's own. */
  custom: true;
  /** When the shape was drawn. */
  savedAt: string;
}

const isVariation = (value: unknown): value is ChordVariation => {
  if (!value || typeof value !== 'object') return false;
  const variation = value as Partial<ChordVariation>;
  return (
    Array.isArray(variation.frets) &&
    variation.frets.length === 6 &&
    variation.frets.every((fret) => fret === 'x' || (typeof fret === 'number' && fret >= 0))
  );
};

const isCustomChord = (value: unknown): value is CustomChord => {
  if (!value || typeof value !== 'object') return false;
  const chord = value as Partial<CustomChord>;
  return (
    typeof chord.name === 'string' &&
    chord.name.trim().length > 0 &&
    Array.isArray(chord.variations) &&
    chord.variations.length > 0 &&
    chord.variations.every(isVariation)
  );
};

const read = (): CustomChord[] => {
  if (typeof localStorage === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isCustomChord).map((chord) => ({
      ...chord,
      fullName: chord.fullName ?? `${chord.name} (your shape)`,
      custom: true,
      savedAt: chord.savedAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
};

let chords: CustomChord[] = read();

const listeners = new Set<() => void>();

const publish = (next: CustomChord[]): void => {
  chords = next;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage may be unavailable. The shapes stay for as long as the app is open.
  }

  listeners.forEach((listener) => listener());
};

/** The shapes the player has drawn. */
export const getCustomChords = (): CustomChord[] => chords;

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/**
 * The shapes the player has drawn, and a way to keep track of them.
 */
export const useCustomChords = (): CustomChord[] =>
  useSyncExternalStore(subscribe, getCustomChords, getCustomChords);

/**
 * Add a shape, or change the shape of a chord the player already has one for.
 */
export const saveCustomChord = (name: string, variation: ChordVariation): CustomChord => {
  const trimmed = name.trim();
  const existing = chords.find((chord) => chord.name.toLowerCase() === trimmed.toLowerCase());

  const chord: CustomChord = {
    name: trimmed,
    fullName: `${trimmed} (your shape)`,
    variations: [variation],
    custom: true,
    savedAt: new Date().toISOString(),
  };

  const next = existing
    ? chords.map((entry) => (entry.name === existing.name ? chord : entry))
    : [...chords, chord];

  registerChord(chord);
  publish(next);

  return chord;
};

/**
 * Take a shape away. The library's own shape for the chord comes back.
 */
export const deleteCustomChord = (name: string): void => {
  const next = chords.filter((chord) => chord.name !== name);
  unregisterChord(name);
  publish(next);
};

/**
 * Put the player's shapes into the library of chords, so that every part of
 * the app draws the shape the player has for that chord.
 */
export const registerCustomChords = (): void => {
  chords.forEach((chord) => registerChord(chord));
};

registerCustomChords();
