import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import { NotificationProvider } from './context/NotificationContext';
import { useLibraryStore } from './store/libraryStore';
import { NetworkStatus } from './components/NetworkStatus';
import theme from './theme';
import './styles/main.css';

const root = createRoot(document.getElementById('root')!);

useLibraryStore
  .getState()
  .loadSongs()
  .then(() => {
    root.render(
      <StrictMode>
        <BrowserRouter basename="/chorde">
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <NotificationProvider>
              <ErrorBoundary>
                <App />
                <NetworkStatus />
              </ErrorBoundary>
            </NotificationProvider>
          </ThemeProvider>
        </BrowserRouter>
      </StrictMode>
    );
  });
