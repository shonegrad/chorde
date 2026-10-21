import { describe, it, expect } from 'vitest';
import {
  MERGE_WINDOW_MS,
  canRedo,
  canUndo,
  commit,
  createHistory,
  isSameSnapshot,
  redo,
  undo,
  type EditorSnapshot,
} from '../editorHistory';

const snapshot = (content: string): EditorSnapshot => ({
  content,
  title: 'A song',
  artist: 'Someone',
  tags: [],
});

describe('the editing history', () => {
  it('starts with nothing to undo', () => {
    const history = createHistory(snapshot(''));

    expect(canUndo(history)).toBe(false);
    expect(canRedo(history)).toBe(false);
  });

  it('takes a change back', () => {
    let history = createHistory(snapshot(''));
    history = commit(history, snapshot('one'));

    expect(history.present.content).toBe('one');

    history = undo(history);

    expect(history.present.content).toBe('');
    expect(canRedo(history)).toBe(true);
  });

  it('puts a change back that was taken back', () => {
    let history = createHistory(snapshot(''));
    history = commit(history, snapshot('one'));
    history = undo(history);

    history = redo(history);

    expect(history.present.content).toBe('one');
  });

  it('ignores a change that changes nothing', () => {
    const history = createHistory(snapshot('one'));

    expect(commit(history, snapshot('one'))).toBe(history);
  });

  it('groups changes to the same thing that are made one after another', () => {
    let history = createHistory(snapshot(''));

    history = commit(history, snapshot('a'), undefined, { group: 'content', at: 1000 });
    history = commit(history, snapshot('ab'), undefined, { group: 'content', at: 1100 });
    history = commit(history, snapshot('abc'), undefined, { group: 'content', at: 1200 });

    // Three keystrokes, one step back.
    expect(history.past).toHaveLength(1);

    history = undo(history);

    expect(history.present.content).toBe('');
  });

  it('does not group changes that are made a long time apart', () => {
    let history = createHistory(snapshot(''));

    history = commit(history, snapshot('a'), undefined, { group: 'content', at: 1000 });
    history = commit(history, snapshot('ab'), undefined, {
      group: 'content',
      at: 1000 + MERGE_WINDOW_MS + 1,
    });

    expect(history.past).toHaveLength(2);
  });

  it('does not group changes to different things', () => {
    let history = createHistory(snapshot(''));

    history = commit(history, snapshot('a'), undefined, { group: 'content', at: 1000 });
    history = commit(history, { ...snapshot('a'), title: 'Another' }, undefined, {
      group: 'title',
      at: 1100,
    });

    expect(history.past).toHaveLength(2);
  });

  it('does not carry a group over an undo', () => {
    let history = createHistory(snapshot(''));
    history = commit(history, snapshot('a'), undefined, { group: 'content', at: 1000 });
    history = undo(history);
    history = commit(history, snapshot('b'), undefined, { group: 'content', at: 1100 });

    // The change after the undo is its own step.
    expect(history.past).toHaveLength(1);
  });

  it('says when two snapshots are the same', () => {
    expect(isSameSnapshot(snapshot('a'), snapshot('a'))).toBe(true);
    expect(isSameSnapshot(snapshot('a'), snapshot('b'))).toBe(false);
  });
});
