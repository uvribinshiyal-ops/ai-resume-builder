"use client";

import { useRef } from 'react';
import { Download, Edit2 } from 'lucide-react';
import { GeneratedResume } from '@/lib/ai';
import AtsChecker from './AtsChecker';

interface ResumePreviewProps {
  resume: GeneratedResume;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  onEdit: () => void;
}

export default function ResumePreview({ resume, personalInfo, onEdit }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);

  const resumeText = `
    Name: ${personalInfo.name}
    Email: ${personalInfo.email}
    Phone: ${personalInfo.phone}
    Summary: ${resume.summary}
    Skills: ${resume.skills?.join(', ')}
    Experience: ${resume.experience?.map(e => `${e.role} at ${e.company} (${e.duration}): ${e.description.join(' ')}`).join('\n')}
    Projects: ${resume.projects?.map(p => `${p.name} (${p.technologies.join(', ')}): ${p.description}`).join('\n')}
    Education: ${resume.education?.map(e => `${e.degree} from ${e.institution} (${e.year})`).join('\n')}
    Certifications: ${resume.certifications?.join(', ')}
  `;

  const handleDownloadPDF = async () => {
    if (typeof window !== 'undefined') {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = resumeRef.current;
      const opt = {
        margin: 0.5,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border dark:border-gray-800">
        <h2 className="text-xl font-bold">Your Generated Resume</h2>
        <div className="flex gap-4">
          <button 
            onClick={onEdit} 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <Edit2 className="w-4 h-4" /> Edit Details
          </button>
          <button 
            onClick={handleDownloadPDF} 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      <AtsChecker resumeText={resumeText} />

      <div className="bg-white text-black p-10 md:p-14 rounded-xl shadow-2xl border flex justify-center overflow-x-auto">
        {/* Actual Resume Container - Designed for A4/Letter roughly */}
        <div ref={resumeRef} className="w-full max-w-[800px] bg-white " style={{ minHeight: '1056px', fontFamily: '"Inter", sans-serif' }}>
          
          <div className="border-b-2 border-gray-800 pb-4 mb-6 text-center">
            <h1 className="text-4xl font-extrabold uppercase tracking-wider mb-2 text-gray-900">
              {personalInfo.name}
            </h1>
            <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-700 font-medium">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3 text-gray-800 tracking-widest">Professional Summary</h2>
            <p className="text-sm leading-relaxed text-gray-700">{resume.summary}</p>
          </div>

          {resume.skills && resume.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3 text-gray-800 tracking-widest">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-medium border border-gray-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {resume.experience && resume.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3 text-gray-800 tracking-widest">Experience</h2>
              <div className="space-y-4">
                {resume.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900">{exp.role} <span className="text-gray-600 font-normal">| {exp.company}</span></h3>
                      <span className="text-sm text-gray-600 font-medium italic">{exp.duration}</span>
                    </div>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-gray-700">
                      {exp.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.projects && resume.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3 text-gray-800 tracking-widest">Projects</h2>
              <div className="space-y-4">
                {resume.projects.map((proj, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-gray-900 mb-1">{proj.name}</h3>
                    <p className="text-sm text-gray-700 mb-1">{proj.description}</p>
                    <div className="text-xs text-gray-500 font-medium">Technologies: {proj.technologies.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.education && resume.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3 text-gray-800 tracking-widest">Education</h2>
              <div className="space-y-3">
                {resume.education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <span className="text-sm text-gray-600">{edu.institution}, {edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.certifications && resume.certifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3 text-gray-800 tracking-widest">Certifications</h2>
              <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-gray-700">
                {resume.certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
