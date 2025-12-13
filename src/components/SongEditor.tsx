import React, { useState } from 'react';
import type { Song } from '../types';

interface SongEditorProps {
    initialSong?: Song;
    onSave: (song: Song) => void;
    onCancel: () => void;
}

export const SongEditor: React.FC<SongEditorProps> = ({ initialSong, onSave, onCancel }) => {
    const [title, setTitle] = useState(initialSong?.title || '');
    const [artist, setArtist] = useState(initialSong?.artist || '');
    const [content, setContent] = useState(initialSong?.content || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: initialSong?.id || crypto.randomUUID(),
            title,
            artist,
            content,
            createdAt: initialSong?.createdAt || Date.now(),
            updatedAt: Date.now(),
        });
    };

    return (
        <div style={{ padding: '2rem', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: '1rem' }}>{initialSong ? 'Edit Song' : 'New Song'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                <div className="flex gap-4">
                    <input
                        placeholder="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        style={{ flex: 1 }}
                    />
                    <input
                        placeholder="Artist"
                        value={artist}
                        onChange={e => setArtist(e.target.value)}
                        required
                        style={{ flex: 1 }}
                    />
                </div>
                <textarea
                    placeholder="[Am]Type your song [C]here..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    style={{
                        flex: 1,
                        fontFamily: 'var(--font-mono)',
                        resize: 'none'
                    }}
                />
                <div className="flex justify-between">
                    <button type="button" onClick={onCancel}>Cancel</button>
                    <button type="submit" style={{ background: 'var(--primary-color)', color: '#000', padding: '0.5rem 1rem', borderRadius: '4px' }}>
                        Save Song
                    </button>
                </div>
            </form>
        </div>
    );
};
