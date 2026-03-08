import { NextResponse } from 'next/server';
import { generateResumeAI, ResumeInput } from '@/lib/ai';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body: ResumeInput = await req.json();

    if (!body.fullName || !body.email) {
      return NextResponse.json(
        { error: 'Full Name and Email are required.' },
        { status: 400 }
      );
    }

    // Step 1: Generate ATS friendly resume via AI
    const generatedContent = await generateResumeAI(body);

    // Step 2: Save to Supabase
    // If supabase URL or KEY is missing (e.g., local dev without .env), we will just bypass the DB insert seamlessly.
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { data, error } = await supabase
        .from('resumes')
        .insert([
          {
            name: body.fullName,
            email: body.email,
            resume_text: generatedContent,
          },
        ])
        .select()
        .single();
        
      if (error) {
         console.error("Supabase insert error:", error);
         // Don't fail the entire request just because DB insert failed, still return the resume.
      }
    } else {
      console.warn("Supabase credentials missing. Skipping Database insert.");
    }

    // Step 3: Return Generated Output
    return NextResponse.json({ success: true, resume: generatedContent }, { status: 200 });

  } catch (error: any) {
    console.error('API /generate error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
