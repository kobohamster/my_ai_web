import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box, Container, Paper, TextField, Button, Typography, Alert, CircularProgress
} from '@mui/material'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const { signIn, user, profile } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 이미 로그인된 경우 리다이렉트
  if (user && profile?.status === 'approved') {
    navigate(profile.is_admin ? '/admin' : '/posts', { replace: true })
    return null
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('아이디와 비밀번호를 입력해주세요.')
      return
    }
    setLoading(true)
    try {
      const data = await signIn(form.username, form.password)
      const prof = data?.user ? null : null
      navigate('/posts')
    } catch (err) {
      if (err.message === 'PENDING') {
        setError('관리자 승인 대기 중입니다. 잠시만 기다려주세요.')
      } else if (err.message === 'REJECTED') {
        setError('가입이 거부되었습니다. 관리자에게 문의해주세요.')
      } else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Container maxWidth='xs'>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
          {/* 18비트 스타일 로고 */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              className='pixel-font'
              sx={{
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                color: '#5ab0d0',
                textShadow: '0 0 20px rgba(90,176,208,0.9), 0 0 40px rgba(90,176,208,0.4)',
                letterSpacing: '0.05em',
                lineHeight: 1.8,
              }}
            >
              UNTIL
            </Typography>
            <Typography
              className='pixel-font'
              sx={{
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                color: '#c8956a',
                textShadow: '0 0 20px rgba(200,149,106,0.9), 0 0 40px rgba(200,149,106,0.4)',
                letterSpacing: '0.05em',
                lineHeight: 1.8,
              }}
            >
              DAWN
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary', mt: 1, fontSize: '0.75rem' }}>
              영원히 일을 미루는 모임
            </Typography>
          </Box>

          <Typography variant='h2' sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
            로그인
          </Typography>

          {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

          <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label='아이디'
              name='username'
              value={form.username}
              onChange={handleChange}
              placeholder='아이디를 입력하세요'
              fullWidth
              autoComplete='username'
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label='비밀번호'
              name='password'
              type='password'
              value={form.password}
              onChange={handleChange}
              placeholder='비밀번호를 입력하세요'
              fullWidth
              autoComplete='current-password'
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Button
              type='submit'
              variant='contained'
              fullWidth
              disabled={loading}
              sx={{
                mt: 1, py: 1.5,
                background: 'linear-gradient(135deg, #3d7fb0, #c8956a)',
                '&:hover': { background: 'linear-gradient(135deg, #5ab0d0, #d4a878)' },
              }}
            >
              {loading ? <CircularProgress size={22} color='inherit' /> : '로그인'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              component={Link}
              to='/register'
              variant='text'
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              회원가입하러 가기 →
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginPage
