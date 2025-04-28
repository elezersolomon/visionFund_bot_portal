import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    custom: {
      black: string;
      white: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      black: string;
      white: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#092F87",
    },
    secondary: {
      main: "#E85E2F",
    },
    custom: {
      black: "#312D2A",
      white: "#F9F7F7",
    },
  },
});

export default theme;
