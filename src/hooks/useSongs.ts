import { useState, useEffect } from 'react';
import type { Song } from '../types';

import { SEED_SONGS } from '../data/seedSongs';
import { ROCK_PACK } from '../data/rockPack';
import { ROCK_PACK_2 } from '../data/rockPack2';
import { JAZZ_PACK } from '../data/jazzPack';
import { MIX_PACK } from '../data/mixPack';

const STORAGE_KEY = 'chorde_songs';
const VERSION_KEY = 'chorde_version';
const CURRENT_VERSION = '2.3'; // Data schema version for migrations (separate from APP_VERSION)

export const useSongs = () => {
    const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const storedVersion = localStorage.getItem(VERSION_KEY);

        // Get all default songs from source
        const defaultSongs = [...SEED_SONGS, ...ROCK_PACK, ...ROCK_PACK_2, ...JAZZ_PACK, ...MIX_PACK];
        const defaultSongIds = new Set(defaultSongs.map(s => s.id));

        if (!stored) {
            // First time - just load default songs
            setSongs(defaultSongs);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSongs));
            localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        } else if (storedVersion !== CURRENT_VERSION) {
            // Version mismatch - smart merge
            console.log('Updating song library while preserving custom songs...');
            const storedSongs = JSON.parse(stored);

            // Separate user's custom songs (not in default packs)
            const customSongs = storedSongs.filter((s: Song) => !defaultSongIds.has(s.id));

            // Merge: all default songs + user's custom songs
            // No need to worry about duplicates since customSongs explicitly excludes defaultSongIds
            const mergedSongs = [...defaultSongs, ...customSongs];

            setSongs(mergedSongs);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedSongs));
            localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
            console.log(`Library updated: ${defaultSongs.length} default songs + ${customSongs.length} custom songs = ${mergedSongs.length} total`);
        } else {
            // Same version - use stored data
            setSongs(JSON.parse(stored));
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
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    };

    const deleteSong = (id: string) => {
        const newSongs = songs.filter(s => s.id !== id);
        setSongs(newSongs);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSongs));
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    };

    const resetLibrary = () => {
        // Directly reload from SEED_SONGS + ROCK_PACK + ROCK_PACK_2 + JAZZ
        const allSongs = [...SEED_SONGS, ...ROCK_PACK, ...ROCK_PACK_2, ...JAZZ_PACK];
        setSongs(allSongs);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allSongs));
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    };

    return { songs, saveSong, deleteSong, resetLibrary };
};
