import React from 'react';
import type { SongSection } from '../types';

interface SectionNavProps {
  sections: SongSection[];
  onJumpToSection: (lineIndex: number) => void;
  /** Index of the section the reader is currently in, if known. */
  activeSection?: number | null;
}

const SECTION_COLORS: Record<SongSection['type'], string> = {
  intro: '#3B82F6', // blue
  verse: '#10B981', // green
  chorus: '#EAB308', // amber (primary)
  bridge: '#F59E0B', // orange
  solo: '#8B5CF6', // purple
  outro: '#6B7280', // gray
  instrumental: '#6B7280',
  tab: '#6B7280',
};

export const SectionNav: React.FC<SectionNavProps> = ({
  sections,
  onJumpToSection,
  activeSection = null,
}) => {
  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Song sections"
      style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.75rem',
        background: 'var(--surface-color)',
        borderBottom: '1px solid var(--border-color)',
        overflowX: 'auto',
        flexWrap: 'wrap',
      }}
    >
      {sections.map((section, idx) => {
        const isActive = activeSection === idx;
        const label = section.label || section.type;

        return (
          <button
            key={`${section.type}-${idx}`}
            type="button"
            onClick={() => onJumpToSection(idx)}
            aria-current={isActive ? 'true' : undefined}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '0.5rem',
              background: SECTION_COLORS[section.type] ?? '#6B7280',
              color: '#000',
              fontWeight: '600',
              fontSize: '0.875rem',
              border: isActive ? '2px solid #fff' : 'none',
              cursor: 'pointer',
              transition: 'transform 0.1s, opacity 0.2s',
              whiteSpace: 'nowrap',
              // The section type is also spelled out for screen readers, so the
              // colour is never the only thing carrying the meaning.
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.opacity = '1';
            }}
          >
            <span aria-hidden="true">{label}</span>
            <span className="sr-only">{` (${section.type})`}</span>
          </button>
        );
      })}
    </nav>
  );
};
