"use client";

import { useState } from 'react';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import { ResumeInput, GeneratedResume } from '@/lib/ai';

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<GeneratedResume | null>(null);
  const [inputData, setInputData] = useState<ResumeInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (input: ResumeInput) => {
    setIsLoading(true);
    setError(null);
    setInputData(input);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate resume');
      }

      setResumeData(data.resume);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setResumeData(null);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {error && (
        <div className="mb-6 p-4 w-full max-w-4xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {!resumeData || !inputData ? (
        <ResumeForm onSubmit={handleGenerate} isLoading={isLoading} />
      ) : (
        <ResumePreview 
          resume={resumeData} 
          personalInfo={{
            name: inputData.fullName,
            email: inputData.email,
            phone: inputData.phone,
          }}
          onEdit={handleEdit} 
        />
      )}
    </div>
  );
}
