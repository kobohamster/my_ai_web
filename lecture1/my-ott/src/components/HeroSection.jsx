import { Box, Container, Typography, Button, Stack } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

const HeroSection = ({ title, description, bannerImage }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 420, md: 560 },
        display: 'flex',
        alignItems: 'flex-end',
        backgroundImage: `linear-gradient(180deg, rgba(11,11,15,0.2) 0%, rgba(11,11,15,0.95) 100%), url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="lg" sx={{ pb: { xs: 4, md: 6 } }}>
        <Typography variant="h1" sx={{ fontSize: { xs: '1.8rem', md: '2.125rem' }, mb: 2 }}>
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{ maxWidth: 560, mb: 3, color: 'rgba(255,255,255,0.85)' }}
        >
          {description}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant="contained" size="large" startIcon={<PlayArrowIcon />}>
            보러가기
          </Button>
          <Button variant="outlined" size="large" color="inherit" startIcon={<InfoOutlinedIcon />}>
            예고편 보기
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}

export default HeroSection
