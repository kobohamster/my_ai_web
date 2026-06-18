import { Link as RouterLink } from 'react-router-dom'
import { Box, Container, Grid, Paper, Typography, Button, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const MembershipBanner = ({ plans }) => {
  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 0.5, textAlign: 'center' }}>
          멤버십 플랜 가격
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          나에게 맞는 요금제를 선택하고 모든 콘텐츠를 즐겨보세요.
        </Typography>
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {plans.map((plan) => (
            <Grid key={plan.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  height: '100%',
                  borderColor: plan.highlighted ? 'primary.main' : 'divider',
                  borderWidth: plan.highlighted ? 2 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                }}
              >
                <Typography variant="h3">{plan.name}</Typography>
                <Typography variant="h2" sx={{ color: 'primary.light' }}>
                  {plan.price}
                  <Typography component="span" variant="body2" color="text.secondary">
                    {' '}/ 월
                  </Typography>
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                  <CheckCircleIcon color="primary" fontSize="small" sx={{ mt: 0.3 }} />
                  <Typography variant="body2" color="text.secondary">
                    {plan.description}
                  </Typography>
                </Stack>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant={plan.highlighted ? 'contained' : 'outlined'}
                  sx={{ mt: 'auto' }}
                >
                  플랜 선택하기
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default MembershipBanner
