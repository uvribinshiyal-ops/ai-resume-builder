"use client";

import { useState } from 'react';
import { Target, Loader2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface AtsCheckerProps {
  resumeText: string;
}

export default function AtsChecker({ resumeText }: AtsCheckerProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to check ATS score');
      
      setResult({ score: data.score, feedback: data.feedback });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getColorByScore = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
      {/* Header / Toggle */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">ATS Score Checker</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Analyze your resume formatting and keyword match</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {result && !isExpanded && (
            <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs font-semibold uppercase text-slate-500">Score:</span>
              <span className={`font-bold ${getColorByScore(result.score)}`}>{result.score}/100</span>
            </div>
          )}
          {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
        </div>
      </div>

      {/* Expanded Content */}
      <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <div className="p-4 pt-0 border-t border-slate-200 dark:border-slate-800 mt-2">
          
          <div className="mt-4 mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Target Job Description <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-900 dark:text-slate-100 transition-shadow min-h-[100px] resize-y"
              placeholder="Paste the job description here to see how well your generated resume matches..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <button
            onClick={handleCheck}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
            {loading ? 'Analyzing Resume...' : 'Analyze Resume'}
          </button>

          {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800/30">
              {error}
            </div>
          )}

          {result && !loading && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                
                {/* Score Circular Display */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm min-w-[200px]">
                  <div className="relative h-32 w-32 flex items-center justify-center">
                    <svg className="absolute inset-0 h-full w-full transform -rotate-90">
                      <circle cx="64" cy="64" r="56" className="text-slate-200 dark:text-slate-700 stroke-current" strokeWidth="10" fill="transparent" />
                      <circle 
                        cx="64" 
                        cy="64" 
                        r="56" 
                        className={`${getColorByScore(result.score)} stroke-current transition-all duration-1000 ease-out`} 
                        strokeWidth="10" 
                        fill="transparent" 
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - result.score / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{result.score}</span>
                      <span className="text-xs font-semibold uppercase text-slate-500">/ 100</span>
                    </div>
                  </div>
                  <span className={`mt-4 font-bold ${getColorByScore(result.score)}`}>
                    {result.score >= 80 ? 'Excellent Match' : result.score >= 60 ? 'Good Potential' : 'Needs Work'}
                  </span>
                </div>

                {/* Feedback List */}
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">Analysis & Feedback</h4>
                  <ul className="space-y-3">
                    {result.feedback.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
