import { useState, useEffect } from 'react';
import type { Song } from '../types';

import { SEED_SONGS } from '../data/seedSongs';

const STORAGE_KEY = 'chorde_songs';

export const useSongs = () => {
    const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setSongs(JSON.parse(stored));
        } else {
            // Initialize with seed songs
            setSongs(SEED_SONGS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_SONGS));
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
        // Directly reload from SEED_SONGS
        setSongs(SEED_SONGS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_SONGS));
    };

    return { songs, saveSong, deleteSong, resetLibrary };
};
