import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container, Box, Typography, TextField, Button,
  Alert, Paper, Divider, CircularProgress,
} from '@mui/material'
import { useAuth } from '../hooks/useAuth'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } else {
      navigate('/')
    }
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        {/* 초콜릿 장식 */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h2" sx={{ fontSize: '3rem', mb: 1 }}>🍫</Typography>
          <Typography variant="h4" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
            CHOCORATE
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            초콜릿 품평 커뮤니티에 오신 것을 환영합니다
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: '2px solid',
            borderColor: 'primary.main',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', color: 'primary.main' }}>
            로그인
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
              placeholder="Test@jjmail.com"
            />
            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
              placeholder="••••••••"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                bgcolor: 'primary.main',
                color: '#f8edad',
                '&:hover': { bgcolor: 'primary.dark' },
                py: 1.5,
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#f8edad' }} /> : '로그인'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>또는</Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              아직 회원이 아니신가요?{' '}
              <Link to="/register">
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: 'secondary.main', fontWeight: 700, cursor: 'pointer' }}
                >
                  회원가입
                </Typography>
              </Link>
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 2, p: 1.5, bgcolor: '#f8edad', borderRadius: 2,
              border: '1px dashed', borderColor: 'primary.light',
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center' }}>
              테스트 계정: Test@jjmail.com / test0000
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginPage
