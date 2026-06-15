# New Project Guide

## 새 프로젝트 시작하기

### 1. 템플릿 복사

```bash
# lecture1 디렉토리에서 실행
cp -r _template_settings [새프로젝트명]
cd [새프로젝트명]
```

### 2. 패키지 재설치

```bash
npm install
```

### 3. package.json 이름 변경

```json
{
  "name": "새프로젝트명"
}
```

### 4. 개발 서버 시작

```bash
npm run dev
# → http://localhost:5173
```

## 포함된 패키지 목록

| 패키지 | 용도 |
|--------|------|
| `react` + `react-dom` | React 핵심 |
| `react-router-dom` | 페이지 라우팅 |
| `@mui/material` | UI 컴포넌트 |
| `@emotion/react` + `@emotion/styled` | MUI 스타일 엔진 |
| `@mui/icons-material` | MUI 아이콘 |
| `@fontsource/roboto` | Roboto 폰트 |
| `vite` | 빌드 도구 |

## 기본 파일 구조

```
프로젝트명/
├── src/
│   ├── main.jsx        ← ThemeProvider + CssBaseline 적용
│   ├── App.jsx         ← 라우터 설정
│   ├── theme.js        ← MUI 테마 커스터마이징
│   └── index.css       ← 글로벌 스타일
├── index.html
├── vite.config.js
└── package.json
```

## 자주 쓰는 MUI 컴포넌트 예시

```jsx
import { Box, Container, Typography, Button, Grid } from '@mui/material'

const App = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h1">제목</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Button variant="contained">버튼</Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
```

## React Router 기본 설정

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

<BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
  </Routes>
</BrowserRouter>
```
