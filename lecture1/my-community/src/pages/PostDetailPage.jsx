import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Container, Paper, Typography, Button, Chip, Skeleton,
  Alert, AppBar, Toolbar, IconButton, Tooltip, Divider
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

const formatDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const PostDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [post, setPost] = useState(null)
  const [doItCount, setDoItCount] = useState(0)
  const [didIt, setDidIt] = useState(false)
  const [loading, setLoading] = useState(true)
  const [doItLoading, setDoItLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    setLoading(true)

    // 조회수 증가
    await supabase.rpc('increment_view_count', { p_post_id: id })

    const { data: postData, error: postError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (postError) {
      setError('게시물을 불러올 수 없습니다.')
      setLoading(false)
      return
    }
    setPost(postData)

    // Do it now 카운트 조회
    const { count } = await supabase
      .from('do_it_now')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', id)
    setDoItCount(count || 0)

    // 내가 눌렀는지 확인
    if (profile) {
      const { data: myClick } = await supabase
        .from('do_it_now')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', profile.id)
        .maybeSingle()
      setDidIt(!!myClick)
    }

    setLoading(false)
  }

  const handleDoItNow = async () => {
    if (!profile || doItLoading) return
    setDoItLoading(true)
    try {
      if (didIt) {
        await supabase.from('do_it_now').delete()
          .eq('post_id', id).eq('user_id', profile.id)
        setDoItCount(prev => Math.max(0, prev - 1))
        setDidIt(false)
      } else {
        await supabase.from('do_it_now').insert({ post_id: id, user_id: profile.id })
        setDoItCount(prev => prev + 1)
        setDidIt(true)
      }
    } finally {
      setDoItLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 6 }}>
      <AppBar position='sticky' elevation={0} sx={{
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(74,144,217,0.15)',
      }}>
        <Toolbar>
          <Tooltip title='뒤로 가기'>
            <IconButton onClick={() => navigate('/posts')} sx={{ color: 'text.secondary', mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography
            className='pixel-font'
            sx={{ fontSize: '0.65rem', color: '#4a90d9', flexGrow: 1, letterSpacing: '0.05em' }}
          >
            UNTIL DAWN
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth='md' sx={{ pt: 4 }}>
        {error && <Alert severity='error' sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
            <Skeleton variant='text' height={40} sx={{ bgcolor: 'rgba(74,144,217,0.08)', mb: 2 }} />
            <Skeleton variant='text' height={20} width='40%' sx={{ bgcolor: 'rgba(74,144,217,0.08)', mb: 3 }} />
            <Skeleton variant='rounded' height={200} sx={{ bgcolor: 'rgba(74,144,217,0.08)' }} />
          </Paper>
        ) : post && (
          <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
            {/* 제목 */}
            <Typography variant='h1' sx={{ fontSize: { xs: '1.3rem', sm: '1.7rem' }, mb: 2, lineHeight: 1.4 }}>
              {post.title}
            </Typography>

            {/* 메타 정보 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
              <Chip
                label={post.author_username}
                size='small'
                sx={{ bgcolor: 'rgba(74,144,217,0.15)', color: 'primary.light', fontSize: '0.75rem' }}
              />
              <Typography variant='body2' sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                {formatDate(post.created_at)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
                <VisibilityIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant='body2' sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                  {post.view_count}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(74,144,217,0.1)', mb: 3 }} />

            {/* 이미지 */}
            {post.image_url && (
              <Box
                component='img'
                src={post.image_url}
                alt='게시물 이미지'
                sx={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 2, mb: 3 }}
              />
            )}

            {/* 내용 */}
            <Typography
              variant='body1'
              sx={{
                color: 'text.primary',
                lineHeight: 1.9,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                mb: 4,
              }}
            >
              {post.content}
            </Typography>

            <Divider sx={{ borderColor: 'rgba(74,144,217,0.1)', mb: 3 }} />

            {/* Do it now 버튼 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
              <Button
                variant={didIt ? 'contained' : 'outlined'}
                size='large'
                onClick={handleDoItNow}
                disabled={doItLoading}
                sx={{
                  px: 4, py: 1.5, fontSize: '1rem', fontWeight: 700,
                  ...(didIt
                    ? {
                        background: 'linear-gradient(135deg, #4a90d9, #7c4dff)',
                        '&:hover': { background: 'linear-gradient(135deg, #2d6fae, #5a2fd4)' },
                      }
                    : {
                        borderColor: '#4a90d9',
                        color: '#4a90d9',
                        '&:hover': { borderColor: '#74b3e8', bgcolor: 'rgba(74,144,217,0.08)' },
                      }
                  ),
                }}
              >
                {didIt ? '✓ Do it now!' : 'Do it now!'}
              </Button>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                {doItCount > 0
                  ? `${doItCount}명이 "Do it now!"를 눌렀어요`
                  : '아직 아무도 안 눌렀어요. 나만 미루는 건 아니잖아요?'
                }
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant='text'
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/posts')}
                sx={{ color: 'text.secondary' }}
              >
                목록으로 돌아가기
              </Button>
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  )
}

export default PostDetailPage
