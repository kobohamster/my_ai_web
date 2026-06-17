import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container, Box, Typography, TextField, Button, Paper,
  Slider, Grid, Chip, Alert, CircularProgress, Divider,
} from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const TASTE_CONFIG = [
  { key: 'sweetness', label: '🍬 단맛', color: '#ca1c1d', description: '달콤함의 강도' },
  { key: 'saltiness', label: '🧂 짠맛', color: '#6b9ab8', description: '소금기의 정도' },
  { key: 'sourness', label: '🍋 신맛', color: '#a8b897', description: '산미의 강도' },
  { key: 'bitterness', label: '☕ 쓴맛', color: '#422b21', description: '쓴맛의 깊이' },
  { key: 'umami', label: '✨ 감칠맛', color: '#9c7c38', description: '복합적인 풍미' },
]

const CHOCOLATE_IMAGES = [
  'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522252234503-e356532cafd5?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop',
]

const PostCreatePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    brand: '',
    description: '',
    image_url: '',
  })
  const [tastings, setTastings] = useState({
    sweetness: 50,
    saltiness: 20,
    sourness: 10,
    bitterness: 40,
    umami: 30,
  })
  const [hashtagInput, setHashtagInput] = useState('')
  const [hashtags, setHashtags] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ color: 'primary.main', mb: 2 }}>🔒</Typography>
        <Typography variant="h5" sx={{ color: 'primary.main', mb: 1 }}>로그인이 필요합니다</Typography>
        <Button variant="contained" onClick={() => navigate('/login')} sx={{ bgcolor: 'primary.main', color: '#f8edad', mt: 2 }}>
          로그인하기
        </Button>
      </Container>
    )
  }

  const handleAddHashtag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && hashtagInput.trim()) {
      e.preventDefault()
      const tag = hashtagInput.trim().replace(/^#/, '')
      if (tag && !hashtags.includes(tag) && hashtags.length < 8) {
        setHashtags(prev => [...prev, tag])
      }
      setHashtagInput('')
    }
  }

  const removeHashtag = (tag) => setHashtags(prev => prev.filter(t => t !== tag))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('초콜릿 이름을 입력해주세요.'); return }
    setError('')
    setLoading(true)
    const { data, error: err } = await supabase.from('choco_posts').insert({
      user_id: user.id,
      title: form.title.trim(),
      brand: form.brand.trim() || null,
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      hashtags,
      ...tastings,
    }).select().single()
    setLoading(false)
    if (err) { setError('게시물 작성에 실패했습니다.'); return }
    navigate(`/posts/${data.id}`)
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)', pb: 8 }}>
      <Box sx={{ bgcolor: 'primary.main', py: 4, textAlign: 'center', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'repeating-linear-gradient(90deg, #ca1c1d 0px, #ca1c1d 20px, #422b21 20px, #422b21 40px)' }} />
        <Typography variant="h3" sx={{ color: '#f8edad' }}>초콜릿 품평 작성</Typography>
        <Typography variant="body2" sx={{ color: 'rgba(248,237,173,0.7)', mt: 0.5, fontFamily: '"Pretendard Variable", "Noto Sans KR", sans-serif' }}>
          당신만의 초콜릿 이야기를 들려주세요
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, border: '1px solid rgba(66,43,33,0.1)' }}>
          <Box component="form" onSubmit={handleSubmit}>
            {/* 기본 정보 */}
            <Typography variant="h5" sx={{ color: 'primary.main', mb: 3 }}>📝 기본 정보</Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  fullWidth required
                  label="초콜릿 이름 *"
                  placeholder="예: 가나 마일드 밀크 초콜릿"
                  value={form.title}
                  onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="브랜드"
                  placeholder="예: 롯데, 가나, 린트"
                  value={form.brand}
                  onChange={(e) => setForm(p => ({ ...p, brand: e.target.value }))}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth multiline rows={4}
                  label="리뷰 내용"
                  placeholder="이 초콜릿의 맛, 향, 식감 등 솔직한 느낌을 자유롭게 적어주세요..."
                  value={form.description}
                  onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                />
              </Grid>
            </Grid>

            {/* 이미지 URL */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
                <AddPhotoAlternateIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                대표 이미지
              </Typography>
              <TextField
                fullWidth
                label="이미지 URL (선택)"
                placeholder="https://example.com/chocolate.jpg"
                value={form.image_url}
                onChange={(e) => setForm(p => ({ ...p, image_url: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>또는 샘플 이미지 선택:</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {CHOCOLATE_IMAGES.map((img, i) => (
                  <Box
                    key={i}
                    component="img"
                    src={img}
                    alt={`샘플 ${i + 1}`}
                    onClick={() => setForm(p => ({ ...p, image_url: img }))}
                    sx={{
                      width: 72, height: 52, objectFit: 'cover', borderRadius: 2, cursor: 'pointer',
                      border: form.image_url === img ? '3px solid' : '2px solid transparent',
                      borderColor: form.image_url === img ? 'secondary.main' : 'transparent',
                      transition: 'border 0.2s',
                      '&:hover': { opacity: 0.8 },
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(66,43,33,0.1)', mb: 4 }} />

            {/* 맛 평가 슬라이더 */}
            <Typography variant="h5" sx={{ color: 'primary.main', mb: 3 }}>
              📊 맛 평가
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, fontFamily: '"Pretendard Variable", "Noto Sans KR", sans-serif' }}>
              각 맛의 강도를 0~100 사이로 조절하세요
            </Typography>

            <Box sx={{ px: { xs: 0, md: 2 } }}>
              {TASTE_CONFIG.map(({ key, label, color, description }) => (
                <Box key={key} sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 600 }}>
                      {label}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{description}</Typography>
                      <Typography
                        variant="h6"
                        sx={{ color, fontWeight: 700, minWidth: 40, textAlign: 'right' }}
                      >
                        {tastings[key]}
                      </Typography>
                    </Box>
                  </Box>
                  <Slider
                    value={tastings[key]}
                    onChange={(_, value) => setTastings(p => ({ ...p, [key]: value }))}
                    min={0} max={100} step={1}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 25, label: '약' },
                      { value: 50, label: '중' },
                      { value: 75, label: '강' },
                      { value: 100, label: '100' },
                    ]}
                    sx={{
                      color,
                      '& .MuiSlider-thumb': { '&:hover, &.Mui-focusVisible': { boxShadow: `0 0 0 8px ${color}33` } },
                      '& .MuiSlider-markLabel': { fontFamily: '"Pretendard Variable", "Noto Sans KR", sans-serif', fontSize: 11, color: 'text.secondary' },
                    }}
                  />
                </Box>
              ))}
            </Box>

            <Divider sx={{ borderColor: 'rgba(66,43,33,0.1)', mb: 4 }} />

            {/* 해시태그 */}
            <Typography variant="h5" sx={{ color: 'primary.main', mb: 2 }}>
              # 해시태그
            </Typography>
            <TextField
              fullWidth
              placeholder="태그 입력 후 Enter 또는 쉼표 (최대 8개)"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyDown={handleAddHashtag}
              sx={{ mb: 2 }}
              helperText="예: 밀크초콜릿, 달콤함, 선물추천"
            />
            {hashtags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {hashtags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    onDelete={() => removeHashtag(tag)}
                    sx={{ bgcolor: 'rgba(66,43,33,0.1)', color: 'primary.main' }}
                  />
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/posts')}
                sx={{ flex: 1, borderColor: 'primary.main', color: 'primary.main' }}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ flex: 2, bgcolor: 'primary.main', color: '#f8edad', py: 1.5, '&:hover': { bgcolor: 'primary.dark' } }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#f8edad' }} /> : '🍫 품평 게시하기'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default PostCreatePage
