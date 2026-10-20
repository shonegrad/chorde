import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { TagEditor } from '../TagEditor';
import theme from '../../theme';

const renderEditor = (tags: string[] = [], onChange = vi.fn()) => {
  const utils = render(
    <ThemeProvider theme={theme}>
      <TagEditor tags={tags} onChange={onChange} />
    </ThemeProvider>
  );
  return { ...utils, onChange };
};

describe('TagEditor', () => {
  it('shows the existing tags', () => {
    renderEditor(['gospel', 'worship']);
    expect(screen.getByText('gospel')).toBeInTheDocument();
    expect(screen.getByText('worship')).toBeInTheDocument();
  });

  it('says so when there are no tags', () => {
    renderEditor([]);
    expect(screen.getByText('No tags yet.')).toBeInTheDocument();
  });

  it('adds a tag when Enter is pressed', () => {
    const { onChange } = renderEditor(['gospel']);

    const input = screen.getByLabelText('Add a tag');
    fireEvent.change(input, { target: { value: 'Worship' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith(['gospel', 'worship']);
  });

  it('normalises tags to lower case with hyphens', () => {
    const { onChange } = renderEditor([]);

    const input = screen.getByLabelText('Add a tag');
    fireEvent.change(input, { target: { value: 'Rhythm Changes' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith(['rhythm-changes']);
  });

  it('does not add the same tag twice', () => {
    const { onChange } = renderEditor(['gospel']);

    const input = screen.getByLabelText('Add a tag');
    fireEvent.change(input, { target: { value: 'Gospel' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('removes a tag', () => {
    const { onChange } = renderEditor(['gospel', 'worship']);

    fireEvent.click(screen.getByRole('button', { name: 'Remove tag gospel' }));

    expect(onChange).toHaveBeenCalledWith(['worship']);
  });
});
