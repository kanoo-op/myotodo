-- Supabase에서 실행할 SQL 스키마
-- Supabase 대시보드 > SQL Editor에서 이 쿼리를 실행하세요

-- 기존 테이블과 정책 삭제 (새로 시작하는 경우)
DROP POLICY IF EXISTS "Allow all operations for all users" ON public.todos;
DROP POLICY IF EXISTS "Users can view their own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can insert their own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can update their own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can delete their own todos" ON public.todos;
DROP TABLE IF EXISTS public.todos;

-- todos 테이블 생성 (user_id 포함)
CREATE TABLE public.todos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) 활성화
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 사용자별 데이터 접근 정책
-- 자신의 todos만 조회 가능
CREATE POLICY "Users can view their own todos" ON public.todos
    FOR SELECT
    USING (auth.uid() = user_id);

-- 자신의 todos만 추가 가능
CREATE POLICY "Users can insert their own todos" ON public.todos
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 자신의 todos만 수정 가능
CREATE POLICY "Users can update their own todos" ON public.todos
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 자신의 todos만 삭제 가능
CREATE POLICY "Users can delete their own todos" ON public.todos
    FOR DELETE
    USING (auth.uid() = user_id);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX todos_user_id_idx ON public.todos (user_id);
CREATE INDEX todos_created_at_idx ON public.todos (created_at DESC);
