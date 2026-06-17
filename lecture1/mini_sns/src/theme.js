import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#422b21',
      light: '#6b4c3b',
      dark: '#2a1a14',
      contrastText: '#f8edad',
    },
    secondary: {
      main: '#ca1c1d',
      light: '#f04e50',
      dark: '#920000',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8edad',
      paper: '#fffdf0',
    },
    text: {
      primary: '#422b21',
      secondary: '#7a5c4e',
    },
    success: {
      main: '#a8b897',
    },
  },
  typography: {
    fontFamily: '"Pretendard Variable", "Noto Sans KR", sans-serif',
    h1: {
      fontFamily: '"Zen Serif", "Georgia", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Zen Serif", "Georgia", serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Zen Serif", "Georgia", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Zen Serif", "Georgia", serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Zen Serif", "Georgia", serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Zen Serif", "Georgia", serif',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          fontFamily: '"Pretendard Variable", "Noto Sans KR", sans-serif',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(66, 43, 33, 0.12)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

export default theme
