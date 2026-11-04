"use client";

import { createTheme } from "@mui/material/styles";
import { ptBR } from "@mui/material/locale";

const theme = createTheme(
  {
    cssVariables: true,
    palette: {
      mode: "light",
      primary: { main: "#1565c0" },
      secondary: { main: "#00897b" },
      error: { main: "#c62828" },
      background: {
        default: "#f5f7fa",
        paper: "#ffffff",
      },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 600 },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: "1px solid",
            borderColor: "divider",
          },
        },
      },
    },
  },
  ptBR,
);

export default theme;
