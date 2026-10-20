import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeModeProvider } from './context/ThemeModeContext';
import { useLibraryStore } from './store/libraryStore';
import { NetworkStatus } from './components/NetworkStatus';
import './styles/main.css';

const root = createRoot(document.getElementById('root')!);

const removeBootSplash = () => {
  document.getElementById('boot-splash')?.remove();
};

const renderApp = () => {
  root.render(
    <StrictMode>
      <BrowserRouter basename="/chorde">
        <ThemeModeProvider>
          <NotificationProvider>
            <ErrorBoundary>
              <App />
              <NetworkStatus />
            </ErrorBoundary>
          </NotificationProvider>
        </ThemeModeProvider>
      </BrowserRouter>
    </StrictMode>
  );
};

// The boot splash in index.html covers the gap until the library has loaded.
// The app renders even when loading fails, so a storage error never leaves the
// user staring at a blank page.
useLibraryStore
  .getState()
  .loadSongs()
  .catch((error) => {
    console.error('Failed to load library:', error);
  })
  .finally(() => {
    removeBootSplash();
    renderApp();
  });
