import React from 'react';
import type { SongSection } from '../types';

interface SectionNavProps {
    sections: SongSection[];
    onJumpToSection: (lineIndex: number) => void;
}

export const SectionNav: React.FC<SectionNavProps> = ({ sections, onJumpToSection }) => {
    if (sections.length === 0) return null;

    const getSectionColor = (type: SongSection['type']) => {
        switch (type) {
            case 'intro': return '#3B82F6'; // blue
            case 'verse': return '#10B981'; // green
            case 'chorus': return '#EAB308'; // amber (primary)
            case 'bridge': return '#F59E0B'; // orange
            case 'solo': return '#8B5CF6'; // purple
            case 'outro': return '#6B7280'; // gray
            default: return '#6B7280';
        }
    };

    return (
        <div style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.75rem',
            background: 'var(--surface-color)',
            borderBottom: '1px solid var(--border-color)',
            overflowX: 'auto',
            flexWrap: 'wrap'
        }}>
            {sections.map((section, idx) => (
                <button
                    key={`${section.type}-${idx}`}
                    onClick={() => onJumpToSection(idx)}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        background: getSectionColor(section.type),
                        color: '#000',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.1s, opacity 0.2s',
                        whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.opacity = '1';
                    }}
                >
                    {section.label || section.type}
                </button>
            ))}
        </div>
    );
};
