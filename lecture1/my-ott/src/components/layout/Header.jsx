import { useEffect, useState } from 'react'
import { AppBar, Toolbar, Container, Box, Typography } from '@mui/material'
import TheatersIcon from '@mui/icons-material/Theaters'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: scrolled
          ? 'rgba(11,11,15,0.95)'
          : 'linear-gradient(180deg, rgba(11,11,15,0.85) 0%, rgba(11,11,15,0) 100%)',
        transition: 'background 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TheatersIcon sx={{ color: 'secondary.main', fontSize: 28 }} />
            <Typography
              variant="h3"
              component="span"
              sx={{ fontWeight: 700, letterSpacing: 1, fontSize: '1.4rem' }}
            >
              MY<Box component="span" sx={{ color: 'secondary.main' }}>-OTT</Box>
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
