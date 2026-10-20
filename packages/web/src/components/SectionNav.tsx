import React from 'react';
import type { SongSection } from '../types';

interface SectionNavProps {
  sections: SongSection[];
  onJumpToSection: (lineIndex: number) => void;
  /** Index of the section the reader is currently in, if known. */
  activeSection?: number | null;
}

interface SectionStyle {
  background: string;
  color: string;
}

/**
 * Each section type has its own colour, with a text colour that keeps the
 * label readable against it.
 */
const SECTION_STYLES: Record<SongSection['type'], SectionStyle> = {
  intro: { background: '#1D4ED8', color: '#FFFFFF' },
  verse: { background: '#059669', color: '#FFFFFF' },
  chorus: { background: '#EAB308', color: '#000000' },
  bridge: { background: '#F59E0B', color: '#000000' },
  solo: { background: '#7C3AED', color: '#FFFFFF' },
  outro: { background: '#4B5563', color: '#FFFFFF' },
  instrumental: { background: '#4B5563', color: '#FFFFFF' },
  tab: { background: '#4B5563', color: '#FFFFFF' },
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
        const style = SECTION_STYLES[section.type] ?? SECTION_STYLES.outro;

        return (
          <button
            key={`${section.type}-${idx}`}
            type="button"
            onClick={() => onJumpToSection(idx)}
            aria-current={isActive ? 'true' : undefined}
            style={{
              // A comfortable target for a thumb.
              minHeight: 44,
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              background: style.background,
              color: style.color,
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
