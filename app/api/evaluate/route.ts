import { NextResponse } from 'next/server';
import { checkATS } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { resumeText, jobDescription } = body;
    
    if (!resumeText) {
       return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
    }

    const { score, feedback } = await checkATS(resumeText, jobDescription);

    return NextResponse.json({ success: true, score, feedback }, { status: 200 });
  } catch (error: any) {
    console.error('API /ats error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
