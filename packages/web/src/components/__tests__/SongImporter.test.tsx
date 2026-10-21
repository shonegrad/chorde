import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SongImporter } from '../SongImporter';
import { NotificationProvider } from '../../context/NotificationContext';
import theme from '../../theme';

const renderImporter = (onImport = vi.fn()) => {
  const utils = render(
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <MemoryRouter initialEntries={['/import']}>
          <Routes>
            <Route
              path="/import"
              element={<SongImporter onImport={onImport} onCancel={vi.fn()} />}
            />
            <Route path="/song/:id" element={<div>Song viewer</div>} />
          </Routes>
        </MemoryRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
  return { ...utils, onImport };
};

const paste = (content: string) => {
  const textarea = screen.getByPlaceholderText(/paste chordpro text here/i);
  fireEvent.change(textarea, { target: { value: content } });
  fireEvent.click(screen.getByRole('button', { name: /^import/i }));
};

describe('SongImporter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('imports a public-domain song without asking for confirmation', async () => {
    const { onImport } = renderImporter();

    paste('{title: Test}\n{copyright: Public domain}\n[C]Hello');

    await waitFor(() => expect(onImport).toHaveBeenCalledTimes(1));
    expect(screen.queryByText('Legal Notice')).not.toBeInTheDocument();
  });

  it('asks for confirmation before importing a song with an unknown licence', async () => {
    const { onImport } = renderImporter();

    paste('{title: Test}\n[C]Hello');

    await waitFor(() => expect(screen.getByText('Legal Notice')).toBeInTheDocument());
    expect(onImport).not.toHaveBeenCalled();
  });

  it('imports the song once the legal notice is confirmed', async () => {
    const { onImport } = renderImporter();

    paste('{title: Test}\n[C]Hello');

    await waitFor(() => expect(screen.getByText('Legal Notice')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /import anyway/i }));

    await waitFor(() => expect(onImport).toHaveBeenCalledTimes(1));
  });

  it('does not import the song when the legal notice is cancelled', async () => {
    const { onImport } = renderImporter();

    paste('{title: Test}\n[C]Hello');

    await waitFor(() => expect(screen.getByText('Legal Notice')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    await waitFor(() => expect(screen.queryByText('Legal Notice')).not.toBeInTheDocument());
    expect(onImport).not.toHaveBeenCalled();
  });

  it('marks the imported song with the imported tag', async () => {
    const { onImport } = renderImporter();

    paste('{title: Test}\n{copyright: Public domain}\n[C]Hello');

    await waitFor(() => expect(onImport).toHaveBeenCalledTimes(1));
    expect(onImport.mock.calls[0][0].tags).toContain('imported');
  });

  it('records the copyright notice on the imported song', async () => {
    const { onImport } = renderImporter();

    paste('{title: Test}\n{copyright: Public domain 2026}\n[C]Hello');

    await waitFor(() => expect(onImport).toHaveBeenCalledTimes(1));
    const song = onImport.mock.calls[0][0];
    expect(song.attribution.copyright).toBe('Public domain 2026');
    expect(song.attribution.license).toBe('public-domain');
    expect(song.rightsStatus).toBe('open');
  });

  it('imports every song in a file that holds more than one', async () => {
    const { onImport } = renderImporter();

    paste(
      '{title: First}\n{copyright: Public domain}\n[C]One\n{title: Second}\n{copyright: Public domain}\n[G]Two'
    );

    await waitFor(() => expect(onImport).toHaveBeenCalledTimes(2));
    expect(onImport.mock.calls[0][0].title).toBe('First');
    expect(onImport.mock.calls[1][0].title).toBe('Second');
  });

  it('keeps the length written in the file', async () => {
    const { onImport } = renderImporter();

    paste('{title: Test}\n{copyright: Public domain}\n{duration: 4:28}\n[C]Hello');

    await waitFor(() => expect(onImport).toHaveBeenCalledTimes(1));
    expect(onImport.mock.calls[0][0].duration).toBe('4:28');
  });

  it('leaves the length empty when the file has one we cannot read', async () => {
    const { onImport } = renderImporter();

    paste('{title: Test}\n{copyright: Public domain}\n{duration: a while}\n[C]Hello');

    await waitFor(() => expect(onImport).toHaveBeenCalledTimes(1));
    expect(onImport.mock.calls[0][0].duration).toBeUndefined();
  });

  it('hides the online search tab when online search is disabled', () => {
    vi.stubEnv('VITE_ENABLE_ONLINE_SEARCH', 'false');

    renderImporter();

    expect(screen.getByRole('tab', { name: /paste \/ drop/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /from folder/i })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /search online/i })).not.toBeInTheDocument();

    vi.unstubAllEnvs();
  });

  it('shows the online search tab when online search is enabled', () => {
    vi.stubEnv('VITE_ENABLE_ONLINE_SEARCH', 'true');

    renderImporter();

    expect(screen.getByRole('tab', { name: /search online/i })).toBeInTheDocument();

    vi.unstubAllEnvs();
  });
});
