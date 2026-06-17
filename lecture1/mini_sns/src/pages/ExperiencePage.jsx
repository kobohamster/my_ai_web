import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container, Box, Typography, Grid, Card, CardContent,
  CardMedia, Button, Chip, Stack, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, CircularProgress,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import GroupIcon from '@mui/icons-material/Group'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const EXPERIENCE_IMAGES = [
  'https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=600&h=300&fit=crop',
  'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522252234503-e356532cafd5?w=600&h=300&fit=crop',
  'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&h=300&fit=crop',
]

const ExperiencePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [experiences, setExperiences] = useState([])
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialog, setDialog] = useState({ open: false, experience: null })
  const [participants, setParticipants] = useState(1)
  const [message, setMessage] = useState('')
  const [reserving, setReserving] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchExperiences()
    if (user) fetchReservations()
  }, [user])

  const fetchExperiences = async () => {
    const { data } = await supabase.from('choco_experiences').select('*').order('event_date')
    if (data) setExperiences(data)
    setLoading(false)
  }

  const fetchReservations = async () => {
    const { data } = await supabase.from('choco_reservations').select('experience_id').eq('user_id', user.id)
    if (data) setReservations(data.map(r => r.experience_id))
  }

  const handleReserve = async () => {
    if (!user) { navigate('/login'); return }
    setReserving(true)
    const { error } = await supabase.from('choco_reservations').insert({
      user_id: user.id,
      experience_id: dialog.experience.id,
      participant_count: participants,
      message: message.trim() || null,
    })
    setReserving(false)
    if (!error) {
      setReservations(prev => [...prev, dialog.experience.id])
      setSuccess(`"${dialog.experience.title}" 예약이 완료되었습니다!`)
      setDialog({ open: false, experience: null })
      setParticipants(1)
      setMessage('')
    }
  }

  const isReserved = (id) => reservations.includes(id)

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)', pb: 8 }}>
      {/* 헤더 */}
      <Box sx={{ bgcolor: 'primary.main', py: 6, textAlign: 'center', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'repeating-linear-gradient(90deg, #ca1c1d 0px, #ca1c1d 20px, #422b21 20px, #422b21 40px)' }} />
        <Typography variant="h3" sx={{ color: '#f8edad', mb: 1 }}>🎪 초콜릿 체험 예약</Typography>
        <Typography variant="body1" sx={{ color: 'rgba(248,237,173,0.7)', fontFamily: '"Pretendard Variable", "Noto Sans KR", sans-serif' }}>
          전국 초콜릿 공방 체험 일정을 한눈에
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 5 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* 일정 테이블 형식 헤더 */}
        <Box
          sx={{
            display: { xs: 'none', md: 'grid' },
            gridTemplateColumns: '2fr 1.2fr 1fr 0.8fr 0.8fr 1fr',
            gap: 2, px: 3, py: 1.5,
            bgcolor: 'primary.main', borderRadius: 2, mb: 2,
          }}
        >
          {['체험명', '장소', '날짜', '시간', '정원', '예약'].map(h => (
            <Typography key={h} variant="body2" sx={{ color: '#f8edad', fontWeight: 700 }}>{h}</Typography>
          ))}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </Box>
        ) : (
          <Stack spacing={2}>
            {experiences.map((exp, idx) => (
              <Card key={exp.id} sx={{ border: '1px solid rgba(66,43,33,0.12)', overflow: 'hidden' }}>
                {/* 모바일 뷰 */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                  <CardMedia
                    component="img" height="160"
                    image={exp.image_url || EXPERIENCE_IMAGES[idx % EXPERIENCE_IMAGES.length]}
                    alt={exp.title}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>{exp.title}</Typography>
                    <Stack spacing={0.5} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <LocationOnIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                        <Typography variant="body2">{exp.location}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <CalendarTodayIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                        <Typography variant="body2">{new Date(exp.event_date).toLocaleDateString('ko-KR')}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <AccessTimeIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                        <Typography variant="body2">{exp.event_time}</Typography>
                      </Box>
                    </Stack>
                    {exp.price && (
                      <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>
                        {exp.price.toLocaleString()}원/인
                      </Typography>
                    )}
                    <Button
                      fullWidth variant={isReserved(exp.id) ? 'outlined' : 'contained'}
                      disabled={isReserved(exp.id)}
                      onClick={() => setDialog({ open: true, experience: exp })}
                      sx={isReserved(exp.id)
                        ? { borderColor: 'success.main', color: 'success.main' }
                        : { bgcolor: 'primary.main', color: '#f8edad' }
                      }
                    >
                      {isReserved(exp.id) ? '✓ 예약완료' : '예약하기'}
                    </Button>
                  </CardContent>
                </Box>

                {/* 데스크탑 테이블 뷰 */}
                <Box
                  sx={{
                    display: { xs: 'none', md: 'grid' },
                    gridTemplateColumns: '2fr 1.2fr 1fr 0.8fr 0.8fr 1fr',
                    gap: 2, px: 3, py: 2.5, alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 700 }}>{exp.title}</Typography>
                    {exp.description && (
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }} noWrap>{exp.description}</Typography>
                    )}
                    {exp.price && (
                      <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 600, mt: 0.5 }}>
                        {exp.price.toLocaleString()}원/인
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                    <Typography variant="body2">{exp.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarTodayIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                    <Typography variant="body2">
                      {new Date(exp.event_date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                    <Typography variant="body2">{exp.event_time}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <GroupIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                    <Typography variant="body2">{exp.capacity}명</Typography>
                  </Box>
                  <Button
                    variant={isReserved(exp.id) ? 'outlined' : 'contained'}
                    size="small"
                    disabled={isReserved(exp.id)}
                    onClick={() => setDialog({ open: true, experience: exp })}
                    sx={isReserved(exp.id)
                      ? { borderColor: 'success.main', color: 'success.main' }
                      : { bgcolor: 'primary.main', color: '#f8edad', '&:hover': { bgcolor: 'primary.dark' } }
                    }
                  >
                    {isReserved(exp.id) ? '✓ 예약완료' : '예약하기'}
                  </Button>
                </Box>
              </Card>
            ))}
          </Stack>
        )}
      </Container>

      {/* 예약 다이얼로그 */}
      <Dialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, experience: null })}
        maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ color: 'primary.main' }}>
          🎪 {dialog.experience?.title} 예약
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              📅 {dialog.experience?.event_date && new Date(dialog.experience.event_date).toLocaleDateString('ko-KR')} {dialog.experience?.event_time}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              📍 {dialog.experience?.location}
            </Typography>
            {dialog.experience?.price && (
              <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 700, mt: 0.5 }}>
                {dialog.experience.price.toLocaleString()}원/인
              </Typography>
            )}
          </Box>
          <TextField
            fullWidth label="참가 인원" type="number"
            value={participants}
            onChange={(e) => setParticipants(Math.max(1, Math.min(dialog.experience?.capacity || 10, Number(e.target.value))))}
            inputProps={{ min: 1, max: dialog.experience?.capacity || 10 }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth multiline rows={3}
            label="요청사항 (선택)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="알레르기, 특별 요청 등..."
          />
          {dialog.experience?.price && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(248,237,173,0.5)', borderRadius: 2 }}>
              <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 700 }}>
                예상 결제금액: {(dialog.experience.price * participants).toLocaleString()}원
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialog({ open: false, experience: null })}>취소</Button>
          {user ? (
            <Button
              variant="contained" onClick={handleReserve} disabled={reserving}
              sx={{ bgcolor: 'primary.main', color: '#f8edad' }}
            >
              {reserving ? <CircularProgress size={20} sx={{ color: '#f8edad' }} /> : '예약 확정'}
            </Button>
          ) : (
            <Button variant="contained" onClick={() => navigate('/login')} sx={{ bgcolor: 'primary.main', color: '#f8edad' }}>
              로그인 후 예약
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ExperiencePage
