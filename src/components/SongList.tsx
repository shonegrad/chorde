import React, { useState } from 'react';
import type { Song } from '../types';
import { SongImporter } from './SongImporter';

interface SongListProps {
    songs: Song[];
    onSelect: (song: Song) => void;
    onCreate: () => void;
    onImport: (song: Song) => void;
    onReset: () => void;
}

export const SongList: React.FC<SongListProps> = ({ songs, onSelect, onCreate, onImport, onReset }) => {
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [showImporter, setShowImporter] = useState(false);

    // Extract all unique tags
    const allTags = Array.from(new Set(songs.flatMap(s => s.tags || []))).sort();

    const filtered = songs.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
            s.artist.toLowerCase().includes(search.toLowerCase());
        const matchesTag = !selectedTag || s.tags?.includes(selectedTag);
        return matchesSearch && matchesTag;
    });

    const handleReset = () => {
        onReset();
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <h1>My Songs ({filtered.length})</h1>
                <div className="flex gap-2">
                    <button
                        onClick={handleReset}
                        title="Reset to default 40 songs"
                        style={{ border: '1px solid var(--danger-color)', color: 'var(--danger-color)', padding: '0.5rem 1rem', borderRadius: '4px' }}
                    >
                        ↻ Reset Library
                    </button>
                    <button
                        onClick={() => setShowImporter(true)}
                        style={{ border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '0.5rem 1rem', borderRadius: '4px' }}
                    >
                        + Import
                    </button>
                    <button
                        onClick={onCreate}
                        style={{ background: 'var(--primary-color)', color: '#000', padding: '0.5rem 1rem', borderRadius: '4px' }}
                    >
                        + New Song
                    </button>
                </div>
            </div>

            {showImporter && (
                <SongImporter
                    onImport={(song) => {
                        onImport(song);
                        setShowImporter(false);
                    }}
                    onCancel={() => setShowImporter(false)}
                />
            )}

            <input
                placeholder="Search songs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', marginBottom: '1rem', padding: '1rem' }}
            />

            {/* Tag filter */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <button
                    onClick={() => setSelectedTag(null)}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '1rem',
                        background: !selectedTag ? 'var(--primary-color)' : 'var(--surface-hover)',
                        color: !selectedTag ? '#000' : 'var(--text-secondary)',
                        fontWeight: !selectedTag ? 'bold' : 'normal',
                        fontSize: '0.875rem'
                    }}
                >
                    All
                </button>
                {allTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '1rem',
                            background: selectedTag === tag ? 'var(--primary-color)' : 'var(--surface-hover)',
                            color: selectedTag === tag ? '#000' : 'var(--text-secondary)',
                            fontWeight: selectedTag === tag ? 'bold' : 'normal',
                            fontSize: '0.875rem'
                        }}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            <div className="song-grid" style={{ display: 'grid', gap: '1rem' }}>
                {filtered.map(song => (
                    <div
                        key={song.id}
                        onClick={() => onSelect(song)}
                        style={{
                            background: 'var(--surface-color)',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            transition: 'transform 0.1s',
                            border: '1px solid transparent'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.borderColor = 'var(--primary-color)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'transparent';
                        }}
                    >
                        <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginBottom: '0.25rem' }}>{song.title}</div>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{song.artist}</div>

                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            {song.key && <span>Key: {song.key}</span>}
                            {song.capo && song.capo > 0 && <span>Capo: {song.capo}</span>}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {song.tags?.map(tag => (
                                <span
                                    key={tag}
                                    style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '0.25rem',
                                        background: 'var(--surface-hover)',
                                        fontSize: '0.75rem',
                                        color: 'var(--text-secondary)'
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                        No songs found. Try adjusting your search or filters.
                    </div>
                )}
            </div>
        </div>
    );
};
