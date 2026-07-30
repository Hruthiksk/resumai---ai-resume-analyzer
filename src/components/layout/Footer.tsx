import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-200 font-bold text-sm">ResumAI</span>
          <span className="text-slate-500">•</span>
          <span>Next-Gen ATS Compatibility & AI Career Coach</span>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => setCurrentPage('landing')} className="hover:text-white transition-colors">
            Landing Page
          </button>
          <button onClick={() => setCurrentPage('upload')} className="hover:text-white transition-colors">
            Analyze Resume
          </button>
          <button onClick={() => setCurrentPage('job-match')} className="hover:text-white transition-colors">
            Job Match
          </button>
          <button onClick={() => setCurrentPage('settings')} className="hover:text-white transition-colors">
            Settings
          </button>
        </div>

        <div className="text-slate-500 flex items-center gap-1">
          Built with React, TypeScript & Gemini AI
        </div>
      </div>
    </footer>
  );
};
