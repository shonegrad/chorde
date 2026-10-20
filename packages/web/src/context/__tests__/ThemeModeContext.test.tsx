import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeModeProvider, useThemeMode } from '../ThemeModeContext';

const ThemeProbe: React.FC = () => {
  const { mode, preference, toggle } = useThemeMode();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="preference">{preference}</span>
      <button onClick={toggle}>toggle</button>
    </div>
  );
};

const renderProvider = () =>
  render(
    <ThemeModeProvider>
      <ThemeProbe />
    </ThemeModeProvider>
  );

describe('ThemeModeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('follows the system by default', () => {
    renderProvider();
    expect(screen.getByTestId('preference')).toHaveTextContent('system');
  });

  it('remembers a chosen mode', () => {
    localStorage.setItem('chorde_theme', 'light');
    renderProvider();
    expect(screen.getByTestId('preference')).toHaveTextContent('light');
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
  });

  it('toggles between light and dark', () => {
    localStorage.setItem('chorde_theme', 'dark');
    renderProvider();

    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));

    expect(screen.getByTestId('mode')).toHaveTextContent('light');
    expect(localStorage.getItem('chorde_theme')).toBe('light');
  });

  it('sets the theme on the document so the stylesheets follow', () => {
    localStorage.setItem('chorde_theme', 'light');
    renderProvider();
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
