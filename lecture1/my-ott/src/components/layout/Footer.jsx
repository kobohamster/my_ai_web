import { Box, Container, Typography, Stack, Link } from '@mui/material'

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 4, bgcolor: 'background.paper', mt: 'auto' }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2026 MY-OTT. All rights reserved.
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
