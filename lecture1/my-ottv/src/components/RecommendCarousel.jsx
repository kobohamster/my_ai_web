import { useRef } from 'react'
import { Box, Container, Typography, IconButton } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const RecommendCarousel = ({ items }) => {
  const trackRef = useRef(null)

  const scrollByAmount = (direction) => {
    trackRef.current?.scrollBy({ left: direction * 480, behavior: 'smooth' })
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h2">지금 뜨는 콘텐츠</Typography>
          <Box>
            <IconButton onClick={() => scrollByAmount(-1)} aria-label="이전">
              <ChevronLeftIcon />
            </IconButton>
            <IconButton onClick={() => scrollByAmount(1)} aria-label="다음">
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>
        <Box
          ref={trackRef}
          className="carousel-track"
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            pb: 1,
          }}
        >
          {items.map((item) => (
            <Box
              key={item.id}
              sx={{
                position: 'relative',
                flex: '0 0 auto',
                width: { xs: 140, sm: 170, md: 190 },
                scrollSnapAlign: 'start',
                borderRadius: 2,
                overflow: 'hidden',
                aspectRatio: '2 / 3',
              }}
            >
              <Box
                component="img"
                src={item.image}
                alt={item.title}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 45%)',
                }}
              />
              <Typography
                sx={{
                  position: 'absolute',
                  left: 8,
                  bottom: -6,
                  fontSize: { xs: '3.5rem', md: '4.5rem' },
                  fontWeight: 800,
                  lineHeight: 1,
                  color: 'transparent',
                  WebkitTextStroke: '2px rgba(255,255,255,0.9)',
                }}
              >
                {item.rank}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

export default RecommendCarousel
