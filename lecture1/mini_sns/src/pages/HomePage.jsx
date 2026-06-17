import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Button, Grid, Card,
  CardContent, CardMedia, CardActionArea, Chip, Stack,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import StarIcon from '@mui/icons-material/Star'
import { supabase } from '../lib/supabase'

const CHOCOLATE_IMAGES = [
  'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522252234503-e356532cafd5?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop',
]

const HomePage = () => {
  const [recentPosts, setRecentPosts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('choco_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)
      if (data) setRecentPosts(data)
    }
    fetchPosts()
  }, [])

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)' }}>
      {/* Hero 섹션 */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'primary.main',
          overflow: 'hidden',
          py: { xs: 8, md: 14 },
          px: 2,
          textAlign: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url("https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=1200&h=600&fit=crop")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h1"
            sx={{
              color: '#f8edad',
              fontSize: { xs: '2.5rem', md: '4.5rem' },
              letterSpacing: 4,
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              mb: 2,
            }}
          >
            CHOCORATE
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(248,237,173,0.85)',
              fontFamily: '"Pretendard Variable", "Noto Sans KR", sans-serif',
              fontWeight: 400,
              mb: 1,
            }}
          >
            세상 모든 초콜릿을 맛보다
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(248,237,173,0.7)',
              fontFamily: '"Pretendard Variable", "Noto Sans KR", sans-serif',
              mb: 5,
              maxWidth: 480,
              mx: 'auto',
            }}
          >
            달콤함, 쓴맛, 산미… 나만의 기준으로 초콜릿을 평가하고
            <br />
            초콜릿 애호가들과 함께 나눠보세요.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/posts')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: 'secondary.main',
                color: '#fff',
                px: 4, py: 1.5,
                fontSize: '1rem',
                '&:hover': { bgcolor: 'secondary.dark', transform: 'translateY(-2px)' },
                transition: 'all 0.2s',
              }}
            >
              품평 보러가기
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/posts/create')}
              sx={{
                color: '#f8edad',
                borderColor: '#f8edad',
                px: 4, py: 1.5,
                fontSize: '1rem',
                '&:hover': { bgcolor: 'rgba(248,237,173,0.1)', transform: 'translateY(-2px)' },
                transition: 'all 0.2s',
              }}
            >
              내 초콜릿 리뷰 쓰기
            </Button>
          </Stack>
        </Box>

        {/* 초콜릿 바 장식 */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 12,
            background: 'repeating-linear-gradient(90deg, #ca1c1d 0px, #ca1c1d 20px, #422b21 20px, #422b21 40px)',
          }}
        />
      </Box>

      {/* 특징 소개 섹션 (풀스크린) */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: 'center', color: 'primary.main', mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
            CHOCORATE에서 할 수 있는 것
          </Typography>
          <Grid container spacing={4}>
            {[
              { emoji: '📊', title: '맛 분석 레이더', desc: '단맛, 쓴맛, 신맛, 짠맛, 감칠맛을\n5가지 축으로 시각화' },
              { emoji: '🔖', title: '나만의 북마크', desc: '마음에 드는 초콜릿 리뷰를\n나중에 볼 수 있게 저장' },
              { emoji: '💬', title: '커뮤니티 토론', desc: '같은 초콜릿을 좋아하는 사람들과\n자유롭게 의견 나누기' },
              { emoji: '🎪', title: '체험 예약', desc: '지역 초콜릿 공방 체험 일정을\n한눈에 보고 예약하기' },
            ].map((item) => (
              <Grid size={{ xs: 6, sm: 6, md: 3 }} key={item.title}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 4,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'rgba(66,43,33,0.15)',
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 30px rgba(66,43,33,0.15)' },
                  }}
                >
                  <Typography sx={{ fontSize: '2.5rem', mb: 2 }}>{item.emoji}</Typography>
                  <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 최근 리뷰 섹션 */}
      <Box sx={{ bgcolor: 'rgba(66,43,33,0.05)', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ color: 'primary.main' }}>
              최근 품평
            </Typography>
            <Button
              onClick={() => navigate('/posts')}
              endIcon={<ArrowForwardIcon />}
              sx={{ color: 'secondary.main', fontWeight: 700 }}
            >
              전체 보기
            </Button>
          </Box>

          {recentPosts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ fontSize: '3rem', mb: 2 }}>🍫</Typography>
              <Typography variant="h5" sx={{ color: 'primary.light', mb: 1 }}>
                아직 게시된 품평이 없어요
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                첫 번째 초콜릿 품평의 주인공이 되어보세요!
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/posts/create')}
                sx={{ bgcolor: 'primary.main', color: '#f8edad' }}
              >
                첫 품평 작성하기
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {recentPosts.map((post, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-4px)' },
                    }}
                  >
                    <CardActionArea onClick={() => navigate(`/posts/${post.id}`)}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={post.image_url || CHOCOLATE_IMAGES[idx % CHOCOLATE_IMAGES.length]}
                        alt={post.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography variant="h6" sx={{ color: 'primary.main', mb: 0.5 }} noWrap>
                          {post.title}
                        </Typography>
                        {post.brand && (
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                            {post.brand}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                          <StarIcon sx={{ color: '#ca1c1d', fontSize: 16 }} />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            단맛 {post.sweetness} / 쓴맛 {post.bitterness}
                          </Typography>
                        </Box>
                        {post.hashtags?.length > 0 && (
                          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                            {post.hashtags.slice(0, 3).map((tag) => (
                              <Chip
                                key={tag} label={`#${tag}`} size="small"
                                sx={{ bgcolor: 'rgba(66,43,33,0.08)', color: 'primary.main', fontSize: 11 }}
                              />
                            ))}
                          </Stack>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* CTA 섹션 */}
      <Box sx={{ bgcolor: 'primary.main', py: 10, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ color: '#f8edad', mb: 2 }}>
          지금 바로 시작하세요
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(248,237,173,0.7)', mb: 4, fontFamily: '"Pretendard Variable", "Noto Sans KR", sans-serif' }}>
          초콜릿 한 조각의 이야기를 함께 나눠봐요
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/register')}
          sx={{
            bgcolor: 'secondary.main', color: '#fff',
            px: 6, py: 1.5, fontSize: '1.1rem',
            '&:hover': { bgcolor: 'secondary.dark' },
          }}
        >
          무료로 가입하기
        </Button>
      </Box>
    </Box>
  )
}

export default HomePage
