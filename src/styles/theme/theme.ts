// lib/theme.ts
import { createTheme } from '@mui/material/styles';
import '@fontsource/plus-jakarta-sans/latin.css';
import '@fontsource/inter/latin.css';
import '@fontsource/work-sans/latin.css';

export const getAppTheme = (mode: 'light' | 'dark', themeColor: 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'pink') => {
  const paletteColor = {
    blue: '#1976d2',
    red: '#d32f2f',
    green: '#388e3c',
    purple: '#7b1fa2',
    orange: '#f57c00',
    pink: '#d81b60',
  };


return createTheme({
  palette: {
    mode,
    primary: {
      main: paletteColor[themeColor] || paletteColor.blue,
    },
  },
  typography: {
    fontFamily: `'Plus Jakarta Sans', 'Inter', sans-serif`,
    h1: {
      fontFamily: `'Plus Jakarta Sans'`,
      fontWeight: 800,
    },
    h2: {
      fontFamily: `'Plus Jakarta Sans'`,
      fontWeight: 700,
    },
    h3: {
      fontFamily: `'Plus Jakarta Sans'`,
      fontWeight: 700,
    },
    subtitle1: {
      fontFamily: `'Inter'`,
      fontWeight: 400,
    },
    body1: {
      fontFamily: `'Inter'`,
    },
    body2: {
      fontFamily: `'Inter'`,
    },
    button: {
      fontFamily: `'Work Sans'`,
      fontWeight: 600,
    },
    caption: {
      fontFamily: `'Inter'`,
    },
    overline: {
      fontFamily: `'Work Sans'`,
    }
  }
});
};
