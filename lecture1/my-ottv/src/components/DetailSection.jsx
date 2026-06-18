import { Box, Container, Grid, Typography, Chip, Stack, Paper } from '@mui/material'
import DevicesIcon from '@mui/icons-material/Devices'
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline'
import GroupsIcon from '@mui/icons-material/Groups'
import HighQualityIcon from '@mui/icons-material/HighQuality'

const iconMap = {
  Devices: DevicesIcon,
  DownloadForOffline: DownloadForOfflineIcon,
  Groups: GroupsIcon,
  HighQuality: HighQualityIcon,
}

const DetailSection = ({ title, description, meta, bannerImage, services }) => {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 3 }}>
          상세 소개
        </Typography>
        <Grid container spacing={4} sx={{ alignItems: 'center', mb: { xs: 5, md: 7 } }}>
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

        <Typography variant="h3" sx={{ mb: 3 }}>
          MOV가 제공하는 서비스
        </Typography>
        <Grid container spacing={3}>
          {services.map((service) => {
            const Icon = iconMap[service.icon]
            return (
              <Grid key={service.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  variant="outlined"
                  sx={{ p: 3, height: '100%', textAlign: 'center', bgcolor: 'background.paper' }}
                >
                  <Icon color="primary" sx={{ fontSize: 40, mb: 1.5 }} />
                  <Typography variant="h3" sx={{ fontSize: '1.05rem', mb: 1 }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </Paper>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </Box>
  )
}

export default DetailSection
