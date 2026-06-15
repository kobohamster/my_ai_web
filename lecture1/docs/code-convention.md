# Code Convention

## 파일 네이밍

- **컴포넌트**: PascalCase → `MyComponent.jsx`
- **페이지**: PascalCase + Page → `HomePage.jsx`
- **훅**: camelCase + use prefix → `useAuth.js`
- **유틸리티**: camelCase → `formatDate.js`
- **상수**: UPPER_SNAKE_CASE → `API_BASE_URL`

## 디렉토리 구조

```
src/
├── components/     # 재사용 가능한 컴포넌트
│   ├── common/     # 공통 컴포넌트 (Button, Input 등)
│   └── layout/     # 레이아웃 컴포넌트
├── pages/          # 라우트별 페이지 컴포넌트
├── hooks/          # 커스텀 훅
├── utils/          # 유틸리티 함수
├── theme.js        # MUI 테마 설정
└── main.jsx        # 앱 진입점
```

## 컴포넌트 작성 규칙

```jsx
// 화살표 함수 사용
const MyComponent = ({ title, children }) => {
  return (
    <Box>
      <Typography variant="h2">{title}</Typography>
      {children}
    </Box>
  );
};

export default MyComponent;
```

## Import 순서

1. React 관련
2. 외부 라이브러리 (MUI 등)
3. 내부 컴포넌트/훅
4. 유틸리티/상수
5. 스타일

## MUI 사용 규칙

- 레이아웃: `Box`, `Container`, `Grid`
- 타이포그래피: `Typography` (variant 명시)
- 간격: `sx={{ mt: 2, mb: 3 }}` 형식 사용
- 색상: theme 변수 사용 (`primary.main` 등)

## 코딩 스타일

- 들여쓰기: 2 spaces
- 세미콜론: 없음
- 따옴표: 작은따옴표 (`'`)
- 화살표 함수 선호
- `const` 기본 사용, `let` 필요 시만
