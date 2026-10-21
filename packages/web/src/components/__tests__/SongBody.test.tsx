import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { SongBody } from '../SongBody';
import theme from '../../theme';
import { parseChordPro } from '../../lib/chordPro';

const renderBody = (content: string) =>
  render(
    <ThemeProvider theme={theme}>
      <SongBody lines={parseChordPro(content)} displayMode="chords" songKey="C" />
    </ThemeProvider>
  );

describe('SongBody and the directives in a song', () => {
  it('shows a comment as a comment', () => {
    renderBody('{comment: play quietly}\n[C]Words');

    const comment = screen.getByText('play quietly');
    expect(comment).toBeInTheDocument();
    expect(comment.closest('[data-annotation="comment"]')).not.toBeNull();
  });

  it('shows a directive it does not understand, and says so', () => {
    renderBody('{something_new: hello}\n[C]Words');

    const unknown = screen.getByText('{something_new: hello}');
    expect(unknown).toBeInTheDocument();
    expect(unknown.closest('[data-annotation="unknown"]')).not.toBeNull();
    expect(screen.getByText('Not understood')).toBeInTheDocument();
  });

  it('shows the chords of a block of chords on lines of their own', () => {
    renderBody('{-\nC   G   Am\n-}\n[C]Words');

    const block = document.querySelector('[data-annotation="chords"]');
    expect(block).not.toBeNull();
    expect(block?.textContent).toBe('CGAm');
  });

  it('shows a block of tablature as it was written', () => {
    renderBody('{start_of_tab}\ne|--0--|\n{end_of_tab}\n[C]Words');

    const tab = screen.getByText('e|--0--|');
    expect(tab).toBeInTheDocument();
    expect(tab.closest('[data-annotation="tab"]')).not.toBeNull();
  });

  it('shows a chord grid as the shape of the chord', () => {
    renderBody('{gc: C}\n[C]Words');

    const grid = document.querySelector('[data-annotation="grid"]');
    expect(grid).not.toBeNull();
    // The shape of the chord is drawn, so the diagram is there.
    expect(grid?.querySelector('svg')).not.toBeNull();
  });

  it('keeps the words that share a line with a directive', () => {
    renderBody('{start_of_verse} [C]Some words');

    expect(screen.getByText('Some')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show chord diagram for C/i })).toBeInTheDocument();
  });

  it('shows both chords when two are written over the same word', () => {
    renderBody('[C][G]Words');

    expect(screen.getByRole('button', { name: /show chord diagram for C/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show chord diagram for G/i })).toBeInTheDocument();
  });
});
