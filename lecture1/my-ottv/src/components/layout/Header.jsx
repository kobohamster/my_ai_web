import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { AppBar, Toolbar, Container, Box, Typography, Button, IconButton } from '@mui/material'
import LanguageIcon from '@mui/icons-material/Language'

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
          ? 'rgba(10,10,14,0.95)'
          : 'linear-gradient(180deg, rgba(10,10,14,0.85) 0%, rgba(10,10,14,0) 100%)',
        transition: 'background 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}
        >
          <Box />
          <Typography
            component={RouterLink}
            to="/"
            variant="h3"
            sx={{
              fontWeight: 800,
              letterSpacing: 2,
              fontSize: '1.6rem',
              color: 'common.white',
              textDecoration: 'none',
            }}
          >
            MOV
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" aria-label="언어 설정" size="small">
              <LanguageIcon />
            </IconButton>
            <Button component={RouterLink} to="/login" variant="outlined" color="inherit" size="small">
              로그인하기
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
