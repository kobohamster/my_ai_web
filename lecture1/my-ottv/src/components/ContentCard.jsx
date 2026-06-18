import { Card, CardMedia, CardContent, Typography } from '@mui/material'

const ContentCard = ({ title, genre, image }) => {
  return (
    <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <CardMedia component="img" image={image} alt={title} sx={{ aspectRatio: '16 / 9' }} />
      <CardContent>
        <Typography variant="h3" sx={{ fontSize: '1.05rem', mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {genre}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ContentCard
