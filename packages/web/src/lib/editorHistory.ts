/**
 * The editing history.
 *
 * Writing a song means changing your mind a lot, so being able to take a
 * change back matters more than anything else in the editor.
 */

export interface EditorSnapshot {
  content: string;
  title: string;
  artist: string;
  key?: string;
  capo?: number;
  bpm?: number;
  timeSignature?: string;
  duration?: string;
  notes?: string;
  tags: string[];
}

export interface EditorHistory {
  /** The states before the current one. */
  past: EditorSnapshot[];
  present: EditorSnapshot;
  /** The states that were undone. */
  future: EditorSnapshot[];
}

export const HISTORY_LIMIT = 50;

export const createHistory = (present: EditorSnapshot): EditorHistory => ({
  past: [],
  present,
  future: [],
});

/**
 * Record a change.
 *
 * Nothing is recorded while the user is still typing the same thing, so a
 * single word does not fill the history with a dozen steps.
 */
export const commit = (
  history: EditorHistory,
  next: EditorSnapshot,
  limit = HISTORY_LIMIT
): EditorHistory => {
  if (isSameSnapshot(history.present, next)) return history;

  const past = [...history.past, history.present];
  if (past.length > limit) past.shift();

  return { past, present: next, future: [] };
};

export const canUndo = (history: EditorHistory): boolean => history.past.length > 0;
export const canRedo = (history: EditorHistory): boolean => history.future.length > 0;

export const undo = (history: EditorHistory): EditorHistory => {
  if (!canUndo(history)) return history;

  const previous = history.past[history.past.length - 1];
  return {
    past: history.past.slice(0, -1),
    present: previous,
    future: [history.present, ...history.future],
  };
};

export const redo = (history: EditorHistory): EditorHistory => {
  if (!canRedo(history)) return history;

  const [next, ...rest] = history.future;
  return {
    past: [...history.past, history.present],
    present: next,
    future: rest,
  };
};

export const isSameSnapshot = (a: EditorSnapshot, b: EditorSnapshot): boolean =>
  a.content === b.content &&
  a.title === b.title &&
  a.artist === b.artist &&
  a.key === b.key &&
  a.capo === b.capo &&
  a.bpm === b.bpm &&
  a.timeSignature === b.timeSignature &&
  a.duration === b.duration &&
  a.notes === b.notes &&
  a.tags.join(',') === b.tags.join(',');
