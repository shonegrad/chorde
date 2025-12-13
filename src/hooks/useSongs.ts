import { useState, useEffect } from 'react';
import type { Song } from '../types';

import { SEED_SONGS } from '../data/seedSongs';
import { ROCK_PACK } from '../data/rockPack';
import { ROCK_PACK_2 } from '../data/rockPack2';

const STORAGE_KEY = 'chorde_songs';

export const useSongs = () => {
    const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setSongs(JSON.parse(stored));
        } else {
            // Initialize with seed songs AND rock pack 1 & 2
            const allSongs = [...SEED_SONGS, ...ROCK_PACK, ...ROCK_PACK_2];
            setSongs(allSongs);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allSongs));
        }
    }, []);

    const saveSong = (song: Song) => {
        const isNew = !songs.find(s => s.id === song.id);
        let newSongs;
        if (isNew) {
            newSongs = [...songs, song];
        } else {
            newSongs = songs.map(s => s.id === song.id ? song : s);
        }
        setSongs(newSongs);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSongs));
    };

    const deleteSong = (id: string) => {
        const newSongs = songs.filter(s => s.id !== id);
        setSongs(newSongs);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSongs));
    };

    const resetLibrary = () => {
        // Directly reload from SEED_SONGS + ROCK_PACK + ROCK_PACK_2
        const allSongs = [...SEED_SONGS, ...ROCK_PACK, ...ROCK_PACK_2];
        setSongs(allSongs);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allSongs));
    };

    return { songs, saveSong, deleteSong, resetLibrary };
};
