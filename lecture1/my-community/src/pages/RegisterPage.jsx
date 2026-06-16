import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box, Container, Paper, TextField, Button, Typography, Alert,
  CircularProgress, Chip, Divider
} from '@mui/material'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { useAuth } from '../context/AuthContext'

const PasswordRule = ({ met, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    {met
      ? <CheckCircleOutlinedIcon sx={{ fontSize: 14, color: 'success.main' }} />
      : <RadioButtonUncheckedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
    }
    <Typography variant='body2' sx={{ fontSize: '0.75rem', color: met ? 'success.main' : 'text.secondary' }}>
      {label}
    </Typography>
  </Box>
)

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register, checkUsernameAvailable } = useAuth()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fullName: '', username: '', password: '', birthDate: '', joinPurpose: ''
  })
  const [usernameStatus, setUsernameStatus] = useState(null) // null | 'ok' | 'taken' | 'checking'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
    if (name === 'username') setUsernameStatus(null)
  }

  const pwRules = {
    length: form.password.length >= 8,
    number: /\d/.test(form.password),
    upper: /[A-Z]/.test(form.password),
  }
  const pwValid = pwRules.length && pwRules.number

  const calcAge = (birthDate) => {
    if (!birthDate) return 0
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  const handleUsernameCheck = async () => {
    if (!form.username || form.username.length < 3) {
      setError('아이디는 3자 이상이어야 합니다.')
      return
    }
    setUsernameStatus('checking')
    const available = await checkUsernameAvailable(form.username)
    setUsernameStatus(available ? 'ok' : 'taken')
  }

  const handleStep1Next = () => {
    if (!form.fullName) return setError('이름을 입력해주세요.')
    if (!form.username || form.username.length < 3) return setError('아이디를 3자 이상 입력해주세요.')
    if (usernameStatus !== 'ok') return setError('아이디 중복확인을 완료해주세요.')
    if (!pwValid) return setError('비밀번호 조건을 확인해주세요.')
    if (!form.birthDate) return setError('생일을 입력해주세요.')
    const age = calcAge(form.birthDate)
    if (age < 15) return setError('15세 이상만 가입하실 수 있습니다.')
    setError('')
    setStep(2)
  }

  const handleSubmit = async () => {
    if (!form.joinPurpose) return setError('가입 목적을 입력해주세요.')
    setLoading(true)
    try {
      await register({
        username: form.username,
        password: form.password,
        fullName: form.fullName,
        birthDate: form.birthDate,
        joinPurpose: form.joinPurpose,
      })
      setDone(true)
    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Container maxWidth='xs'>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '3rem', mb: 2 }}>🌙</Typography>
            <Typography variant='h2' sx={{ mb: 2 }}>가입 신청 완료!</Typography>
            <Typography variant='body1' sx={{ color: 'text.secondary', mb: 3 }}>
              관리자 승인 후 로그인하실 수 있습니다.<br />
              조금만 기다려주세요 (미루는 중... 일지도 몰라요)
            </Typography>
            <Button
              component={Link} to='/'
              variant='outlined'
              sx={{ borderColor: '#5ab0d0', color: '#5ab0d0' }}
            >
              로그인 페이지로
            </Button>
          </Paper>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Container maxWidth='xs'>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography className='pixel-font' sx={{ fontSize: '0.8rem', color: '#5ab0d0', letterSpacing: '0.05em' }}>
              UNTIL DAWN
            </Typography>
          </Box>

          {/* 단계 표시 */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
            <Chip label='1단계: 기본 정보' size='small'
              sx={{ bgcolor: step === 1 ? 'primary.main' : 'rgba(61,127,176,0.2)', color: '#fff', fontSize: '0.7rem' }} />
            <Chip label='2단계: 가입 목적' size='small'
              sx={{ bgcolor: step === 2 ? 'primary.main' : 'rgba(61,127,176,0.2)', color: '#fff', fontSize: '0.7rem' }} />
          </Box>

          <Typography variant='h2' sx={{ mb: 3, textAlign: 'center' }}>
            회원가입
          </Typography>

          {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

          {step === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label='이름 *'
                name='fullName'
                value={form.fullName}
                onChange={handleChange}
                fullWidth
                placeholder='실명을 입력하세요'
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <TextField
                  label='아이디 *'
                  name='username'
                  value={form.username}
                  onChange={handleChange}
                  fullWidth
                  placeholder='영문/숫자, 3자 이상'
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={usernameStatus === 'taken'}
                  helperText={
                    usernameStatus === 'ok' ? '✅ 사용 가능한 아이디입니다.' :
                    usernameStatus === 'taken' ? '❌ 이미 사용 중인 아이디입니다.' : ''
                  }
                />
                <Button
                  variant='outlined'
                  onClick={handleUsernameCheck}
                  disabled={usernameStatus === 'checking'}
                  sx={{ minWidth: 80, borderColor: '#5ab0d0', color: '#5ab0d0', flexShrink: 0, height: '56px' }}
                >
                  {usernameStatus === 'checking' ? <CircularProgress size={16} /> : '중복확인'}
                </Button>
              </Box>

              <Box>
                <TextField
                  label='비밀번호 *'
                  name='password'
                  type='password'
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  placeholder='8자 이상, 숫자 포함'
                  slotProps={{ inputLabel: { shrink: true } }}
                  disabled={usernameStatus !== 'ok'}
                />
                {form.password.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <PasswordRule met={pwRules.length} label='8자 이상' />
                    <PasswordRule met={pwRules.number} label='숫자 포함' />
                    <PasswordRule met={pwRules.upper} label='대문자 포함 (선택)' />
                  </Box>
                )}
              </Box>

              <TextField
                label='생년월일 *'
                name='birthDate'
                type='date'
                value={form.birthDate}
                onChange={handleChange}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                helperText='15세 이상만 가입 가능합니다'
                sx={{
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    filter: 'invert(1) opacity(0.6)',
                    cursor: 'pointer',
                  },
                }}
              />

              <Button
                variant='contained'
                onClick={handleStep1Next}
                fullWidth
                sx={{
                  mt: 1, py: 1.5,
                  background: 'linear-gradient(135deg, #3d7fb0, #c8956a)',
                  '&:hover': { background: 'linear-gradient(135deg, #5ab0d0, #d4a878)' },
                }}
              >
                다음 단계 →
              </Button>
            </Box>
          )}

          {step === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                이 커뮤니티에 가입하려는 이유를 알려주세요.<br />
                관리자가 확인 후 승인합니다.
              </Typography>
              <TextField
                label='가입 목적 *'
                name='joinPurpose'
                value={form.joinPurpose}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                placeholder='예) 저는 오늘도 마감을 미루며 이 폼을 작성하고 있습니다...'
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant='outlined'
                  onClick={() => setStep(1)}
                  sx={{ flex: 1, borderColor: 'rgba(61,127,176,0.4)', color: 'text.secondary' }}
                >
                  ← 이전
                </Button>
                <Button
                  variant='contained'
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    flex: 2, py: 1.5,
                    background: 'linear-gradient(135deg, #3d7fb0, #c8956a)',
                    '&:hover': { background: 'linear-gradient(135deg, #5ab0d0, #d4a878)' },
                  }}
                >
                  {loading ? <CircularProgress size={22} color='inherit' /> : '가입 신청'}
                </Button>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 2, borderColor: 'rgba(61,127,176,0.15)' }} />
          <Box sx={{ textAlign: 'center' }}>
            <Button
              component={Link} to='/'
              variant='text'
              sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
            >
              이미 계정이 있으신가요? 로그인
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default RegisterPage
