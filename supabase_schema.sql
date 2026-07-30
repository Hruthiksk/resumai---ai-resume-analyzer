-- Supabase Database Schema SQL for AI Resume Analyzer
-- Execute this SQL script in your Supabase SQL Editor (https://app.supabase.com/project/fxbnrosyxfotvyemflwb/sql)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'USER',
  target_role TEXT DEFAULT 'Senior Full Stack Engineer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Resumes Table
CREATE TABLE IF NOT EXISTS public.resumes (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size TEXT NOT NULL,
  file_path TEXT,
  parsed_text TEXT,
  job_title TEXT,
  version_number INT DEFAULT 1,
  latest_ats_score INT DEFAULT 80,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Analysis Reports Table
CREATE TABLE IF NOT EXISTS public.analysis_reports (
  id TEXT PRIMARY KEY,
  resume_id TEXT REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  job_description TEXT,
  ats_score INT NOT NULL,
  breakdown JSONB,
  keyword_analysis JSONB,
  grammar_issues JSONB,
  formatting_feedback JSONB,
  skills_gap JSONB,
  strengths JSONB,
  weaknesses JSONB,
  suggestions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ai_model_used TEXT DEFAULT 'gemini-3.6-flash'
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_reports ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies
-- Profiles Policies
DROP POLICY IF EXISTS "Public profile reading" ON public.profiles;
CREATE POLICY "Public profile reading" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

-- Resumes Policies
DROP POLICY IF EXISTS "Users can manage own resumes" ON public.resumes;
CREATE POLICY "Users can manage own resumes" ON public.resumes FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- Analysis Reports Policies
DROP POLICY IF EXISTS "Users can manage own reports" ON public.analysis_reports;
CREATE POLICY "Users can manage own reports" ON public.analysis_reports FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- 7. Storage Bucket Setup for Resume Files
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public storage access" ON storage.objects;
CREATE POLICY "Public storage access" ON storage.objects FOR ALL USING (bucket_id = 'resumes');
