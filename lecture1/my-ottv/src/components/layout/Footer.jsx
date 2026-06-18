import { Link as RouterLink } from 'react-router-dom'
import { Box, Container, Typography, Stack, Link, Button } from '@mui/material'

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', mt: 'auto' }}>
      <Box sx={{ py: { xs: 5, md: 7 }, textAlign: 'center', bgcolor: 'rgba(25,118,210,0.08)' }}>
        <Container maxWidth="sm">
          <Typography variant="h2" sx={{ mb: 1.5 }}>
            지금 가입하고 모든 콘텐츠를 무제한으로
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            언제 어디서든, 좋아하는 콘텐츠를 자유롭게 만나보세요.
          </Typography>
          <Button component={RouterLink} to="/login" variant="contained" size="large">
            지금 바로 가입하기
          </Button>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2026 MOV. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link href="#" underline="hover" color="text.secondary" variant="body2">
              이용약관
            </Link>
            <Link href="#" underline="hover" color="text.secondary" variant="body2">
              개인정보처리방침
            </Link>
            <Link href="#" underline="hover" color="text.secondary" variant="body2">
              고객센터
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer
