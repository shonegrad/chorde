import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import theme from './theme';
import './styles/main.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/chorde">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppProvider>
          <NotificationProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </NotificationProvider>
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
