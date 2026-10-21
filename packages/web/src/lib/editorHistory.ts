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
  /** What the last change was, so that changes of the same thing group together. */
  lastGroup?: string;
  /** When the last change was made. */
  lastAt?: number;
}

export const HISTORY_LIMIT = 50;

/**
 * How long two changes to the same thing count as one.
 *
 * Typing a word is a dozen changes, and taking them back one at a time is
 * no use to anybody.
 */
export const MERGE_WINDOW_MS = 700;

export const createHistory = (present: EditorSnapshot): EditorHistory => ({
  past: [],
  present,
  future: [],
});

/**
 * Record a change.
 *
 * Changes to the same thing, made one after another without a pause, are
 * recorded as one, so that undo takes back a thought and not a letter.
 */
export const commit = (
  history: EditorHistory,
  next: EditorSnapshot,
  limit = HISTORY_LIMIT,
  options: { group?: string; at?: number } = {}
): EditorHistory => {
  if (isSameSnapshot(history.present, next)) return history;

  const group = options.group;
  const at = options.at ?? Date.now();

  const continues =
    group !== undefined &&
    group === history.lastGroup &&
    at - (history.lastAt ?? 0) < MERGE_WINDOW_MS;

  // The change continues the last one, so the last state is replaced rather
  // than pushed onto the history.
  if (continues) {
    return { ...history, present: next, future: [], lastGroup: group, lastAt: at };
  }

  const past = [...history.past, history.present];
  if (past.length > limit) past.shift();

  return { past, present: next, future: [], lastGroup: group, lastAt: at };
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
    // What comes next is a new thought, not a continuation of the last one.
    lastGroup: undefined,
    lastAt: undefined,
  };
};

export const redo = (history: EditorHistory): EditorHistory => {
  if (!canRedo(history)) return history;

  const [next, ...rest] = history.future;
  return {
    past: [...history.past, history.present],
    present: next,
    future: rest,
    lastGroup: undefined,
    lastAt: undefined,
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
