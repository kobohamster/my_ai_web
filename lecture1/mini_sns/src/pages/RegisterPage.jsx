import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container, Box, Typography, TextField, Button,
  Alert, Paper, CircularProgress,
} from '@mui/material'
import { useAuth } from '../hooks/useAuth'

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
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
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h2" sx={{ fontSize: '3rem', mb: 1 }}>🍫</Typography>
          <Typography variant="h4" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
            CHOCORATE
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            초콜릿 애호가 커뮤니티에 합류하세요
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
            회원가입
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              가입이 완료되었습니다! 이메일을 확인해주세요. 잠시 후 로그인 페이지로 이동합니다.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="이메일" type="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required sx={{ mb: 2 }}
            />
            <TextField
              fullWidth label="비밀번호 (6자 이상)" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required sx={{ mb: 2 }}
            />
            <TextField
              fullWidth label="비밀번호 확인" type="password"
              value={confirm} onChange={(e) => setConfirm(e.target.value)}
              required sx={{ mb: 3 }}
            />
            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={loading || success}
              sx={{
                bgcolor: 'primary.main', color: '#f8edad',
                '&:hover': { bgcolor: 'primary.dark' }, py: 1.5,
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#f8edad' }} /> : '가입하기'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              이미 계정이 있으신가요?{' '}
              <Link to="/login">
                <Typography
                  component="span" variant="body2"
                  sx={{ color: 'secondary.main', fontWeight: 700, cursor: 'pointer' }}
                >
                  로그인
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default RegisterPage
