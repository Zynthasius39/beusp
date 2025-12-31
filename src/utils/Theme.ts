import { createTheme, responsiveFontSizes } from "@mui/material";
import { grey } from "@mui/material/colors";

import { createContext, useContext } from "react";
import { ThemeContextType } from "./Interfaces";

declare module '@mui/material/styles' {
  interface Palette {
    primaryButton: Palette['primary'];
  }
  interface PaletteOptions {
    primaryButton?: PaletteOptions['primary'];
  }
}

export const darkTheme = createTheme({
  // typography: {
  //   htmlFontSize: 20,
  // },
  components: {
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          variants: [
            {
              props: { size: 'mini' },
              style: {
                minHeight: '1.75rem',
                padding: '0.25rem 0.5rem',
                fontSize: '0.875rem',
                lineHeight: '1.25',
                textTransform: 'none',
              },
            },
          ],
        },
      },
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#1de9b6",
      dark: "#00695f",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#8449b7",
      dark: "#6621a5",
      contrastText: "#000000",
    },
    background: {
      default: "#111111",
      paper: "#131719",
    },
    primaryButton: {
      main: "#80deea",
      dark: grey[800],
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#149392",
      dark: "#b3dee0",
      contrastText: "#000000",
    },
    secondary: {
      main: "#8449b7",
      dark: "#6621a5",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#f3fcff",
    },
    primaryButton: {
      main: "#149392",
      dark: grey[500],
      contrastText: "#ffffff"
    },
  },
});

export const highlightedTheme = createTheme({
  palette: {
    primary: {
      main: "#474747",
    },
    background: {
      default: "ff0000",
    },
  },
});

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
