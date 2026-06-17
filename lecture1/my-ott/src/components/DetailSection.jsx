import { Box, Container, Grid, Typography, Chip, Stack } from '@mui/material'

const DetailSection = ({ title, description, meta, bannerImage }) => {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 3 }}>
          상세 소개
        </Typography>
        <Grid container spacing={4} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={bannerImage}
              alt={title}
              sx={{ width: '100%', borderRadius: 2, aspectRatio: '16 / 9', objectFit: 'cover' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {description}
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              <Chip label={meta.releaseDate} />
              <Chip label={meta.rating} />
              <Chip label={meta.genre} />
              <Chip label={meta.runtime} />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default DetailSection
