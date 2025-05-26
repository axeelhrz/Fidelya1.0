"use client";

import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "@/components/theme-provider";
import { ReactNode, useMemo } from "react";

// Definición de colores
const lightColors = {
  primary: {
    main: "#5D5FEF", // Morado digital
    light: "#8183F4",
    dark: "#4A4CD6",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#3D5AFE", // Azul eléctrico
    light: "#637BFE",
    dark: "#2A3EB1",
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
    main: "#5D5FEF", // Morado digital
    light: "#8183F4",
    dark: "#4A4CD6",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#3D5AFE", // Azul eléctrico
    light: "#637BFE",
    dark: "#2A3EB1",
    contrastText: "#FFFFFF",
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
        fontFamily: "var(--font-satoshi)",
        h1: {
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
        },
        h2: {
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
        },
        h3: {
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: 600,
          letterSpacing: "-0.01em",
        },
        h4: {
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: 600,
          letterSpacing: "-0.01em",
        },
        h5: {
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: 600,
        },
        h6: {
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: 600,
        },
        body1: {
          fontFamily: "var(--font-satoshi)",
          fontWeight: 400,
        },
        body2: {
          fontFamily: "var(--font-satoshi)",
          fontWeight: 400,
        },
        button: {
          fontFamily: "var(--font-satoshi)",
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
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "none",
                transform: "translateY(-2px)",
              },
            },
            contained: {
              "&:hover": {
                boxShadow: theme === "dark" 
                  ? "0 10px 20px rgba(93, 95, 239, 0.3)" 
                  : "0 10px 20px rgba(93, 95, 239, 0.2)",
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
              transition: "all 0.3s ease",
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
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: "none",
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              borderRadius: "0 0 24px 0",
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 100,
              fontWeight: 500,
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