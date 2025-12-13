import React, { useState, useEffect } from 'react';
import type { Song } from '../types';
import { extractMetadata } from '../lib/chordPro';

interface SongImporterProps {
    onImport: (song: Song) => void;
    onCancel: () => void;
}

export const SongImporter: React.FC<SongImporterProps> = ({ onImport, onCancel }) => {
    const [content, setContent] = useState('');
    const [preview, setPreview] = useState<{ title: string; artist: string; key?: string; capo?: number } | null>(null);

    useEffect(() => {
        if (!content.trim()) {
            setPreview(null);
            return;
        }
        const metadata = extractMetadata(content);
        setPreview(metadata);
    }, [content]);

    const handleImport = () => {
        if (!content.trim()) return;

        const metadata = extractMetadata(content);
        const song: Song = {
            id: crypto.randomUUID(),
            title: metadata.title,
            artist: metadata.artist,
            content: content,
            key: metadata.key,
            capo: metadata.capo,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            tags: ['imported']
        };

        onImport(song);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'var(--surface-color)',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                width: '90%',
                maxWidth: '800px',
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div className="flex justify-between items-center">
                    <h2>Import Song</h2>
                    <button onClick={onCancel} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <p style={{ color: 'var(--text-secondary)' }}>
                    Paste your ChordPro formatted song below. We'll automatically extract the title, artist, key, and capo if available.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flex: 1, minHeight: 0 }}>
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="{title: Song Title}\n{artist: Artist Name}\n\n{start_of_verse}\n[C]Verse lyrics..."
                        style={{
                            flex: 1,
                            fontFamily: 'var(--font-mono)',
                            padding: '1rem',
                            resize: 'none',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--background-color)',
                            color: 'var(--text-color)'
                        }}
                    />

                    <div style={{
                        width: '300px',
                        background: 'var(--background-color)',
                        padding: '1rem',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <h3>Preview</h3>
                        {preview ? (
                            <div className="flex flex-col gap-2">
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Title</label>
                                    <div style={{ fontWeight: 'bold' }}>{preview.title}</div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Artist</label>
                                    <div>{preview.artist}</div>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Key</label>
                                        <div>{preview.key || '-'}</div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Capo</label>
                                        <div>{preview.capo || '-'}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                Start typing to see preview...
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <button onClick={onCancel}>Cancel</button>
                    <button
                        onClick={handleImport}
                        disabled={!content.trim()}
                        style={{
                            background: 'var(--primary-color)',
                            color: '#000',
                            padding: '0.5rem 2rem',
                            borderRadius: '4px',
                            opacity: !content.trim() ? 0.5 : 1
                        }}
                    >
                        Import Song
                    </button>
                </div>
            </div>
        </div>
    );
};
