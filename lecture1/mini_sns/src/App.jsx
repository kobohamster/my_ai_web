import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Header from './components/common/Header'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PostListPage from './pages/PostListPage'
import PostDetailPage from './pages/PostDetailPage'
import PostCreatePage from './pages/PostCreatePage'
import MyPage from './pages/MyPage'
import ExperiencePage from './pages/ExperiencePage'

const App = () => {
  return (
    <BrowserRouter basename="/my_ai_web/chocorate">
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/posts/create" element={<PostCreatePage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
