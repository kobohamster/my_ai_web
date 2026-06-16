import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container, Box, Typography, Tabs, Tab, Grid, Card, CardActionArea,
  CardMedia, CardContent, Chip, Stack, Button, Avatar, CircularProgress,
} from '@mui/material'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import CommentIcon from '@mui/icons-material/Comment'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const CHOCOLATE_IMAGES = [
  'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=400&h=200&fit=crop',
]

const MyPage = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const [bookmarks, setBookmarks] = useState([])
  const [comments, setComments] = useState([])
  const [myPosts, setMyPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchAll()
  }, [user])

  const fetchAll = async () => {
    setLoading(true)
    const [bmResult, cmResult, myResult] = await Promise.all([
      supabase.from('choco_bookmarks').select('post_id, choco_posts(*)').eq('user_id', user.id),
      supabase.from('choco_comments').select('*, choco_posts(id, title)').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('choco_posts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ])
    if (bmResult.data) setBookmarks(bmResult.data.filter(b => b.choco_posts).map(b => b.choco_posts))
    if (cmResult.data) setComments(cmResult.data)
    if (myResult.data) setMyPosts(myResult.data)
    setLoading(false)
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>🔒</Typography>
        <Typography variant="h5" sx={{ color: 'primary.main', mb: 2 }}>로그인이 필요합니다</Typography>
        <Button variant="contained" onClick={() => navigate('/login')} sx={{ bgcolor: 'primary.main', color: '#f8edad' }}>
          로그인하기
        </Button>
      </Container>
    )
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)', pb: 8 }}>
      {/* 프로필 헤더 */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          py: 5,
          textAlign: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 4,
            background: 'repeating-linear-gradient(90deg, #ca1c1d 0px, #ca1c1d 20px, #422b21 20px, #422b21 40px)',
          },
        }}
      >
        <Avatar
          sx={{ width: 80, height: 80, bgcolor: 'secondary.main', mx: 'auto', mb: 2, fontSize: 32 }}
        >
          {user.email?.[0]?.toUpperCase()}
        </Avatar>
        <Typography variant="h5" sx={{ color: '#f8edad', mb: 0.5 }}>
          {user.email}
        </Typography>
        <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#f8edad', fontWeight: 700 }}>{myPosts.length}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(248,237,173,0.7)' }}>내 품평</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#f8edad', fontWeight: 700 }}>{bookmarks.length}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(248,237,173,0.7)' }}>북마크</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#f8edad', fontWeight: 700 }}>{comments.length}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(248,237,173,0.7)' }}>댓글</Typography>
          </Box>
        </Stack>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* 탭 */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            mb: 4,
            '& .MuiTab-root': { color: 'text.secondary', fontFamily: '"Noto Sans KR", sans-serif', fontWeight: 600 },
            '& .Mui-selected': { color: 'primary.main' },
            '& .MuiTabs-indicator': { bgcolor: 'primary.main' },
          }}
        >
          <Tab icon={<CommentIcon />} iconPosition="start" label={`내 품평 (${myPosts.length})`} />
          <Tab icon={<BookmarkIcon />} iconPosition="start" label={`북마크 (${bookmarks.length})`} />
          <Tab icon={<CommentIcon />} iconPosition="start" label={`댓글 (${comments.length})`} />
        </Tabs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </Box>
        ) : (
          <>
            {/* 내 품평 탭 */}
            {tab === 0 && (
              myPosts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography sx={{ fontSize: '3rem', mb: 2 }}>🍫</Typography>
                  <Typography variant="h5" sx={{ color: 'primary.light', mb: 2 }}>아직 작성한 품평이 없어요</Typography>
                  <Button variant="contained" onClick={() => navigate('/posts/create')} sx={{ bgcolor: 'primary.main', color: '#f8edad' }}>
                    첫 품평 쓰기
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {myPosts.map((post, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                      <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' }, transition: 'transform 0.2s' }}>
                        <CardActionArea onClick={() => navigate(`/posts/${post.id}`)}>
                          <CardMedia
                            component="img" height="140"
                            image={post.image_url || CHOCOLATE_IMAGES[idx % CHOCOLATE_IMAGES.length]}
                            alt={post.title}
                          />
                          <CardContent>
                            <Typography variant="h6" sx={{ color: 'primary.main' }} noWrap>{post.title}</Typography>
                            {post.brand && <Typography variant="body2" sx={{ color: 'text.secondary' }}>{post.brand}</Typography>}
                            {post.hashtags?.length > 0 && (
                              <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}>
                                {post.hashtags.slice(0, 2).map(t => (
                                  <Chip key={t} label={`#${t}`} size="small" sx={{ bgcolor: 'rgba(66,43,33,0.08)', color: 'primary.main', fontSize: 11 }} />
                                ))}
                              </Stack>
                            )}
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )
            )}

            {/* 북마크 탭 */}
            {tab === 1 && (
              bookmarks.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography sx={{ fontSize: '3rem', mb: 2 }}>🔖</Typography>
                  <Typography variant="h5" sx={{ color: 'primary.light', mb: 2 }}>북마크한 품평이 없어요</Typography>
                  <Button variant="outlined" onClick={() => navigate('/posts')} sx={{ borderColor: 'primary.main', color: 'primary.main' }}>
                    품평 보러가기
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {bookmarks.map((post, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                      <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' }, transition: 'transform 0.2s' }}>
                        <CardActionArea onClick={() => navigate(`/posts/${post.id}`)}>
                          <CardMedia
                            component="img" height="140"
                            image={post.image_url || CHOCOLATE_IMAGES[idx % CHOCOLATE_IMAGES.length]}
                            alt={post.title}
                          />
                          <CardContent>
                            <Typography variant="h6" sx={{ color: 'primary.main' }} noWrap>{post.title}</Typography>
                            {post.brand && <Typography variant="body2" sx={{ color: 'text.secondary' }}>{post.brand}</Typography>}
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )
            )}

            {/* 댓글 탭 */}
            {tab === 2 && (
              comments.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography sx={{ fontSize: '3rem', mb: 2 }}>💬</Typography>
                  <Typography variant="h5" sx={{ color: 'primary.light' }}>아직 작성한 댓글이 없어요</Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {comments.map((comment) => (
                    <Box
                      key={comment.id}
                      sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(66,43,33,0.1)', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(248,237,173,0.5)' } }}
                      onClick={() => navigate(`/posts/${comment.post_id}`)}
                    >
                      <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700, mb: 0.5 }}>
                        📝 {comment.choco_posts?.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontFamily: '"Noto Sans KR", sans-serif' }}>
                        {comment.content}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                        {new Date(comment.created_at).toLocaleDateString('ko-KR')}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )
            )}
          </>
        )}

        {/* 로그아웃 */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            onClick={async () => { await signOut(); navigate('/') }}
            sx={{ borderColor: 'rgba(66,43,33,0.3)', color: 'text.secondary' }}
          >
            로그아웃
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default MyPage
