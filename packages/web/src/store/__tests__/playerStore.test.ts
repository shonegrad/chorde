import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore } from '../playerStore';

describe('usePlayerStore', () => {
  beforeEach(() => {
    usePlayerStore.getState().reset();
  });

  it('sets transpose via function', () => {
    usePlayerStore.getState().setTranspose(2);
    expect(usePlayerStore.getState().transpose).toBe(2);
    usePlayerStore.getState().setTranspose((p) => p + 1);
    expect(usePlayerStore.getState().transpose).toBe(3);
  });

  it('resets state', () => {
    usePlayerStore.getState().setAutoScroll(true);
    usePlayerStore.getState().setFontSize(40);
    usePlayerStore.getState().reset();
    expect(usePlayerStore.getState().autoScroll).toBe(false);
    expect(usePlayerStore.getState().fontSize).toBe(20);
  });

  it('sets bpm', () => {
    usePlayerStore.getState().setBpm(140);
    expect(usePlayerStore.getState().bpm).toBe(140);
    usePlayerStore.getState().setBpm((p) => (p ?? 0) + 10);
    expect(usePlayerStore.getState().bpm).toBe(150);
  });
});
