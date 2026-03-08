export interface ResumeInput {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  skills: string;
  experience: string;
  projects: string;
  education: string;
  certifications: string;
}

export interface GeneratedResume {
  summary: string;
  skills: string[];
  experience: { role: string; company: string; duration: string; description: string[] }[];
  projects: { name: string; description: string; technologies: string[] }[];
  education: { degree: string; institution: string; year: string }[];
  certifications: string[];
}

export async function generateResumeAI(input: ResumeInput): Promise<GeneratedResume> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not defined');
  }

  const prompt = `
    Act as a professional resume writer and ATS optimizer.
    Convert the following user details into a highly professional, beautifully formatted, ATS-friendly resume.
    
    User details:
    Full Name: ${input.fullName}
    Email: ${input.email}
    Phone: ${input.phone}
    Summary: ${input.summary}
    Skills: ${input.skills}
    Experience: ${input.experience}
    Projects: ${input.projects}
    Education: ${input.education}
    Certifications: ${input.certifications}

    Return the result strictly as a JSON object matching this TypeScript interface. 
    Ensure the JSON is valid and does not contain markdown backticks unless wrapping the raw JSON.
    Provide actionable, polished bullet points for experience and projects.

    interface GeneratedResume {
      summary: string;
      skills: string[];
      experience: { role: string; company: string; duration: string; description: string[] }[];
      projects: { name: string; description: string; technologies: string[] }[];
      education: { degree: string; institution: string; year: string }[];
      certifications: string[];
    }
  `;

  const requestBody = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are a professional resume writer that outputs ONLY valid JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  };

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Groq Error:", err);
    throw new Error(`AI generation failed: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  try {
     return JSON.parse(content) as GeneratedResume;
  } catch(e) {
     console.error("Failed to parse JSON:", content);
     throw new Error("AI returned invalid JSON format.");
  }
}

export interface AtsResponse {
  score: number;
  feedback: string[];
}

export async function checkATS(resumeText: string, jobDescription?: string): Promise<AtsResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not defined');
  }

  const prompt = `
    Act as an expert ATS (Applicant Tracking System) software and technical recruiter.
    Evaluate the following resume text. 
    ${jobDescription ? `Compare it against this Job Description:\n${jobDescription}\n` : ''}
    
    Resume Text:
    ${resumeText}
    
    Provide an ATS match score from 0 to 100 based on standard ATS parsing rules, keyword matching, length, and impact.
    Provide a list of concise, actionable feedback points (e.g., missing keywords, formatting tips, impact metrics).
    
    Return the result strictly as a JSON object matching this TypeScript interface:
    interface AtsResponse {
      score: number; // 0 to 100
      feedback: string[];
    }
    
    Ensure the JSON is valid and does not contain markdown backticks unless wrapping the raw JSON.
  `;

  const requestBody = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an ATS evaluation system that outputs ONLY valid JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' }
  };

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error('Failed to evaluate ATS score');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  try {
     return JSON.parse(content) as AtsResponse;
  } catch(e) {
     throw new Error("AI returned invalid JSON format for ATS check.");
  }
}
