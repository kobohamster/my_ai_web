import { createTheme } from '@mui/material/styles'

// 새벽 바다 사진에서 추출한 컬러 팔레트
// 배경(바위): #080c14 / 깊은바다: #0d1e38 / 바다: #1a3f6b
// 파도: #3d7fb0 / 파도하이라이트: #5ab0d0 / 노을: #c8956a / 하늘: #8ba5bc

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3d7fb0',   // 파도 바다색
      light: '#5ab0d0',  // 파도 하이라이트 청록
      dark: '#1a3f6b',   // 깊은 바다 코발트
    },
    secondary: {
      main: '#c8956a',   // 지평선 노을 복숭아
      light: '#d4a878',  // 연한 노을 살구
      dark: '#a06848',   // 짙은 노을
    },
    background: {
      default: '#080c14',              // 바위 / 최어두운 배경
      paper: 'rgba(13, 30, 56, 0.88)', // 깊은 바다 반투명
    },
    text: {
      primary: '#dce8f0',   // 파도 거품 밝은 청백
      secondary: '#8ba5bc', // 새벽 하늘 블루그레이
    },
    error: { main: '#f87171' },
    success: { main: '#34d399' },
    warning: { main: '#c8956a' },
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
          border: '1px solid rgba(90, 176, 208, 0.15)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(61, 127, 176, 0.35)' },
            '&:hover fieldset': { borderColor: '#5ab0d0' },
            '&.Mui-focused fieldset': { borderColor: '#5ab0d0' },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(90, 176, 208, 0.12)',
          background: 'rgba(13, 30, 56, 0.78)',
        },
      },
    },
  },
})

export default theme
