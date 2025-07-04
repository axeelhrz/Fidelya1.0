'use client';

import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
    },
    h2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    button: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1',
      light: '#8fa5f3',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 600,
        },
      },
    },
  },
});

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}