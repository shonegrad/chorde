import React, { useEffect } from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';

const ACTIONS = [
  { label: 'Songs', icon: <HomeIcon />, path: '/' },
  { label: 'Chords', icon: <LibraryMusicIcon />, path: '/chords' },
  { label: 'Import', icon: <DownloadIcon />, path: '/import' },
  { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

/**
 * A bottom navigation bar for small screens.
 *
 * The drawer only appears on the library screen, so without this every other
 * screen was a dead end on a phone.
 */
export const MobileNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  const path = location.pathname;
  // The performance views take the whole screen.
  const isPerformance = path.startsWith('/song/') || path.endsWith('/play');
  const visible = isMobile && !isPerformance;

  // Let the page add room for the bar so it does not cover the content.
  useEffect(() => {
    if (visible) {
      document.body.dataset.bottomNav = 'true';
    } else {
      delete document.body.dataset.bottomNav;
    }
    return () => {
      delete document.body.dataset.bottomNav;
    };
  }, [visible]);

  if (!visible) return null;

  const current = ACTIONS.findIndex((action) => {
    if (action.path === '/') return path === '/';
    return path.startsWith(action.path);
  });

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        borderTop: 1,
        borderColor: 'divider',
        borderRadius: 0,
      }}
    >
      <BottomNavigation
        value={current === -1 ? false : current}
        onChange={(_event, value: number) => {
          const action = ACTIONS[value];
          if (action) navigate(action.path);
        }}
        showLabels
        aria-label="Main navigation"
      >
        {ACTIONS.map((action, index) => (
          <BottomNavigationAction
            key={action.path}
            label={action.label}
            icon={action.icon}
            aria-current={index === current ? 'page' : undefined}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};
