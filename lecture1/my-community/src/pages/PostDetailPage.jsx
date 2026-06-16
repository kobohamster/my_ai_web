import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Container, Paper, Typography, Button, Chip, Skeleton,
  Alert, AppBar, Toolbar, IconButton, Tooltip, Divider,
  TextField, Avatar, CircularProgress,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

const formatDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatShortDate = (iso) => {
  const d = new Date(iso)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return '방금 전'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const CommentItem = ({ comment, currentProfile, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const isAuthor = currentProfile?.id === comment.user_id
  const isAdmin = currentProfile?.is_admin

  const handleSave = async () => {
    const trimmed = editContent.trim()
    if (!trimmed || trimmed === comment.content) {
      setEditing(false)
      setEditContent(comment.content)
      return
    }
    setSaving(true)
    const { error } = await supabase
      .from('comments')
      .update({ content: trimmed })
      .eq('id', comment.id)
    setSaving(false)
    if (!error) {
      setEditing(false)
      onUpdate(comment.id, trimmed)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setEditContent(comment.content)
  }

  const handleDelete = async () => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return
    setDeleting(true)
    const { error } = await supabase.from('comments').delete().eq('id', comment.id)
    if (!error) onDelete(comment.id)
    else setDeleting(false)
  }

  return (
    <Box sx={{ py: 2, borderBottom: '1px solid rgba(61,127,176,0.08)' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Avatar
          sx={{
            width: 32, height: 32, fontSize: '0.8rem',
            bgcolor: 'rgba(61,127,176,0.25)',
            color: 'primary.light',
            flexShrink: 0,
          }}
        >
          {comment.author_username.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.light', fontSize: '0.82rem' }}>
              {comment.author_username}
            </Typography>
            <Typography variant='caption' sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
              {formatShortDate(comment.created_at)}
              {comment.updated_at !== comment.created_at && ' (수정됨)'}
            </Typography>
            {(isAuthor || isAdmin) && !editing && (
              <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                {isAuthor && (
                  <Tooltip title='수정'>
                    <IconButton
                      size='small'
                      aria-label='댓글 수정'
                      onClick={() => setEditing(true)}
                      sx={{ color: 'text.secondary', p: 0.5, '&:hover': { color: 'primary.light' } }}
                    >
                      <EditIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title='삭제'>
                  <IconButton
                    size='small'
                    aria-label='댓글 삭제'
                    onClick={handleDelete}
                    disabled={deleting}
                    sx={{ color: 'text.secondary', p: 0.5, '&:hover': { color: 'error.main' } }}
                  >
                    {deleting ? <CircularProgress size={12} /> : <DeleteIcon sx={{ fontSize: 15 }} />}
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>

          {editing ? (
            <Box>
              <TextField
                multiline
                fullWidth
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                minRows={2}
                maxRows={6}
                size='small'
                inputProps={{ maxLength: 500 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.875rem',
                    borderRadius: 1.5,
                    '& fieldset': { borderColor: 'rgba(61,127,176,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(90,176,208,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#5ab0d0' },
                  },
                }}
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'flex-end' }}>
                <Button
                  size='small'
                  startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                  onClick={handleCancel}
                  sx={{ color: 'text.secondary', fontSize: '0.75rem', minWidth: 'auto' }}
                >
                  취소
                </Button>
                <Button
                  size='small'
                  variant='contained'
                  startIcon={saving ? <CircularProgress size={12} color='inherit' /> : <CheckIcon sx={{ fontSize: 14 }} />}
                  onClick={handleSave}
                  disabled={saving || !editContent.trim()}
                  sx={{
                    fontSize: '0.75rem',
                    background: 'linear-gradient(135deg, #3d7fb0, #c8956a)',
                    '&:hover': { background: 'linear-gradient(135deg, #5ab0d0, #d4a878)' },
                    minWidth: 'auto',
                  }}
                >
                  저장
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography
              variant='body2'
              sx={{
                color: 'text.primary',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '0.875rem',
              }}
            >
              {comment.content}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
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

  // 댓글 상태
  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [commentError, setCommentError] = useState('')

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [id])

  const fetchPost = async () => {
    setLoading(true)
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

    const { count } = await supabase
      .from('do_it_now')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', id)
    setDoItCount(count || 0)

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

  const fetchComments = async () => {
    setCommentsLoading(true)
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true })
    if (!error) setComments(data || [])
    setCommentsLoading(false)
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

  const handleCommentSubmit = async () => {
    const trimmed = newComment.trim()
    if (!trimmed) return
    if (!profile) {
      setCommentError('댓글을 작성하려면 로그인이 필요합니다.')
      return
    }
    setSubmitting(true)
    setCommentError('')
    const { data, error } = await supabase.from('comments').insert({
      post_id: id,
      user_id: profile.id,
      author_username: profile.username,
      content: trimmed,
    }).select().single()
    setSubmitting(false)
    if (error) {
      setCommentError('댓글 작성에 실패했습니다.')
      return
    }
    setComments(prev => [...prev, data])
    setNewComment('')
  }

  const handleCommentUpdate = (commentId, newContent) => {
    setComments(prev => prev.map(c =>
      c.id === commentId ? { ...c, content: newContent, updated_at: new Date().toISOString() } : c
    ))
  }

  const handleCommentDelete = (commentId) => {
    setComments(prev => prev.filter(c => c.id !== commentId))
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
        {error && <Alert severity='error' sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
            <Skeleton variant='text' height={40} sx={{ bgcolor: 'rgba(61,127,176,0.08)', mb: 2 }} />
            <Skeleton variant='text' height={20} width='40%' sx={{ bgcolor: 'rgba(61,127,176,0.08)', mb: 3 }} />
            <Skeleton variant='rounded' height={200} sx={{ bgcolor: 'rgba(61,127,176,0.08)' }} />
          </Paper>
        ) : post && (
          <>
            <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3, mb: 2 }}>
              {/* 제목 */}
              <Typography variant='h1' sx={{ fontSize: { xs: '1.3rem', sm: '1.7rem' }, mb: 2, lineHeight: 1.4 }}>
                {post.title}
              </Typography>

              {/* 메타 정보 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <Chip
                  label={post.author_username}
                  size='small'
                  sx={{ bgcolor: 'rgba(61,127,176,0.15)', color: 'primary.light', fontSize: '0.75rem' }}
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

              <Divider sx={{ borderColor: 'rgba(61,127,176,0.1)', mb: 3 }} />

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

              <Divider sx={{ borderColor: 'rgba(61,127,176,0.1)', mb: 3 }} />

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
                          background: 'linear-gradient(135deg, #3d7fb0, #c8956a)',
                          '&:hover': { background: 'linear-gradient(135deg, #2d6fae, #5a2fd4)' },
                        }
                      : {
                          borderColor: '#5ab0d0',
                          color: '#5ab0d0',
                          '&:hover': { borderColor: '#5ab0d0', bgcolor: 'rgba(61,127,176,0.08)' },
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

            {/* 댓글 섹션 */}
            <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <ForumOutlinedIcon sx={{ fontSize: 18, color: 'primary.light' }} />
                <Typography variant='h3' sx={{ fontSize: '1rem', fontWeight: 600 }}>
                  댓글
                </Typography>
                <Chip
                  label={comments.length}
                  size='small'
                  sx={{ bgcolor: 'rgba(61,127,176,0.15)', color: 'primary.light', fontSize: '0.72rem', height: 20 }}
                />
              </Box>

              {/* 댓글 목록 */}
              {commentsLoading ? (
                <Box sx={{ py: 2 }}>
                  {[1, 2].map(i => (
                    <Skeleton key={i} variant='rounded' height={60} sx={{ bgcolor: 'rgba(61,127,176,0.08)', mb: 1.5, borderRadius: 2 }} />
                  ))}
                </Box>
              ) : comments.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant='body2' sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                    아직 댓글이 없어요. 첫 번째 댓글을 남겨보세요!
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {comments.map(comment => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      currentProfile={profile}
                      onUpdate={handleCommentUpdate}
                      onDelete={handleCommentDelete}
                    />
                  ))}
                </Box>
              )}

              {/* 댓글 작성 폼 */}
              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(61,127,176,0.1)' }}>
                {profile ? (
                  <>
                    {commentError && (
                      <Alert severity='error' sx={{ mb: 2, fontSize: '0.8rem' }}>{commentError}</Alert>
                    )}
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Avatar
                        sx={{
                          width: 32, height: 32, fontSize: '0.8rem',
                          bgcolor: 'rgba(61,127,176,0.25)',
                          color: 'primary.light',
                          flexShrink: 0,
                          mt: 0.5,
                        }}
                      >
                        {profile.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          multiline
                          fullWidth
                          minRows={2}
                          maxRows={6}
                          placeholder='댓글을 입력하세요 (최대 500자)'
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          inputProps={{ maxLength: 500 }}
                          sx={{
                            mb: 1,
                            '& .MuiOutlinedInput-root': {
                              fontSize: '0.875rem',
                              borderRadius: 2,
                              '& fieldset': { borderColor: 'rgba(61,127,176,0.25)' },
                              '&:hover fieldset': { borderColor: 'rgba(90,176,208,0.5)' },
                              '&.Mui-focused fieldset': { borderColor: '#5ab0d0' },
                            },
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant='caption' sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                            {newComment.length}/500
                          </Typography>
                          <Button
                            variant='contained'
                            size='small'
                            onClick={handleCommentSubmit}
                            disabled={submitting || !newComment.trim()}
                            sx={{
                              px: 2.5, py: 0.8,
                              background: 'linear-gradient(135deg, #3d7fb0, #c8956a)',
                              '&:hover': { background: 'linear-gradient(135deg, #5ab0d0, #d4a878)' },
                              '&:disabled': { opacity: 0.5 },
                              fontSize: '0.82rem',
                            }}
                          >
                            {submitting ? <CircularProgress size={14} color='inherit' /> : '댓글 등록'}
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 1.5 }}>
                      댓글을 작성하려면 로그인이 필요합니다.
                    </Typography>
                    <Button
                      variant='outlined'
                      size='small'
                      onClick={() => navigate('/')}
                      sx={{ borderColor: '#5ab0d0', color: '#5ab0d0', fontSize: '0.8rem' }}
                    >
                      로그인하러 가기
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </>
        )}
      </Container>
    </Box>
  )
}

export default PostDetailPage
