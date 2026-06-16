import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PostListPage from './pages/PostListPage'
import PostCreatePage from './pages/PostCreatePage'
import PostDetailPage from './pages/PostDetailPage'
import AdminPage from './pages/AdminPage'

const App = () => {
  return (
    <AuthProvider>
      <div className='dawn-bg' />
      <div className='dawn-horizon' />
      <HashRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/posts' element={
            <ProtectedRoute>
              <PostListPage />
            </ProtectedRoute>
          } />
          <Route path='/posts/new' element={
            <ProtectedRoute>
              <PostCreatePage />
            </ProtectedRoute>
          } />
          <Route path='/posts/:id' element={
            <ProtectedRoute>
              <PostDetailPage />
            </ProtectedRoute>
          } />
          <Route path='/admin' element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          } />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}

export default App
