import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Paper, Typography, TextField, Button, Alert,
  CircularProgress, AppBar, Toolbar, IconButton, Tooltip,
  ToggleButtonGroup, ToggleButton, Skeleton,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ImageIcon from '@mui/icons-material/Image'
import CloseIcon from '@mui/icons-material/Close'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

const ImageGrid = ({ images, selected, onSelect }) => {
  const [loaded, setLoaded] = useState({})

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
      gap: 1,
    }}>
      {images.map((img, i) => (
        <Box
          key={i}
          onClick={() => onSelect(img)}
          sx={{
            position: 'relative',
            paddingTop: '62.5%', // 400:250 비율
            borderRadius: 1.5,
            overflow: 'hidden',
            cursor: 'pointer',
            border: selected === img.full
              ? '2px solid #5ab0d0'
              : '2px solid transparent',
            transition: 'all 0.15s',
            '&:hover': { border: '2px solid rgba(90,176,208,0.6)', transform: 'scale(1.02)' },
          }}
        >
          {!loaded[i] && (
            <Skeleton
              variant='rectangular'
              sx={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                bgcolor: 'rgba(61,127,176,0.1)',
              }}
            />
          )}
          <Box
            component='img'
            src={img.thumb}
            alt={`이미지 ${i + 1}`}
            onLoad={() => setLoaded(prev => ({ ...prev, [i]: true }))}
            onError={() => setLoaded(prev => ({ ...prev, [i]: true }))}
            sx={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              opacity: loaded[i] ? 1 : 0,
              transition: 'opacity 0.3s',
            }}
          />
          {selected === img.full && (
            <Box sx={{
              position: 'absolute', inset: 0,
              bgcolor: 'rgba(90,176,208,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckCircleIcon sx={{ color: '#5ab0d0', fontSize: 32, filter: 'drop-shadow(0 0 6px #5ab0d0)' }} />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  )
}

const PostCreatePage = () => {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [form, setForm] = useState({ title: '', content: '', imageUrl: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 이미지 피커 상태
  const [imgMode, setImgMode] = useState(null) // null | 'random' | 'search'
  const [imgGrid, setImgGrid] = useState([])
  const [selectedImg, setSelectedImg] = useState('')
  const [searchKw, setSearchKw] = useState('')
  const [searching, setSearching] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const makeRandomGrid = () => {
    const imgs = Array.from({ length: 6 }, () => {
      const seed = Math.random().toString(36).slice(2, 10)
      return {
        thumb: `https://picsum.photos/seed/${seed}/400/250`,
        full: `https://picsum.photos/seed/${seed}/800/400`,
      }
    })
    setImgGrid(imgs)
    setSelectedImg('')
  }

  const handleModeChange = (_, newMode) => {
    if (!newMode) return
    setImgMode(newMode)
    setImgGrid([])
    setSelectedImg('')
    setSearchKw('')
    if (newMode === 'random') makeRandomGrid()
  }

  const handleSearch = async () => {
    if (!searchKw.trim()) return
    setSearching(true)
    const kw = encodeURIComponent(searchKw.trim())
    const base = Date.now()
    const imgs = Array.from({ length: 6 }, (_, i) => ({
      thumb: `https://loremflickr.com/400/250/${kw}?random=${base + i}`,
      full: `https://loremflickr.com/800/400/${kw}?random=${base + i}`,
    }))
    setImgGrid(imgs)
    setSelectedImg('')
    setTimeout(() => setSearching(false), 800)
  }

  const handleSelectImage = (img) => {
    setSelectedImg(img.full)
    setForm(prev => ({ ...prev, imageUrl: img.full }))
  }

  const handleRemoveImage = () => {
    setForm(prev => ({ ...prev, imageUrl: '' }))
    setSelectedImg('')
    setImgGrid([])
    setImgMode(null)
    setSearchKw('')
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
              slotProps={{ inputLabel: { shrink: true } }}
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
              slotProps={{ inputLabel: { shrink: true } }}
            />

            {/* 이미지 섹션 */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ImageIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant='body2' sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  이미지 선택 <Typography component='span' sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 400 }}>(선택사항)</Typography>
                </Typography>
              </Box>

              {/* 선택된 이미지 미리보기 */}
              {form.imageUrl && (
                <Box sx={{ mb: 2 }}>
                  <Box
                    component='img'
                    src={form.imageUrl}
                    alt='선택된 이미지'
                    sx={{ width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 2, display: 'block', border: '1px solid rgba(90,176,208,0.2)' }}
                    onError={() => setForm(prev => ({ ...prev, imageUrl: '' }))}
                  />
                  <Button
                    size='small'
                    startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                    onClick={handleRemoveImage}
                    sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.75rem' }}
                  >
                    이미지 제거
                  </Button>
                </Box>
              )}

              {/* 모드 선택 토글 */}
              <ToggleButtonGroup
                value={imgMode}
                exclusive
                onChange={handleModeChange}
                size='small'
                sx={{
                  mb: imgMode ? 2 : 0,
                  '& .MuiToggleButton-root': {
                    borderColor: 'rgba(61,127,176,0.3)',
                    color: 'text.secondary',
                    fontSize: '0.8rem',
                    px: 2,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(61,127,176,0.15)',
                      color: 'primary.light',
                      borderColor: 'rgba(90,176,208,0.5)',
                    },
                    '&:hover': { bgcolor: 'rgba(61,127,176,0.08)' },
                  },
                }}
              >
                <ToggleButton value='random'>
                  <ShuffleIcon sx={{ fontSize: 16, mr: 0.8 }} />
                  랜덤 선택
                </ToggleButton>
                <ToggleButton value='search'>
                  <SearchIcon sx={{ fontSize: 16, mr: 0.8 }} />
                  키워드 검색
                </ToggleButton>
              </ToggleButtonGroup>

              {/* 랜덤 모드 */}
              {imgMode === 'random' && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                      이미지를 클릭해서 선택하세요
                    </Typography>
                    <Button
                      size='small'
                      startIcon={<RefreshIcon sx={{ fontSize: 15 }} />}
                      onClick={makeRandomGrid}
                      sx={{ color: 'primary.light', fontSize: '0.75rem', minWidth: 'auto' }}
                    >
                      새로고침
                    </Button>
                  </Box>
                  <ImageGrid images={imgGrid} selected={selectedImg} onSelect={handleSelectImage} />
                </Box>
              )}

              {/* 검색 모드 */}
              {imgMode === 'search' && (
                <Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                    <TextField
                      size='small'
                      placeholder='예: nature, city, food, travel...'
                      value={searchKw}
                      onChange={(e) => setSearchKw(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      fullWidth
                      slotProps={{ inputLabel: { shrink: true } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          '& fieldset': { borderColor: 'rgba(61,127,176,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(90,176,208,0.5)' },
                          '&.Mui-focused fieldset': { borderColor: '#5ab0d0' },
                        },
                      }}
                    />
                    <Button
                      variant='outlined'
                      onClick={handleSearch}
                      disabled={searching || !searchKw.trim()}
                      sx={{
                        borderColor: '#5ab0d0', color: '#5ab0d0', flexShrink: 0, px: 2,
                        '&:hover': { borderColor: '#5ab0d0', bgcolor: 'rgba(61,127,176,0.08)' },
                      }}
                    >
                      {searching ? <CircularProgress size={18} sx={{ color: '#5ab0d0' }} /> : <SearchIcon />}
                    </Button>
                  </Box>

                  {imgGrid.length > 0 && (
                    <>
                      <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
                        이미지를 클릭해서 선택하세요
                      </Typography>
                      <ImageGrid images={imgGrid} selected={selectedImg} onSelect={handleSelectImage} />
                    </>
                  )}

                  {imgGrid.length === 0 && !searching && (
                    <Box sx={{
                      py: 4, textAlign: 'center',
                      border: '1px dashed rgba(61,127,176,0.2)',
                      borderRadius: 2,
                    }}>
                      <Typography variant='body2' sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                        검색어를 입력하고 검색 버튼을 눌러보세요
                      </Typography>
                    </Box>
                  )}
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
