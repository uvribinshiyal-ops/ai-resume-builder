import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ResumeInput } from '@/lib/ai';

interface ResumeFormProps {
  onSubmit: (data: ResumeInput) => void;
  isLoading: boolean;
}

export default function ResumeForm({ onSubmit, isLoading }: ResumeFormProps) {
  const [formData, setFormData] = useState<ResumeInput>({
    fullName: '',
    email: '',
    phone: '',
    summary: '',
    skills: '',
    experience: '',
    projects: '',
    education: '',
    certifications: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-3xl shadow-xl p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Full Name *</label>
          <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Email *</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="john@example.com" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Phone</label>
          <input name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="+1 234 567 8900" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold mb-2">Professional Summary</label>
        <textarea name="summary" value={formData.summary} onChange={handleChange} rows={3} className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="A brief overview of your career goals and profile..." />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Skills (comma separated)</label>
        <textarea name="skills" value={formData.skills} onChange={handleChange} rows={2} className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="React, Node.js, Python, Project Management..." />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Work Experience</label>
        <textarea name="experience" value={formData.experience} onChange={handleChange} rows={4} className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="E.g., Software Engineer at Acme Corp (2020-2023). Built scalable web apps..." />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Projects</label>
        <textarea name="projects" value={formData.projects} onChange={handleChange} rows={3} className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="E.g., E-commerce Platform: Built using Next.js and Stripe..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Education</label>
          <textarea name="education" value={formData.education} onChange={handleChange} rows={3} className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="B.S. Computer Science, University of Technology, 2020" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Certifications</label>
          <textarea name="certifications" value={formData.certifications} onChange={handleChange} rows={3} className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="AWS Certified Solutions Architect, 2022" />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          type="submit" 
          disabled={isLoading}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Generating ✨
            </>
          ) : (
             "Generate AI Resume ✨"
          )}
        </button>
      </div>
    </form>
  );
}
