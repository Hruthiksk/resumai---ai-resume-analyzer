import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Sparkles, Copy, Printer, ArrowRight, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export const CoverLetterPage: React.FC = () => {
  const { activeResume, reports, showToast, addAiLog } = useApp();

  const [companyName, setCompanyName] = useState('Stripe');
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Engineer');
  const [tone, setTone] = useState('Professional & Confident');
  const [jobDescription, setJobDescription] = useState('Building high-scale developer platform payments APIs and React dashboards.');

  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: activeResume?.parsedText,
          jobTitle,
          companyName,
          jobDescription,
          tone,
        }),
      });

      const data = await res.json();
      setGeneratedLetter(data.coverLetter || '');

      addAiLog({
        id: 'log_' + Date.now(),
        userEmail: 'user@resumai.io',
        endpoint: '/api/cover-letter',
        modelUsed: 'gemini-3.6-flash',
        tokensUsed: 1100,
        costEstimate: 0.00033,
        status: 'SUCCESS',
        createdAt: new Date().toISOString(),
      });

      showToast('Cover letter generated successfully!');
    } catch (err) {
      showToast('Failed to generate cover letter', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    showToast('Cover letter copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <FileText className="w-8 h-8 text-indigo-400" />
          AI Cover Letter Generator
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Generate a tailored, highly compelling cover letter synchronized with your active resume and target company.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Generation Parameters
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Stripe, Google, Acme Corp"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Senior Full Stack Engineer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Writing Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Professional & Confident">Professional & Confident</option>
              <option value="Energetic & Passionate">Energetic & Passionate</option>
              <option value="Executive & Strategic">Executive & Strategic</option>
              <option value="Creative & Bold">Creative & Bold</option>
              <option value="Concise & Direct">Concise & Direct</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Job Description Snippet</label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate Cover Letter
          </button>
        </div>

        {/* Live Output Editor */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h2 className="text-sm font-bold text-white">Cover Letter Preview</h2>
              {generatedLetter && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    title="Print / Export PDF"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {generatedLetter ? (
              <textarea
                rows={16}
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm text-slate-200 leading-relaxed font-sans focus:outline-none focus:border-indigo-500 custom-scrollbar"
              />
            ) : (
              <div className="py-20 text-center text-slate-500 space-y-3 border-2 border-dashed border-slate-800 rounded-2xl">
                <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm">Click "Generate Cover Letter" to produce a tailored application letter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
