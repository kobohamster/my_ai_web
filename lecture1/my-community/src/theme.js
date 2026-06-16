import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4a90d9',
      light: '#74b3e8',
      dark: '#2d6fae',
    },
    secondary: {
      main: '#7c4dff',
      light: '#a57fff',
      dark: '#5a2fd4',
    },
    background: {
      default: '#030712',
      paper: 'rgba(10, 22, 40, 0.85)',
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
    },
    error: { main: '#f87171' },
    success: { main: '#34d399' },
    warning: { main: '#fbbf24' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700 },
    h2: { fontSize: '1.5rem', fontWeight: 600 },
    h3: { fontSize: '1.25rem', fontWeight: 600 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
  },
  spacing: 8,
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(74, 144, 217, 0.15)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(74, 144, 217, 0.3)' },
            '&:hover fieldset': { borderColor: '#4a90d9' },
            '&.Mui-focused fieldset': { borderColor: '#4a90d9' },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(74, 144, 217, 0.15)',
          background: 'rgba(10, 22, 40, 0.75)',
        },
      },
    },
  },
})

export default theme
