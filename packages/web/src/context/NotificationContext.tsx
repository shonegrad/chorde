/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, type AlertColor } from '@mui/material';

interface Notification {
  message: string;
  severity: AlertColor;
  id: number;
}

interface NotificationContextType {
  notify: (message: string, severity?: AlertColor) => void;
  notifyError: (message: string) => void;
  notifySuccess: (message: string) => void;
  notifyWarning: (message: string) => void;
  notifyInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

let nextId = 0;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((message: string, severity: AlertColor = 'info') => {
    const id = nextId++;
    setNotifications((prev) => [...prev, { message, severity, id }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const notifyError = useCallback((message: string) => notify(message, 'error'), [notify]);
  const notifySuccess = useCallback((message: string) => notify(message, 'success'), [notify]);
  const notifyWarning = useCallback((message: string) => notify(message, 'warning'), [notify]);
  const notifyInfo = useCallback((message: string) => notify(message, 'info'), [notify]);

  const handleClose = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const value: NotificationContextType = {
    notify,
    notifyError,
    notifySuccess,
    notifyWarning,
    notifyInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.map((n) => (
        <Snackbar
          key={n.id}
          open
          autoHideDuration={5000}
          onClose={() => handleClose(n.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ bottom: { bottom: 16 + notifications.indexOf(n) * 60 } }}
        >
          <Alert
            onClose={() => handleClose(n.id)}
            severity={n.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {n.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
