import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container, Box, Typography, Grid, Card, CardContent,
  CardMedia, CardActionArea, Chip, Stack, Button,
  TextField, InputAdornment, Skeleton, Fab,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { supabase } from '../lib/supabase'

const CHOCOLATE_IMAGES = [
  'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=280&fit=crop',
  'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=280&fit=crop',
  'https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=400&h=280&fit=crop',
  'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=280&fit=crop',
  'https://images.unsplash.com/photo-1522252234503-e356532cafd5?w=400&h=280&fit=crop',
  'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=280&fit=crop',
  'https://images.unsplash.com/photo-1541250848049-b8d78f91e25a?w=400&h=280&fit=crop',
  'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=280&fit=crop',
  'https://images.unsplash.com/photo-1550986440-f48baae9e13a?w=400&h=280&fit=crop',
]

const TasteBar = ({ label, value, color = '#422b21' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
    <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 28 }}>{label}</Typography>
    <Box sx={{ flexGrow: 1, bgcolor: 'rgba(66,43,33,0.1)', borderRadius: 1, height: 4, overflow: 'hidden' }}>
      <Box sx={{ width: `${value}%`, height: '100%', bgcolor: color, borderRadius: 1 }} />
    </Box>
    <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 24, textAlign: 'right' }}>
      {value}
    </Typography>
  </Box>
)

const PostCard = ({ post, idx, onClick }) => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 40px rgba(66,43,33,0.2)' },
      border: '1px solid',
      borderColor: 'rgba(66,43,33,0.1)',
    }}
  >
    <CardActionArea onClick={onClick} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      {/* 초콜릿 바 헤더 */}
      <Box
        sx={{
          height: 8,
          background: 'repeating-linear-gradient(90deg, #422b21 0px, #422b21 15px, #6b4c3b 15px, #6b4c3b 30px)',
        }}
      />
      <CardMedia
        component="img"
        height="180"
        image={post.image_url || CHOCOLATE_IMAGES[idx % CHOCOLATE_IMAGES.length]}
        alt={post.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, flex: 1 }} noWrap>
            {post.title}
          </Typography>
        </Box>

        {post.brand && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            {post.brand}
          </Typography>
        )}

        {post.description && (
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {post.description}
          </Typography>
        )}

        {/* 맛 미니 바 */}
        <Box sx={{ mb: 1.5 }}>
          <TasteBar label="단" value={post.sweetness} color="#ca1c1d" />
          <TasteBar label="쓴" value={post.bitterness} color="#422b21" />
        </Box>

        {post.hashtags?.length > 0 && (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
            {post.hashtags.slice(0, 3).map((tag) => (
              <Chip
                key={tag} label={`#${tag}`} size="small"
                sx={{ bgcolor: 'rgba(66,43,33,0.08)', color: 'primary.main', fontSize: 11, height: 22 }}
              />
            ))}
          </Stack>
        )}
      </CardContent>
    </CardActionArea>
    {/* 초콜릿 바 푸터 */}
    <Box
      sx={{
        height: 4,
        background: 'repeating-linear-gradient(90deg, #ca1c1d 0px, #ca1c1d 10px, #422b21 10px, #422b21 20px)',
      }}
    />
  </Card>
)

const PostListPage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('choco_posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setPosts(data)
    setLoading(false)
  }

  const filtered = posts.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase()) ||
    p.hashtags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)', pb: 10 }}>
      {/* 헤더 배너 */}
      <Box sx={{ bgcolor: 'primary.main', py: 5, px: 2, textAlign: 'center', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'repeating-linear-gradient(90deg, #ca1c1d 0px, #ca1c1d 20px, #422b21 20px, #422b21 40px)' }} />
        <Typography variant="h3" sx={{ color: '#f8edad', mb: 1 }}>
          초콜릿 품평 목록
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(248,237,173,0.7)', fontFamily: '"Noto Sans KR", sans-serif' }}>
          초콜릿 애호가들의 솔직한 리뷰를 확인하세요
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* 검색 바 */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="초콜릿 이름, 브랜드, #태그로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(66,43,33,0.2)' },
                '&:hover fieldset': { borderColor: 'primary.main' },
              },
            }}
          />
        </Box>

        {/* 결과 수 */}
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          {loading ? '불러오는 중...' : `총 ${filtered.length}개의 품평`}
        </Typography>

        {/* 카드 그리드 (3열) */}
        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 4 }} />
                </Grid>
              ))
            : filtered.length === 0
              ? (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 10 }}>
                    <Typography sx={{ fontSize: '3rem', mb: 2 }}>🔍</Typography>
                    <Typography variant="h5" sx={{ color: 'primary.light' }}>
                      검색 결과가 없어요
                    </Typography>
                  </Box>
                </Grid>
              )
              : filtered.map((post, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={post.id}>
                    <PostCard
                      post={post}
                      idx={idx}
                      onClick={() => navigate(`/posts/${post.id}`)}
                    />
                  </Grid>
                ))
          }
        </Grid>
      </Container>

      {/* 플로팅 작성 버튼 */}
      <Fab
        color="secondary"
        aria-label="품평 작성"
        onClick={() => navigate('/posts/create')}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: 'primary.main',
          color: '#f8edad',
          '&:hover': { bgcolor: 'primary.dark' },
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  )
}

export default PostListPage
