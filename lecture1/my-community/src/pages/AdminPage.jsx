import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Paper, Button, Chip, Alert,
  AppBar, Toolbar, IconButton, Tooltip, Divider, Skeleton,
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import { supabase } from '../supabase'

const statusColor = { pending: 'warning', approved: 'success', rejected: 'error' }
const statusLabel = { pending: '대기', approved: '승인', rejected: '거부' }

const formatDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })
}

const AdminPage = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState(null) // { id, username }

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, birth_date, join_purpose, status, is_admin, created_at')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const handleStatus = async (userId, status) => {
    setActionLoading(userId + status)
    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', userId)
    if (error) setError(error.message)
    else setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u))
    setActionLoading(null)
  }

  const handleDelete = async () => {
    if (!deleteDialog) return
    setActionLoading(deleteDialog.id + 'delete')
    // profiles에서 삭제 (CASCADE로 posts, do_it_now도 삭제됨)
    const { error } = await supabase.from('profiles').delete().eq('id', deleteDialog.id)
    if (error) setError(error.message)
    else setUsers(prev => prev.filter(u => u.id !== deleteDialog.id))
    setActionLoading(null)
    setDeleteDialog(null)
  }

  const pending = users.filter(u => u.status === 'pending')
  const others = users.filter(u => u.status !== 'pending')

  return (
    <Box sx={{ minHeight: '100vh', pb: 6 }}>
      <AppBar position='sticky' elevation={0} sx={{
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(61,127,176,0.15)',
      }}>
        <Toolbar>
          <Tooltip title='게시판으로'>
            <IconButton onClick={() => navigate('/posts')} sx={{ color: 'text.secondary', mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography
            className='pixel-font'
            sx={{ fontSize: '0.65rem', color: '#fbbf24', flexGrow: 1, letterSpacing: '0.05em' }}
          >
            ADMIN
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth='lg' sx={{ pt: 4 }}>
        <Typography variant='h1' sx={{ fontSize: '1.5rem', mb: 1 }}>관리자 페이지</Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary', mb: 4 }}>
          전체 회원 {users.length}명 | 승인 대기 {pending.length}명
        </Typography>

        {error && <Alert severity='error' sx={{ mb: 3 }}>{error}</Alert>}

        {/* 승인 대기 */}
        {pending.length > 0 && (
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3, border: '1px solid rgba(251,191,36,0.3)' }}>
            <Typography variant='h2' sx={{ mb: 2, color: 'warning.main', fontSize: '1rem' }}>
              승인 대기 중 ({pending.length}명)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {pending.map(u => (
                <Box key={u.id} sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {u.full_name} <Typography component='span' sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>@{u.username}</Typography>
                      </Typography>
                      <Typography variant='body2' sx={{ color: 'text.secondary', fontSize: '0.8rem', mt: 0.5 }}>
                        생년월일: {u.birth_date} | 가입일: {formatDate(u.created_at)}
                      </Typography>
                      <Typography variant='body2' sx={{ color: 'text.secondary', mt: 1, fontSize: '0.85rem' }}>
                        가입 목적: {u.join_purpose}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size='small'
                        variant='contained'
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleStatus(u.id, 'approved')}
                        disabled={actionLoading === u.id + 'approved'}
                        color='success'
                        sx={{ fontSize: '0.75rem' }}
                      >
                        승인
                      </Button>
                      <Button
                        size='small'
                        variant='outlined'
                        startIcon={<CancelIcon />}
                        onClick={() => handleStatus(u.id, 'rejected')}
                        disabled={actionLoading === u.id + 'rejected'}
                        color='error'
                        sx={{ fontSize: '0.75rem' }}
                      >
                        거부
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        )}

        {/* 전체 회원 목록 */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant='h2' sx={{ mb: 2, fontSize: '1rem' }}>
            전체 회원
          </Typography>
          {loading ? (
            <Skeleton variant='rounded' height={200} sx={{ bgcolor: 'rgba(61,127,176,0.08)' }} />
          ) : (
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'text.secondary', borderColor: 'rgba(61,127,176,0.15)' }}>아이디</TableCell>
                    <TableCell sx={{ color: 'text.secondary', borderColor: 'rgba(61,127,176,0.15)' }}>이름</TableCell>
                    <TableCell sx={{ color: 'text.secondary', borderColor: 'rgba(61,127,176,0.15)' }}>상태</TableCell>
                    <TableCell sx={{ color: 'text.secondary', borderColor: 'rgba(61,127,176,0.15)' }}>가입일</TableCell>
                    <TableCell sx={{ color: 'text.secondary', borderColor: 'rgba(61,127,176,0.15)' }}>관리</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {others.map(u => (
                    <TableRow key={u.id}>
                      <TableCell sx={{ color: 'text.primary', borderColor: 'rgba(61,127,176,0.08)' }}>
                        @{u.username}
                        {u.is_admin && <Chip label='관리자' size='small' color='warning' sx={{ ml: 1, fontSize: '0.65rem' }} />}
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', borderColor: 'rgba(61,127,176,0.08)' }}>{u.full_name}</TableCell>
                      <TableCell sx={{ borderColor: 'rgba(61,127,176,0.08)' }}>
                        <Chip
                          label={statusLabel[u.status]}
                          size='small'
                          color={statusColor[u.status]}
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem', borderColor: 'rgba(61,127,176,0.08)' }}>
                        {formatDate(u.created_at)}
                      </TableCell>
                      <TableCell sx={{ borderColor: 'rgba(61,127,176,0.08)' }}>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {u.status !== 'approved' && (
                            <Button size='small' color='success' onClick={() => handleStatus(u.id, 'approved')}
                              disabled={u.is_admin || actionLoading === u.id + 'approved'} sx={{ fontSize: '0.7rem', minWidth: 'auto', px: 1 }}>
                              승인
                            </Button>
                          )}
                          {u.status !== 'rejected' && (
                            <Button size='small' color='error' onClick={() => handleStatus(u.id, 'rejected')}
                              disabled={u.is_admin || actionLoading === u.id + 'rejected'} sx={{ fontSize: '0.7rem', minWidth: 'auto', px: 1 }}>
                              거부
                            </Button>
                          )}
                          <IconButton size='small' color='error' onClick={() => setDeleteDialog({ id: u.id, username: u.username })}
                            disabled={u.is_admin} sx={{ p: 0.5 }}>
                            <PersonOffIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}
        PaperProps={{ sx: { bgcolor: 'background.paper', border: '1px solid rgba(61,127,176,0.2)' } }}>
        <DialogTitle>회원 삭제</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>@{deleteDialog?.username}</strong> 회원을 삭제하시겠습니까?<br />
            작성한 게시물도 모두 함께 삭제됩니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)} sx={{ color: 'text.secondary' }}>취소</Button>
          <Button onClick={handleDelete} color='error' variant='contained' disabled={!!actionLoading}>삭제</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminPage
