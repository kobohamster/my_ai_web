import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Paper, Typography, TextField, Button, Alert,
  CircularProgress, AppBar, Toolbar, IconButton, Tooltip
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

const PostCreatePage = () => {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [form, setForm] = useState({ title: '', content: '', imageUrl: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleRandomImage = () => {
    const seed = Date.now()
    setForm(prev => ({ ...prev, imageUrl: `https://picsum.photos/seed/${seed}/800/400` }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return setError('제목을 입력해주세요.')
    if (!form.content.trim()) return setError('내용을 입력해주세요.')
    setLoading(true)
    try {
      const { error: insertError } = await supabase.from('posts').insert({
        title: form.title.trim(),
        content: form.content.trim(),
        image_url: form.imageUrl || null,
        author_id: profile.id,
        author_username: profile.username,
      })
      if (insertError) throw insertError
      navigate('/posts')
    } catch (err) {
      setError(err.message || '게시물 등록에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 6 }}>
      <AppBar position='sticky' elevation={0} sx={{
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(61,127,176,0.15)',
      }}>
        <Toolbar>
          <Tooltip title='뒤로 가기'>
            <IconButton onClick={() => navigate('/posts')} sx={{ color: 'text.secondary', mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography
            className='pixel-font'
            sx={{ fontSize: '0.65rem', color: '#5ab0d0', flexGrow: 1, letterSpacing: '0.05em' }}
          >
            UNTIL DAWN
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth='md' sx={{ pt: 4 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant='h1' sx={{ fontSize: '1.5rem', mb: 4 }}>
            게시물 작성
          </Typography>

          {error && <Alert severity='error' sx={{ mb: 3 }}>{error}</Alert>}

          <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label='제목'
              name='title'
              value={form.title}
              onChange={handleChange}
              fullWidth
              placeholder='오늘 미룬 일의 제목을 입력하세요'
            />

            <TextField
              label='내용'
              name='content'
              value={form.content}
              onChange={handleChange}
              fullWidth
              multiline
              rows={8}
              placeholder='오늘 해야 했는데 안 한 일, 대신 뭘 했는지, 어떻게 미뤘는지 자유롭게 써주세요...'
            />

            {/* 이미지 섹션 */}
            <Box>
              <Button
                variant='outlined'
                startIcon={<ShuffleIcon />}
                onClick={handleRandomImage}
                sx={{ borderColor: 'rgba(61,127,176,0.4)', color: 'primary.light', mb: 2 }}
              >
                랜덤 이미지 추가
              </Button>
              {form.imageUrl && (
                <Box>
                  <Box
                    component='img'
                    src={form.imageUrl}
                    alt='첨부 이미지'
                    sx={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 2, display: 'block' }}
                    onError={() => setForm(prev => ({ ...prev, imageUrl: '' }))}
                  />
                  <Button
                    size='small'
                    onClick={() => setForm(prev => ({ ...prev, imageUrl: '' }))}
                    sx={{ color: 'text.secondary', mt: 1, fontSize: '0.75rem' }}
                  >
                    이미지 제거
                  </Button>
                </Box>
              )}
            </Box>

            <Button
              type='submit'
              variant='contained'
              size='large'
              disabled={loading}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #3d7fb0, #c8956a)',
                '&:hover': { background: 'linear-gradient(135deg, #5ab0d0, #d4a878)' },
              }}
            >
              {loading ? <CircularProgress size={22} color='inherit' /> : '게시물 등록'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default PostCreatePage
