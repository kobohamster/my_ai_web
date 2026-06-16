-- ======================================================
-- CHOCORATE 데이터베이스 스키마 (재실행 안전 버전)
-- ======================================================

-- 초콜릿 리뷰 게시물 테이블
create table if not exists choco_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  brand text,
  description text,
  sweetness integer default 50 check (sweetness >= 0 and sweetness <= 100),
  saltiness integer default 50 check (saltiness >= 0 and saltiness <= 100),
  sourness integer default 50 check (sourness >= 0 and sourness <= 100),
  bitterness integer default 50 check (bitterness >= 0 and bitterness <= 100),
  umami integer default 50 check (umami >= 0 and umami <= 100),
  image_url text,
  hashtags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 좋아요 테이블
create table if not exists choco_likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id uuid references choco_posts(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, post_id)
);

-- 북마크 테이블
create table if not exists choco_bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id uuid references choco_posts(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, post_id)
);

-- 댓글 테이블
create table if not exists choco_comments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id uuid references choco_posts(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 체험 일정 테이블
create table if not exists choco_experiences (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  location text not null,
  description text,
  price integer,
  capacity integer,
  event_date date not null,
  event_time text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 체험 예약 테이블
create table if not exists choco_reservations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  experience_id uuid references choco_experiences(id) on delete cascade not null,
  participant_count integer default 1,
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, experience_id)
);

-- ======================================================
-- Row Level Security 활성화
-- ======================================================
alter table choco_posts enable row level security;
alter table choco_likes enable row level security;
alter table choco_bookmarks enable row level security;
alter table choco_comments enable row level security;
alter table choco_experiences enable row level security;
alter table choco_reservations enable row level security;

-- ======================================================
-- 기존 정책 삭제 (재실행 시 충돌 방지)
-- ======================================================
drop policy if exists "게시물 전체 공개" on choco_posts;
drop policy if exists "로그인 사용자 게시물 작성" on choco_posts;
drop policy if exists "작성자 게시물 수정" on choco_posts;
drop policy if exists "작성자 게시물 삭제" on choco_posts;

drop policy if exists "좋아요 전체 공개" on choco_likes;
drop policy if exists "로그인 사용자 좋아요" on choco_likes;
drop policy if exists "좋아요 취소" on choco_likes;

drop policy if exists "내 북마크 조회" on choco_bookmarks;
drop policy if exists "북마크 추가" on choco_bookmarks;
drop policy if exists "북마크 삭제" on choco_bookmarks;

drop policy if exists "댓글 전체 공개" on choco_comments;
drop policy if exists "로그인 사용자 댓글 작성" on choco_comments;
drop policy if exists "댓글 수정" on choco_comments;
drop policy if exists "댓글 삭제" on choco_comments;

drop policy if exists "체험 전체 공개" on choco_experiences;

drop policy if exists "내 예약 조회" on choco_reservations;
drop policy if exists "예약 추가" on choco_reservations;
drop policy if exists "예약 취소" on choco_reservations;

-- ======================================================
-- RLS 정책 생성
-- ======================================================

-- choco_posts
create policy "게시물 전체 공개" on choco_posts for select using (true);
create policy "로그인 사용자 게시물 작성" on choco_posts for insert with check (auth.role() = 'authenticated');
create policy "작성자 게시물 수정" on choco_posts for update using (auth.uid() = user_id);
create policy "작성자 게시물 삭제" on choco_posts for delete using (auth.uid() = user_id);

-- choco_likes
create policy "좋아요 전체 공개" on choco_likes for select using (true);
create policy "로그인 사용자 좋아요" on choco_likes for insert with check (auth.role() = 'authenticated');
create policy "좋아요 취소" on choco_likes for delete using (auth.uid() = user_id);

-- choco_bookmarks
create policy "내 북마크 조회" on choco_bookmarks for select using (auth.uid() = user_id);
create policy "북마크 추가" on choco_bookmarks for insert with check (auth.role() = 'authenticated');
create policy "북마크 삭제" on choco_bookmarks for delete using (auth.uid() = user_id);

-- choco_comments
create policy "댓글 전체 공개" on choco_comments for select using (true);
create policy "로그인 사용자 댓글 작성" on choco_comments for insert with check (auth.role() = 'authenticated');
create policy "댓글 수정" on choco_comments for update using (auth.uid() = user_id);
create policy "댓글 삭제" on choco_comments for delete using (auth.uid() = user_id);

-- choco_experiences
create policy "체험 전체 공개" on choco_experiences for select using (true);

-- choco_reservations
create policy "내 예약 조회" on choco_reservations for select using (auth.uid() = user_id);
create policy "예약 추가" on choco_reservations for insert with check (auth.role() = 'authenticated');
create policy "예약 취소" on choco_reservations for delete using (auth.uid() = user_id);

-- ======================================================
-- 테스트 체험 데이터 삽입 (중복 시 무시)
-- ======================================================
insert into choco_experiences (title, location, description, price, capacity, event_date, event_time) values
  ('부산 초콜릿 공방 체험', '부산 해운대구', '직접 템퍼링부터 몰딩까지! 나만의 초콜릿을 만들어보세요.', 45000, 10, '2026-07-05', '14:00'),
  ('서울 가나아트 초콜릿 워크샵', '서울 종로구', '카카오 농장 이야기와 함께하는 빈투바 초콜릿 체험', 60000, 8, '2026-07-12', '13:00'),
  ('제주 로컬 초콜릿 투어', '제주 서귀포시', '제주 카카오와 현지 재료로 만드는 특별한 초콜릿', 55000, 12, '2026-07-20', '10:00'),
  ('대구 수제 초콜릿 클래스', '대구 중구', '프랄린, 트뤼플, 가나슈 3종 초콜릿 마스터 클래스', 70000, 6, '2026-08-02', '15:00')
on conflict do nothing;
