"use client";

import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "@/components/theme-provider";
import { ReactNode, useMemo } from "react";

// Definición de colores
const lightColors = {
  primary: {
    main: "#0070F3", // Azul eléctrico
    light: "#338DFF",
    dark: "#0058C1",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#171717", // Negro puro
    light: "#444444",
    dark: "#000000",
    contrastText: "#FFFFFF",
  },
  background: {
    default: "#FFFFFF",
    paper: "#F7F7F7",
  },
  text: {
    primary: "#171717",
    secondary: "#555555",
  },
  divider: "rgba(0, 0, 0, 0.08)",
};

const darkColors = {
  primary: {
    main: "#0070F3", // Mantenemos el azul eléctrico
    light: "#338DFF",
    dark: "#0058C1",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#FFFFFF", // Blanco
    light: "#FFFFFF",
    dark: "#CCCCCC",
    contrastText: "#000000",
  },
  background: {
    default: "#0A0A0A",
    paper: "#171717",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#AAAAAA",
  },
  divider: "rgba(255, 255, 255, 0.08)",
};

export function MUITheme({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  
  const muiTheme = useMemo(() => {
    const colors = theme === "dark" ? darkColors : lightColors;
    
    return createTheme({
      palette: {
        mode: theme === "dark" ? "dark" : "light",
        ...colors,
      },
      typography: {
        fontFamily: "var(--font-inter)",
        h1: {
          fontFamily: "var(--font-plus-jakarta)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
        },
        h2: {
          fontFamily: "var(--font-plus-jakarta)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
        },
        h3: {
          fontFamily: "var(--font-plus-jakarta)",
          fontWeight: 600,
          letterSpacing: "-0.01em",
        },
        h4: {
          fontFamily: "var(--font-plus-jakarta)",
          fontWeight: 600,
          letterSpacing: "-0.01em",
        },
        h5: {
          fontFamily: "var(--font-plus-jakarta)",
          fontWeight: 600,
        },
        h6: {
          fontFamily: "var(--font-plus-jakarta)",
          fontWeight: 600,
        },
        body1: {
          fontFamily: "var(--font-inter)",
          fontWeight: 400,
        },
        body2: {
          fontFamily: "var(--font-inter)",
          fontWeight: 400,
        },
        button: {
          fontFamily: "var(--font-inter)",
          fontWeight: 500,
          textTransform: "none",
        },
      },
      shape: {
        borderRadius: 16, // Bordes XL
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 100, // Botones con bordes redondeados
              padding: "10px 24px",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            },
            contained: {
              "&:hover": {
                boxShadow: "none",
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 24, // Cards con bordes muy redondeados
              boxShadow: theme === "dark" 
                ? "0 4px 20px rgba(0, 0, 0, 0.25)" 
                : "0 4px 20px rgba(0, 0, 0, 0.05)",
            },
          },
        },
        MuiContainer: {
          styleOverrides: {
            root: {
              paddingLeft: 24,
              paddingRight: 24,
              "@media (min-width: 600px)": {
                paddingLeft: 32,
                paddingRight: 32,
              },
            },
          },
        },
      },
    });
  }, [theme]);

  return (
    <MUIThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}