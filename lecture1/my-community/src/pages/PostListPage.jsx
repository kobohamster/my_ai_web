import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box, Container, Typography, Button, Card, CardContent, CardActionArea,
  Chip, Skeleton, Alert, AppBar, Toolbar, IconButton, Tooltip
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import LogoutIcon from '@mui/icons-material/Logout'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

const formatDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const PostListPage = () => {
  const navigate = useNavigate()
  const { profile, signOut } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, author_username, created_at, view_count')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 6 }}>
      {/* 상단 네비게이션 */}
      <AppBar position='sticky' elevation={0} sx={{
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(61,127,176,0.15)',
      }}>
        <Toolbar>
          <Typography
            className='pixel-font'
            sx={{ fontSize: '0.65rem', color: '#5ab0d0', flexGrow: 1, letterSpacing: '0.05em', cursor: 'pointer' }}
            onClick={() => navigate('/posts')}
          >
            UNTIL DAWN
          </Typography>
          {profile?.is_admin && (
            <Tooltip title='관리자 페이지'>
              <IconButton onClick={() => navigate('/admin')} sx={{ color: 'warning.main', mr: 1 }}>
                <AdminPanelSettingsIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title='로그아웃'>
            <IconButton onClick={handleLogout} sx={{ color: 'text.secondary' }}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth='md' sx={{ pt: 4 }}>
        {/* 헤더 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant='h1' sx={{ fontSize: '1.5rem', color: 'text.primary' }}>
              미루기 게시판
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary', mt: 0.5 }}>
              {profile?.full_name}님, 오늘도 미루셨나요?
            </Typography>
          </Box>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => navigate('/posts/new')}
            sx={{
              background: 'linear-gradient(135deg, #3d7fb0, #c8956a)',
              '&:hover': { background: 'linear-gradient(135deg, #5ab0d0, #d4a878)' },
            }}
          >
            게시물 추가
          </Button>
        </Box>

        {error && <Alert severity='error' sx={{ mb: 3 }}>{error}</Alert>}

        {/* 게시물 목록 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant='rounded' height={100} sx={{ bgcolor: 'rgba(61,127,176,0.08)' }} />
              ))
            : posts.length === 0
              ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography sx={{ fontSize: '3rem', mb: 2 }}>🌙</Typography>
                  <Typography variant='h3' sx={{ color: 'text.secondary' }}>
                    아직 게시물이 없어요
                  </Typography>
                  <Typography variant='body2' sx={{ color: 'text.secondary', mt: 1 }}>
                    첫 번째 미루기 기록을 남겨보세요!
                  </Typography>
                </Box>
              )
              : posts.map((post) => (
                <Card key={post.id} sx={{ transition: 'all 0.2s', '&:hover': { borderColor: 'rgba(61,127,176,0.4)', transform: 'translateY(-1px)' } }}>
                  <CardActionArea component={Link} to={`/posts/${post.id}`}>
                    <CardContent sx={{ py: 2.5 }}>
                      <Typography variant='h3' sx={{ color: 'text.primary', mb: 1.5, fontSize: '1rem' }}>
                        {post.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Chip
                          label={post.author_username}
                          size='small'
                          sx={{ bgcolor: 'rgba(61,127,176,0.15)', color: 'primary.light', fontSize: '0.7rem' }}
                        />
                        <Typography variant='body2' sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                          {formatDate(post.created_at)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
                          <VisibilityIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant='body2' sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                            {post.view_count}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))
          }
        </Box>
      </Container>
    </Box>
  )
}

export default PostListPage
