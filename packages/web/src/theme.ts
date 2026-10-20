import { createTheme, type Theme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

const fontSans =
  '"Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", sans-serif';
const fontMono =
  '"JetBrains Mono", "Fira Code", "Menlo", "Monaco", "Consolas", "Courier New", monospace';

export interface AppCustomTokens {
  navHeight: string;
  surfaceHover: string;
  surfaceBorder: string;
  spacingSm: string;
  spacingMd: string;
  spacingLg: string;
  spacingXl: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  fontMono: string;
  shadowMd: string;
  shadowLg: string;
}

interface ModeColors {
  primary: string;
  primaryContrast: string;
  background: string;
  paper: string;
  textPrimary: string;
  textSecondary: string;
  divider: string;
  surfaceHover: string;
  surfaceBorder: string;
  chipOutlined: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;
  shadow: string;
  noise: string;
}

const DARK: ModeColors = {
  primary: '#EAB308', // Amber-500
  primaryContrast: '#000000',
  background: '#18181B', // Zinc-900
  paper: '#27272A', // Zinc-800
  textPrimary: '#E4E4E7', // Zinc-200
  textSecondary: '#A1A1AA', // Zinc-400
  divider: '#3F3F46', // Zinc-700
  surfaceHover: '#3F3F46',
  surfaceBorder: '#3F3F46',
  chipOutlined: 'rgba(255, 255, 255, 0.05)',
  scrollbarThumb: '#3F3F46',
  scrollbarThumbHover: '#52525B',
  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
  noise: 'rgba(24, 24, 27, 0.95)',
};

const LIGHT: ModeColors = {
  // A deeper amber keeps the chords readable on a light background.
  primary: '#B45309', // Amber-700
  primaryContrast: '#FFFFFF',
  background: '#FAFAF9', // Stone-50
  paper: '#FFFFFF',
  textPrimary: '#1C1917', // Stone-900
  textSecondary: '#57534E', // Stone-600
  divider: '#E7E5E4', // Stone-200
  surfaceHover: '#F5F5F4', // Stone-100
  surfaceBorder: '#E7E5E4',
  chipOutlined: 'rgba(0, 0, 0, 0.04)',
  scrollbarThumb: '#D6D3D1',
  scrollbarThumbHover: '#A8A29E',
  shadow: '0 4px 6px -1px rgba(28, 25, 23, 0.08), 0 2px 4px -1px rgba(28, 25, 23, 0.06)',
  noise: 'rgba(250, 250, 249, 0.95)',
};

const NOISE_TEXTURE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`;

export const createAppTheme = (mode: ThemeMode): Theme => {
  const colors = mode === 'light' ? LIGHT : DARK;

  const customTokens: AppCustomTokens = {
    // Layout
    navHeight: '60px',

    // Surfaces (extends palette.background)
    surfaceHover: colors.surfaceHover,
    surfaceBorder: colors.surfaceBorder,

    // Spacing
    spacingSm: '0.5rem',
    spacingMd: '1rem',
    spacingLg: '1.5rem',
    spacingXl: '2rem',

    // Border radius
    radiusSm: '0.25rem',
    radiusMd: '0.5rem',
    radiusLg: '0.75rem',

    // Font families
    fontMono,

    // Shadows
    shadowMd: colors.shadow,
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -2px rgba(0, 0, 0, 0.25)',
  };

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary,
        contrastText: colors.primaryContrast,
      },
      secondary: {
        main: colors.textSecondary,
        contrastText: mode === 'light' ? '#FFFFFF' : '#000000',
      },
      background: {
        default: colors.background,
        paper: colors.paper,
      },
      text: {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
      },
      error: {
        main: '#EF4444',
      },
      divider: colors.divider,
    },
    typography: {
      fontFamily: fontSans,
      h1: { fontWeight: 700, fontSize: '2.5rem' },
      h2: { fontWeight: 600, fontSize: '2rem' },
      h3: { fontWeight: 600, fontSize: '1.75rem' },
      h4: { fontWeight: 600, fontSize: '1.5rem' },
      h5: { fontWeight: 600, fontSize: '1.25rem' },
      h6: { fontWeight: 600, fontSize: '1rem' },
      mono: { fontFamily: fontMono },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiChip: {
        styleOverrides: {
          root: {
            border: 'none',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            '&.MuiChip-outlined': {
              backgroundColor: colors.chipOutlined,
              border: 'none',
            },
            '&.MuiChip-filled': {
              boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '0.5rem',
            boxShadow: 'none',
          },
          contained: {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            '&:hover': {
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '0.75rem',
            backgroundImage: 'none',
            boxShadow: colors.shadow,
            border: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          outlined: {
            border: 'none',
            boxShadow: colors.shadow,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: colors.paper,
            boxShadow: colors.shadow,
            borderBottom: 'none',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          // Keep every icon button at a comfortable size for a thumb.
          root: {
            minWidth: 44,
            minHeight: 44,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: colors.background,
            backgroundImage: `linear-gradient(${colors.noise}, ${colors.noise}), ${NOISE_TEXTURE}`,
            backgroundAttachment: 'fixed',
            scrollbarColor: `${colors.scrollbarThumb} ${colors.background}`,
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              backgroundColor: colors.background,
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: colors.scrollbarThumb,
              minHeight: 24,
              border: `2px solid ${colors.background}`,
            },
            '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
              backgroundColor: colors.scrollbarThumbHover,
            },
            '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
              backgroundColor: colors.scrollbarThumbHover,
            },
            '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
              backgroundColor: colors.scrollbarThumbHover,
            },
            '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
              backgroundColor: colors.background,
            },
          },
        },
      },
    },
    customTokens,
  });
};

declare module '@mui/material/styles' {
  interface ThemeOptions {
    customTokens?: AppCustomTokens;
  }

  interface TypographyVariants {
    mono: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    mono?: React.CSSProperties;
  }

  interface Theme {
    customTokens: AppCustomTokens;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    mono: true;
  }
}

export const darkTheme = createAppTheme('dark');
export const lightTheme = createAppTheme('light');

export default darkTheme;
