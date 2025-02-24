import { createContext, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

export const tokens = () => ({
  grey: {
    100: "#ffffff",
    200: "#f5f5f5",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
  primary: {
    100: "#ffffff",
    200: "#f9f9f9",
    300: "#f5f5f5",
    400: "#f0f0f0",
    500: "#e0e0e0",
    600: "#d3d3d3",
    700: "#c0c0c0",
    800: "#a9a9a9",
    900: "#808080",
},
  greenAccent: {
    100: "#dbf5ee",
    200: "#b7ebde",
    300: "#94e2cd",
    400: "#70d8bd",
    500: "#4cceac",
    600: "#3da58a",
    700: "#2e7c67",
    800: "#1e5245",
    900: "#0f2922",
  },
  redAccent: {
    100: "#ffebee",
    200: "#ffcdd2",
    300: "#ef9a9a",
    400: "#ef5350",
    500: "#f44336",
    600: "#e53935",
    700: "#d32f2f",
    800: "#c62828",
    900: "#b71c1c",
  },

  blueAccent: {
    100: "#151632",
    200: "#2a2d64",
    300: "#3e4396",
    400: "#535ac8",
    500: "#6870fa",
    600: "#868dfb",
    700: "#a4a9fc",
    800: "#c3c6fd",
    900: "#e1e2fe",
  },
});

export const themeSettings = () => {
  const colors = tokens();
  return {
    palette: {
      mode: "light",
      primary: {
        main: colors.primary[500],
      },
      secondary: {
        main: colors.redAccent[500],
        main: colors.greenAccent[500],
      },
      neutral: {
        dark: colors.grey[700],
        main: colors.grey[500],
        light: colors.grey[100],
      },
      background: {
        default: "#ffffff",
      },
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 13,
        marginBottom: 6
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
      h7: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 10,
      },
    },
  };
};

export const ColorModeContext = createContext({});

export const useMode = () => {
  const theme = useMemo(() => createTheme(themeSettings()), []);
  return [theme, {}];
};