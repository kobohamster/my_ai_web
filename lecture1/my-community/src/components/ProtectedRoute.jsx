import { Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#4a90d9' }} />
      </Box>
    )
  }

  if (!user || !profile) return <Navigate to='/' replace />
  if (profile.status !== 'approved') return <Navigate to='/' replace />
  if (requireAdmin && !profile.is_admin) return <Navigate to='/posts' replace />

  return children
}

export default ProtectedRoute
