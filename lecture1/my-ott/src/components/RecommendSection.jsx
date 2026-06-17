import { Box, Container, Typography, Grid } from '@mui/material'
import ContentCard from './ContentCard.jsx'

const RecommendSection = ({ items }) => {
  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 3 }}>
          추천 콘텐츠
        </Typography>
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <ContentCard title={item.title} genre={item.genre} image={item.image} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default RecommendSection
