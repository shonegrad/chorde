import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#EAB308', // Amber-500
            contrastText: '#000000',
        },
        secondary: {
            main: '#A1A1AA',
            contrastText: '#000000',
        },
        background: {
            default: '#18181B', // Zinc-900
            paper: '#27272A',   // Zinc-800
        },
        text: {
            primary: '#E4E4E7', // Zinc-200 (softer white)
            secondary: '#A1A1AA',
        },
        error: {
            main: '#EF4444',
        },
        divider: '#3F3F46', // Zinc-700
    },
    typography: {
        fontFamily: '"Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"',
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
        },
        h2: {
            fontWeight: 600,
            fontSize: '2rem',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1rem',
        },
        mono: {
            fontFamily: '"JetBrains Mono", "Fira Code", "Menlo", "Monaco", "Consolas", "Courier New", monospace',
        },
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
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: 'none',
                    },
                    '&.MuiChip-filled': {
                        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                    }
                }
            }
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
                    }
                }
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '0.75rem',
                    backgroundImage: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
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
                    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.3)',
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#27272A',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
                    borderBottom: 'none',
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#18181B',
                    backgroundImage: `linear-gradient(rgba(24, 24, 27, 0.95), rgba(24, 24, 27, 0.95)), url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
                    backgroundAttachment: 'fixed',
                    scrollbarColor: "#3F3F46 #18181B",
                    "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                        backgroundColor: "#18181B",
                        width: '8px',
                        height: '8px',
                    },
                    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                        borderRadius: 8,
                        backgroundColor: "#3F3F46",
                        minHeight: 24,
                        border: "2px solid #18181B",
                    },
                    "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
                        backgroundColor: "#52525B",
                    },
                    "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
                        backgroundColor: "#52525B",
                    },
                    "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "#52525B",
                    },
                    "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                        backgroundColor: "#18181B",
                    },
                },
            },
        },
    },
});

declare module '@mui/material/styles' {
    interface TypographyVariants {
        mono: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        mono?: React.CSSProperties;
    }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        mono: true;
    }
}

export default theme;
