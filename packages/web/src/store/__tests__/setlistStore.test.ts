import { describe, it, expect, beforeEach } from 'vitest';
import { useSetlistStore, migrateSetlists } from '../setlistStore';

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
    expect(
      useSetlistStore
        .getState()
        .getSetlist(sl.id)
        ?.songs.map((song) => song.songId)
    ).toEqual(['song-1']);
    useSetlistStore.getState().addSong(sl.id, 'song-1');
    expect(
      useSetlistStore
        .getState()
        .getSetlist(sl.id)
        ?.songs.map((song) => song.songId)
    ).toEqual(['song-1']);
    useSetlistStore.getState().removeSong(sl.id, 'song-1');
    expect(
      useSetlistStore
        .getState()
        .getSetlist(sl.id)
        ?.songs.map((song) => song.songId)
    ).toEqual([]);
  });

  it('reorders songs', () => {
    const sl = useSetlistStore.getState().createSetlist('S');
    useSetlistStore.getState().addSong(sl.id, 'a');
    useSetlistStore.getState().addSong(sl.id, 'b');
    useSetlistStore.getState().reorderSongs(sl.id, ['b', 'a']);
    expect(
      useSetlistStore
        .getState()
        .getSetlist(sl.id)
        ?.songs.map((song) => song.songId)
    ).toEqual(['b', 'a']);
  });

  it('keeps how a song is played', () => {
    const sl = useSetlistStore.getState().createSetlist('S');
    useSetlistStore.getState().addSong(sl.id, 'song-1');
    useSetlistStore
      .getState()
      .updateSong(sl.id, 'song-1', { transpose: -2, capo: 3, note: 'Slow' });

    const song = useSetlistStore.getState().getSetlist(sl.id)?.songs[0];
    expect(song?.transpose).toBe(-2);
    expect(song?.capo).toBe(3);
    expect(song?.note).toBe('Slow');
  });

  it('moves the whole set into one key', () => {
    const sl = useSetlistStore.getState().createSetlist('S');
    useSetlistStore.getState().addSong(sl.id, 'in-c');
    useSetlistStore.getState().addSong(sl.id, 'in-g');

    useSetlistStore.getState().playInKey(sl.id, 'G', { 'in-c': 'C', 'in-g': 'G' });

    const setlist = useSetlistStore.getState().getSetlist(sl.id);
    expect(setlist?.targetKey).toBe('G');
    expect(setlist?.songs[0].transpose).toBe(7); // C up to G
    expect(setlist?.songs[1].transpose).toBe(0); // already G
  });

  it('remembers the key of the set', () => {
    const sl = useSetlistStore.getState().createSetlist('S');
    useSetlistStore.getState().setTargetKey(sl.id, 'D');
    expect(useSetlistStore.getState().getSetlist(sl.id)?.targetKey).toBe('D');
  });
});

describe('migrating setlists', () => {
  it('brings a setlist saved in the old shape up to date', () => {
    const migrated = migrateSetlists([
      {
        id: 'old',
        name: 'An old setlist',
        songIds: ['song-1', 'song-2'],
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ]);

    expect(migrated).toHaveLength(1);
    expect(migrated[0].songs).toEqual([{ songId: 'song-1' }, { songId: 'song-2' }]);
    expect((migrated[0] as unknown as { songIds?: string[] }).songIds).toBeUndefined();
  });

  it('leaves a setlist in the new shape alone', () => {
    const setlist = {
      id: 'new',
      name: 'A new setlist',
      songs: [{ songId: 'song-1', transpose: 2 }],
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    };

    const migrated = migrateSetlists([setlist]);

    expect(migrated[0].songs[0].transpose).toBe(2);
  });

  it('copes with rubbish', () => {
    expect(migrateSetlists(null)).toEqual([]);
    expect(migrateSetlists('nonsense')).toEqual([]);
    expect(migrateSetlists([{ id: 'x' }])[0].songs).toEqual([]);
  });
});
