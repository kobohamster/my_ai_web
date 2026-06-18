import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'

const LoginPage = () => {
  const [mode, setMode] = useState('login')

  const handleModeChange = (_event, nextMode) => {
    if (nextMode) setMode(nextMode)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <Box
      sx={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        backgroundImage:
          'linear-gradient(180deg, rgba(10,10,14,0.75) 0%, rgba(10,10,14,0.92) 100%), url(https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="xs">
        <Typography
          component={RouterLink}
          to="/"
          variant="h3"
          sx={{
            display: 'block',
            textAlign: 'center',
            fontWeight: 800,
            letterSpacing: 2,
            fontSize: '1.8rem',
            color: 'common.white',
            textDecoration: 'none',
            mb: 4,
          }}
        >
          MOV
        </Typography>
        <Paper sx={{ p: { xs: 3, sm: 5 }, bgcolor: 'rgba(22,22,29,0.95)' }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            fullWidth
            sx={{ mb: 3 }}
          >
            <ToggleButton value="login">로그인</ToggleButton>
            <ToggleButton value="signup">회원가입</ToggleButton>
          </ToggleButtonGroup>

          <Typography variant="h2" sx={{ mb: 3 }}>
            {mode === 'login' ? '로그인' : '회원가입'}
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {mode === 'signup' && <TextField label="이름" type="text" fullWidth required />}
              <TextField label="이메일" type="email" fullWidth required />
              <TextField label="비밀번호" type="password" fullWidth required />
              {mode === 'signup' && (
                <TextField label="비밀번호 확인" type="password" fullWidth required />
              )}
              <Button type="submit" variant="contained" size="large" fullWidth>
                {mode === 'login' ? '로그인하기' : '회원가입하기'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            {mode === 'login' ? (
              <>
                계정이 없으신가요?{' '}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setMode('signup')}
                  sx={{ verticalAlign: 'baseline', p: 0, minWidth: 0 }}
                >
                  회원가입
                </Button>
              </>
            ) : (
              <>
                이미 계정이 있으신가요?{' '}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setMode('login')}
                  sx={{ verticalAlign: 'baseline', p: 0, minWidth: 0 }}
                >
                  로그인
                </Button>
              </>
            )}
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginPage
