import { describe, it, expect, beforeEach } from 'vitest';
import { useSetlistStore } from '../setlistStore';

describe('useSetlistStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useSetlistStore.setState({ setlists: [] });
  });

  it('creates a setlist', () => {
    const sl = useSetlistStore.getState().createSetlist('My Set');
    expect(sl.name).toBe('My Set');
    expect(useSetlistStore.getState().setlists).toHaveLength(1);
  });

  it('renames a setlist', () => {
    const sl = useSetlistStore.getState().createSetlist('Old');
    useSetlistStore.getState().renameSetlist(sl.id, 'New');
    expect(useSetlistStore.getState().getSetlist(sl.id)?.name).toBe('New');
  });

  it('deletes a setlist', () => {
    const sl = useSetlistStore.getState().createSetlist('Tmp');
    useSetlistStore.getState().deleteSetlist(sl.id);
    expect(useSetlistStore.getState().setlists).toHaveLength(0);
  });

  it('adds and removes songs', () => {
    const sl = useSetlistStore.getState().createSetlist('S');
    useSetlistStore.getState().addSong(sl.id, 'song-1');
    expect(useSetlistStore.getState().getSetlist(sl.id)?.songIds).toEqual(['song-1']);
    useSetlistStore.getState().addSong(sl.id, 'song-1');
    expect(useSetlistStore.getState().getSetlist(sl.id)?.songIds).toEqual(['song-1']);
    useSetlistStore.getState().removeSong(sl.id, 'song-1');
    expect(useSetlistStore.getState().getSetlist(sl.id)?.songIds).toEqual([]);
  });

  it('reorders songs', () => {
    const sl = useSetlistStore.getState().createSetlist('S');
    useSetlistStore.getState().addSong(sl.id, 'a');
    useSetlistStore.getState().addSong(sl.id, 'b');
    useSetlistStore.getState().reorderSongs(sl.id, ['b', 'a']);
    expect(useSetlistStore.getState().getSetlist(sl.id)?.songIds).toEqual(['b', 'a']);
  });
});
