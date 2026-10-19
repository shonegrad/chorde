import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';

export const NetworkStatus: React.FC = () => {
  const [online, setOnline] = useState(navigator.onLine);
  const [show, setShow] = useState(!navigator.onLine);

  useEffect(() => {
    const onOnline = () => {
      setOnline(true);
      setShow(false);
    };
    const onOffline = () => {
      setOnline(false);
      setShow(true);
    };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (online && !show) return null;

  return (
    <Snackbar open={show} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert severity="warning" icon={<WifiOffIcon />} onClose={() => setShow(false)}>
        You are offline. Some features may be unavailable.
      </Alert>
    </Snackbar>
  );
};
