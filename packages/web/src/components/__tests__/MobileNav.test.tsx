import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';
import { MobileNav } from '../MobileNav';
import theme from '../../theme';

/** Pretend the window is a phone, so the mobile navigation is shown. */
const setNarrowViewport = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

const renderNav = (path = '/') =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[path]}>
        <MobileNav />
      </MemoryRouter>
    </ThemeProvider>
  );

describe('MobileNav', () => {
  beforeEach(() => {
    setNarrowViewport(true);
  });

  it('offers the main destinations', () => {
    renderNav();
    expect(screen.getByRole('button', { name: /songs/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /chords/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /import/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
  });

  it('marks the current screen', () => {
    renderNav('/settings');
    const settings = screen.getByRole('button', { name: /settings/i });
    expect(settings).toHaveAttribute('aria-current', 'page');
  });

  it('stays out of the way of the song viewer', () => {
    renderNav('/song/abc');
    expect(screen.queryByRole('button', { name: /chords/i })).not.toBeInTheDocument();
  });

  it('is hidden on a wide screen', () => {
    setNarrowViewport(false);
    renderNav();
    expect(screen.queryByRole('button', { name: /chords/i })).not.toBeInTheDocument();
  });
});
