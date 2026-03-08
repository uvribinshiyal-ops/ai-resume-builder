import ResumeBuilder from '@/components/ResumeBuilder';

export default function BuilderPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <header className="mb-8 text-center max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          AI Resume Maker
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Enter your details below and let AI craft an ATS-friendly, professional resume in seconds.
        </p>
      </header>

      <div className="w-full max-w-7xl pt-4">
        <ResumeBuilder />
      </div>
    </main>
  );
}
