-- Create a table for storing resumes
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    resume_text JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Recommended: enable row level security, but allow anon inserts for this demo
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to resumes" ON public.resumes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read of resumes" ON public.resumes
    FOR SELECT USING (true);
