import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container, Box, Typography, Button, Paper, Chip, Stack,
  TextField, IconButton, Divider, CircularProgress, Avatar, Alert,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from 'recharts'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const CHOCOLATE_IMAGES = [
  'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&h=400&fit=crop',
]

const PostDetailPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [id])

  useEffect(() => {
    if (user && post) {
      checkLikeBookmark()
    }
  }, [user, post])

  const fetchPost = async () => {
    const { data } = await supabase.from('choco_posts').select('*').eq('id', id).single()
    if (data) setPost(data)
    setLoading(false)
  }

  const fetchComments = async () => {
    const { data } = await supabase
      .from('choco_comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true })
    if (data) setComments(data)
  }

  const checkLikeBookmark = async () => {
    const { data: likes } = await supabase.from('choco_likes').select('id').eq('post_id', id)
    setLikeCount(likes?.length || 0)
    if (user) {
      const { data: myLike } = await supabase.from('choco_likes').select('id').eq('post_id', id).eq('user_id', user.id).single()
      setLiked(!!myLike)
      const { data: myBookmark } = await supabase.from('choco_bookmarks').select('id').eq('post_id', id).eq('user_id', user.id).single()
      setBookmarked(!!myBookmark)
    }
  }

  const toggleLike = async () => {
    if (!user) { navigate('/login'); return }
    if (liked) {
      await supabase.from('choco_likes').delete().eq('post_id', id).eq('user_id', user.id)
      setLiked(false)
      setLikeCount(c => c - 1)
    } else {
      await supabase.from('choco_likes').insert({ post_id: id, user_id: user.id })
      setLiked(true)
      setLikeCount(c => c + 1)
    }
  }

  const toggleBookmark = async () => {
    if (!user) { navigate('/login'); return }
    if (bookmarked) {
      await supabase.from('choco_bookmarks').delete().eq('post_id', id).eq('user_id', user.id)
      setBookmarked(false)
    } else {
      await supabase.from('choco_bookmarks').insert({ post_id: id, user_id: user.id })
      setBookmarked(true)
    }
  }

  const submitComment = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!newComment.trim()) return
    setCommentLoading(true)
    const { data } = await supabase.from('choco_comments').insert({
      post_id: id,
      user_id: user.id,
      content: newComment.trim(),
    }).select().single()
    if (data) {
      setComments(prev => [...prev, data])
      setNewComment('')
    }
    setCommentLoading(false)
  }

  const deleteComment = async (commentId) => {
    await supabase.from('choco_comments').delete().eq('id', commentId)
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
      <CircularProgress sx={{ color: 'primary.main' }} />
    </Box>
  )

  if (!post) return (
    <Container sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ color: 'primary.main' }}>게시물을 찾을 수 없어요</Typography>
      <Button onClick={() => navigate('/posts')} sx={{ mt: 2 }}>목록으로</Button>
    </Container>
  )

  const radarData = [
    { subject: '단맛', value: post.sweetness, fullMark: 100 },
    { subject: '짠맛', value: post.saltiness, fullMark: 100 },
    { subject: '신맛', value: post.sourness, fullMark: 100 },
    { subject: '쓴맛', value: post.bitterness, fullMark: 100 },
    { subject: '감칠맛', value: post.umami, fullMark: 100 },
  ]

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)', pb: 8 }}>
      {/* 헤더 이미지 */}
      <Box
        sx={{
          height: { xs: 220, md: 340 },
          backgroundImage: `url("${post.image_url || CHOCOLATE_IMAGES[0]}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(66,43,33,0.5)' }} />
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 3, background: 'linear-gradient(transparent, rgba(66,43,33,0.8))' }}>
          <Container maxWidth="md">
            <Typography variant="h3" sx={{ color: '#f8edad' }}>
              {post.title}
            </Typography>
            {post.brand && (
              <Typography variant="h6" sx={{ color: 'rgba(248,237,173,0.8)', fontFamily: '"Noto Sans KR", sans-serif', fontWeight: 400 }}>
                {post.brand}
              </Typography>
            )}
          </Container>
        </Box>
        <IconButton
          onClick={() => navigate('/posts')}
          sx={{ position: 'absolute', top: 16, left: 16, bgcolor: 'rgba(248,237,173,0.2)', '&:hover': { bgcolor: 'rgba(248,237,173,0.4)' } }}
        >
          <ArrowBackIcon sx={{ color: '#f8edad' }} />
        </IconButton>
      </Box>

      <Container maxWidth="md" sx={{ mt: -4, position: 'relative', zIndex: 1 }}>
        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, border: '1px solid rgba(66,43,33,0.1)' }}>
          {/* 액션 버튼 */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              startIcon={liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={toggleLike}
              variant={liked ? 'contained' : 'outlined'}
              sx={{
                bgcolor: liked ? 'secondary.main' : 'transparent',
                color: liked ? '#fff' : 'secondary.main',
                borderColor: 'secondary.main',
                '&:hover': { bgcolor: liked ? 'secondary.dark' : 'rgba(202,28,29,0.08)' },
              }}
            >
              좋아요 {likeCount}
            </Button>
            <IconButton
              onClick={toggleBookmark}
              sx={{ color: bookmarked ? 'primary.main' : 'text.secondary' }}
              aria-label={bookmarked ? '북마크 해제' : '북마크 추가'}
            >
              {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Box>

          {/* 설명 */}
          {post.description && (
            <Typography variant="body1" sx={{ color: 'text.primary', mb: 3, lineHeight: 1.8, fontFamily: '"Noto Sans KR", sans-serif' }}>
              {post.description}
            </Typography>
          )}

          {/* 해시태그 */}
          {post.hashtags?.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
              {post.hashtags.map((tag) => (
                <Chip
                  key={tag} label={`#${tag}`}
                  sx={{ bgcolor: 'rgba(66,43,33,0.1)', color: 'primary.main', fontWeight: 500 }}
                />
              ))}
            </Stack>
          )}

          <Divider sx={{ borderColor: 'rgba(66,43,33,0.1)', mb: 4 }} />

          {/* 레이더 차트 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ color: 'primary.main', mb: 3, textAlign: 'center' }}>
              🍫 맛 분석
            </Typography>
            <Box sx={{ bgcolor: 'rgba(248,237,173,0.5)', borderRadius: 4, p: 2 }}>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                  <PolarGrid stroke="rgba(66,43,33,0.2)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#422b21', fontFamily: '"Noto Sans KR", sans-serif', fontSize: 14, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#7a5c4e', fontSize: 11 }} />
                  <Radar
                    name="맛 분석"
                    dataKey="value"
                    stroke="#ca1c1d"
                    fill="#ca1c1d"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}점`, '점수']}
                    contentStyle={{ bgcolor: '#fffdf0', border: '1px solid #422b21', borderRadius: 8 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Box>

            {/* 수치 테이블 */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, mt: 2 }}>
              {radarData.map((item) => (
                <Box key={item.subject} sx={{ textAlign: 'center', p: 1.5, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid rgba(66,43,33,0.1)' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>{item.subject}</Typography>
                  <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 700 }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(66,43,33,0.1)', mb: 4 }} />

          {/* 댓글 섹션 */}
          <Box>
            <Typography variant="h5" sx={{ color: 'primary.main', mb: 3 }}>
              💬 댓글 {comments.length}
            </Typography>

            {/* 댓글 작성 */}
            {user ? (
              <Box component="form" onSubmit={submitComment} sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="초콜릿에 대한 의견을 남겨주세요..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!newComment.trim() || commentLoading}
                  sx={{ alignSelf: 'flex-end', bgcolor: 'primary.main', color: '#f8edad', px: 3 }}
                >
                  등록
                </Button>
              </Box>
            ) : (
              <Alert
                severity="info"
                action={<Button size="small" onClick={() => navigate('/login')}>로그인</Button>}
                sx={{ mb: 3, bgcolor: 'rgba(248,237,173,0.8)', '& .MuiAlert-icon': { color: 'primary.main' } }}
              >
                댓글을 작성하려면 로그인이 필요합니다.
              </Alert>
            )}

            {/* 댓글 목록 */}
            <Stack spacing={2}>
              {comments.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}>
                  아직 댓글이 없어요. 첫 번째로 의견을 남겨보세요!
                </Typography>
              ) : (
                comments.map((comment) => (
                  <Box
                    key={comment.id}
                    sx={{
                      p: 2, borderRadius: 2,
                      bgcolor: 'background.paper',
                      border: '1px solid rgba(66,43,33,0.1)',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: 12 }}>
                          {comment.user_id?.[0]?.toUpperCase()}
                        </Avatar>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {new Date(comment.created_at).toLocaleDateString('ko-KR')}
                        </Typography>
                      </Box>
                      {user?.id === comment.user_id && (
                        <IconButton
                          size="small"
                          onClick={() => deleteComment(comment.id)}
                          aria-label="댓글 삭제"
                        >
                          <DeleteIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </IconButton>
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontFamily: '"Noto Sans KR", sans-serif' }}>
                      {comment.content}
                    </Typography>
                  </Box>
                ))
              )}
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default PostDetailPage
