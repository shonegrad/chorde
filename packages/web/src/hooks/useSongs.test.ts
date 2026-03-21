import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSongs } from './useSongs';

// Mock the data imports
vi.mock('../data/seedSongs', () => ({
    SEED_SONGS: [
        {
            id: 'seed-1',
            title: 'Seed Song',
            artist: 'Seed Artist',
            content: '[C]Test',
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
    ],
}));

vi.mock('../data/rockPack', () => ({ ROCK_PACK: [] }));
vi.mock('../data/rockPack2', () => ({ ROCK_PACK_2: [] }));
vi.mock('../data/jazzPack', () => ({ JAZZ_PACK: Array.from({ length: 50 }).map((_, i) => ({
    id: `jazz-mock-${i}`,
    title: `Jazz Mock ${i}`,
    artist: 'Mock',
    content: '[C]Mock',
    createdAt: Date.now(),
    updatedAt: Date.now(),
})) }));
vi.mock('../data/mixPack', () => ({ MIX_PACK: [] }));

describe('useSongs', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset localStorage mock for each test
        (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
    });

    it('initializes with default songs when localStorage is empty', () => {
        const { result } = renderHook(() => useSongs());

        expect(result.current.songs.length).toBeGreaterThanOrEqual(1);
        expect(result.current.songs[0].title).toBe('Seed Song');
    });

    it('loads songs from localStorage when available', () => {
        const storedSongs = [
            {
                id: 'stored-1',
                title: 'Stored Song',
                artist: 'Artist',
                content: '[G]Hello',
                createdAt: Date.now(),
                updatedAt: Date.now(),
            },
        ];

        (localStorage.getItem as ReturnType<typeof vi.fn>)
            .mockImplementation((key: string) => {
                if (key === 'chorde_songs') return JSON.stringify(storedSongs);
                if (key === 'chorde_version') return '2.4';
                return null;
            });

        const { result } = renderHook(() => useSongs());

        expect(result.current.songs).toHaveLength(1);
        expect(result.current.songs[0].title).toBe('Stored Song');
    });

    it('saves a new song', () => {
        const { result } = renderHook(() => useSongs());

        const newSong = {
            id: 'new-1',
            title: 'New Song',
            artist: 'New Artist',
            content: '[Am]New content',
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        act(() => {
            result.current.saveSong(newSong);
        });

        expect(result.current.songs).toContainEqual(newSong);
        expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('updates an existing song', () => {
        const { result } = renderHook(() => useSongs());

        // First save a new song
        const originalSong = {
            id: 'update-test',
            title: 'Original Title',
            artist: 'Artist',
            content: '[C]Original',
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        act(() => {
            result.current.saveSong(originalSong);
        });

        // Then update it
        const updatedSong = { ...originalSong, title: 'Updated Title' };

        act(() => {
            result.current.saveSong(updatedSong);
        });

        const foundSong = result.current.songs.find(s => s.id === 'update-test');
        expect(foundSong?.title).toBe('Updated Title');
    });

    it('deletes a song', () => {
        const { result } = renderHook(() => useSongs());

        const songToDelete = {
            id: 'delete-me',
            title: 'Delete Me',
            artist: 'Artist',
            content: '[D]Delete',
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        act(() => {
            result.current.saveSong(songToDelete);
        });

        expect(result.current.songs.find(s => s.id === 'delete-me')).toBeDefined();

        act(() => {
            result.current.deleteSong('delete-me');
        });

        expect(result.current.songs.find(s => s.id === 'delete-me')).toBeUndefined();
    });
});
