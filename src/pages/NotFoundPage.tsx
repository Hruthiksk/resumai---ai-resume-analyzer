import React from 'react';
import { useApp } from '../context/AppContext';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 text-center">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-4xl font-black text-white">404</h1>
          <h2 className="text-lg font-bold text-slate-200 mt-1">Page Not Found</h2>
          <p className="text-slate-400 text-xs mt-2">
            The workspace route or resource you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
