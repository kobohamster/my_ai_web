import { Link as RouterLink } from 'react-router-dom'
import { Box, Container, Typography, Button, Stack } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineOutlined'

const HeroSection = ({ title, description, bannerImage }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `linear-gradient(180deg, rgba(10,10,14,0.35) 0%, rgba(10,10,14,0.55) 50%, rgba(10,10,14,1) 100%), url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: { xs: '100%', sm: 480, md: 600 } }}>
          <Typography variant="h1" sx={{ fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' }, fontWeight: 700, mb: 2 }}>
            {title}
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, color: 'rgba(255,255,255,0.85)', fontSize: { xs: '0.95rem', md: '1.05rem' } }}
          >
            {description}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              size="large"
              startIcon={<AddCircleOutlineIcon />}
            >
              지금 바로 가입하기
            </Button>
            <Button variant="outlined" size="large" color="inherit" startIcon={<PlayArrowIcon />}>
              예고편 재생하기
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}

export default HeroSection
