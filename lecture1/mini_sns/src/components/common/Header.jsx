import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  IconButton, Drawer, List, ListItem, ListItemButton, ListItemText,
  Divider, Avatar,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { label: '홈', path: '/' },
  { label: '품평 목록', path: '/posts' },
  { label: '글쓰기', path: '/posts/create' },
  { label: '체험 예약', path: '/experience' },
  { label: '마이페이지', path: '/mypage' },
]

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleNav = (path) => {
    navigate(path)
    setMobileOpen(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setMobileOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
          borderBottom: '2px solid',
          borderColor: 'secondary.main',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 0.5 }}>
            {/* 모바일 햄버거 */}
            <IconButton
              sx={{ display: { sm: 'none' }, mr: 1 }}
              onClick={() => setMobileOpen(true)}
              aria-label="메뉴 열기"
            >
              <MenuIcon sx={{ color: '#f8edad' }} />
            </IconButton>

            {/* 로고 */}
            <Typography
              variant="h5"
              onClick={() => handleNav('/')}
              sx={{
                cursor: 'pointer',
                color: '#f8edad',
                flexGrow: 1,
                letterSpacing: 2,
                fontStyle: 'italic',
                userSelect: 'none',
              }}
            >
              🍫 CHOCORATE
            </Typography>

            {/* 데스크탑 네비게이션 */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  sx={{
                    color: isActive(item.path) ? 'secondary.light' : '#f8edad',
                    fontWeight: isActive(item.path) ? 700 : 400,
                    borderBottom: isActive(item.path) ? '2px solid' : '2px solid transparent',
                    borderColor: isActive(item.path) ? 'secondary.light' : 'transparent',
                    borderRadius: 0,
                    px: 1.5,
                    '&:hover': { color: '#f8edad', bgcolor: 'rgba(248,237,173,0.1)' },
                  }}
                >
                  {item.label}
                </Button>
              ))}
              {user ? (
                <>
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: 'secondary.main', ml: 1, fontSize: 14 }}
                  >
                    {user.email?.[0]?.toUpperCase()}
                  </Avatar>
                  <Button
                    onClick={handleSignOut}
                    sx={{ color: '#f8edad', ml: 0.5, '&:hover': { bgcolor: 'rgba(248,237,173,0.1)' } }}
                  >
                    로그아웃
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => handleNav('/login')}
                  sx={{
                    color: '#f8edad',
                    borderColor: '#f8edad',
                    ml: 1,
                    '&:hover': { bgcolor: '#f8edad', color: 'primary.main' },
                  }}
                >
                  로그인
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 모바일 드로어 */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280, bgcolor: 'primary.main' } }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ color: '#f8edad', fontStyle: 'italic' }}>
            🍫 CHOCORATE
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon sx={{ color: '#f8edad' }} />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: 'rgba(248,237,173,0.2)' }} />
        <List sx={{ pt: 1 }}>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleNav(item.path)}
                selected={isActive(item.path)}
                sx={{
                  '&.Mui-selected': { bgcolor: 'rgba(202, 28, 29, 0.3)' },
                  '&:hover': { bgcolor: 'rgba(248,237,173,0.1)' },
                }}
              >
                <ListItemText
                  primary={item.label}
                  sx={{ color: '#f8edad', '& .MuiTypography-root': { fontWeight: isActive(item.path) ? 700 : 400 } }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ borderColor: 'rgba(248,237,173,0.2)', mt: 1 }} />
        <Box sx={{ p: 2 }}>
          {user ? (
            <>
              <Typography variant="body2" sx={{ color: 'rgba(248,237,173,0.7)', mb: 1 }}>
                {user.email}
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleSignOut}
                sx={{ color: '#f8edad', borderColor: 'rgba(248,237,173,0.5)' }}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleNav('/login')}
              sx={{ bgcolor: 'secondary.main', color: '#fff', '&:hover': { bgcolor: 'secondary.dark' } }}
            >
              로그인
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  )
}

export default Header
