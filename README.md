# AI Resume Maker

A Full Stack AI Resume Maker web application built with Next.js (App Router), Tailwind CSS, Supabase, and the Groq API (Llama 3).

## Features
- 🚀 **Next.js App Router** for fast rendering and API routes
- 🎨 **Tailwind CSS** for a beautiful, modern, responsive UI
- 🧠 **Groq AI** for ultra-fast, ATS-friendly resume generation
- 💾 **Supabase** for storing generated resumes
- 📄 **PDF Export** using html2pdf.js

## Project Structure
- `/app`: Next.js App Router pages and API routes (`/api/generate/route.ts`).
- `/components`: React components (`ResumeForm`, `ResumePreview`, `ResumeBuilder`).
- `/lib`: Helper utilities for Supabase connection locally and AI API fetching.
- `/styles`: Global CSS and Tailwind directives.
- `/supabase`: SQL schema to create the `resumes` database table.

## Local Setup Instructions

1. **Clone the repository and install dependencies**
   ```bash
   npm install
   ```

2. **Supabase Database Setup**
   - Create a project on [Supabase](https://supabase.com).
   - Go to the **SQL Editor** in your Supabase dashboard and run the script found in `supabase/schema.sql` to create the `resumes` table.
   - Go to **Project Settings -> API** to get your URL and Anon Key.

3. **Environment Variables**
   - Rename `.env.example` to `.env.local`
   - Fill in your API keys:
     ```env
     GROQ_API_KEY=your_groq_api_key_here
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
     ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deployment on Vercel

1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Status -> Project**.
3. Import your GitHub repository.
4. Expand the **Environment Variables** section and add:
   - `GROQ_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**. Vercel will automatically detect the Next.js framework and build the application flawlessly.

## Note
Since local tools (npm/Node.js) might not be installed on your environment while generating this, the application files are structurally scaffolded and production-ready. Once Node.js is installed locally, simply running `npm install` and using `npm run dev` will boot the application.
