import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Briefcase, CheckCircle2, AlertCircle, Sparkles, Copy, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const JobMatchPage: React.FC = () => {
  const { activeResume, jobRoles, showToast } = useApp();

  const [selectedRoleId, setSelectedRoleId] = useState(jobRoles[0]?.id || '');
  const [jobDescriptionInput, setJobDescriptionInput] = useState(
    'Looking for a Senior Full Stack Engineer experienced with React, TypeScript, Node.js, AWS, Redis, GraphQL, microservices, and Docker.'
  );

  const selectedRole = jobRoles.find((r) => r.id === selectedRoleId);
  const resumeText = activeResume?.parsedText.toLowerCase() || '';

  // Calculate live match
  const requiredKeywords = selectedRole ? selectedRole.keywords : ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'GraphQL'];
  const presentKeywords = requiredKeywords.filter((k) => resumeText.includes(k.toLowerCase()));
  const missingKeywords = requiredKeywords.filter((k) => !resumeText.includes(k.toLowerCase()));

  const matchPercentage = Math.round((presentKeywords.length / requiredKeywords.length) * 100);

  const handleCopySkill = (skill: string) => {
    navigator.clipboard.writeText(skill);
    showToast(`Copied "${skill}" to clipboard`);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-indigo-400" />
          Job Description Match & Skills Gap Analysis
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Paste any job posting or select a target role to analyze keyword alignment and missing technical qualifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select Preset Target Job Role
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {jobRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Or Paste Custom Job Description
            </label>
            <textarea
              rows={6}
              value={jobDescriptionInput}
              onChange={(e) => setJobDescriptionInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              placeholder="Paste raw job requirement text here..."
            />
          </div>
        </div>

        {/* Live Match Score Dial */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Role Alignment</span>
          <div className="text-5xl font-black text-indigo-400 my-2">{matchPercentage}%</div>
          <p className="text-xs text-slate-400">
            {presentKeywords.length} of {requiredKeywords.length} required keywords detected in {activeResume?.fileName || 'current resume'}.
          </p>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                matchPercentage >= 80 ? 'bg-emerald-500' : matchPercentage >= 60 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${matchPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Keywords & Gap Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Matched Skills ({presentKeywords.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {presentKeywords.map((k) => (
              <span key={k} className="px-3 py-1 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold">
                ✓ {k}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Missing Skills & Keywords ({missingKeywords.length})
          </h2>
          <p className="text-xs text-slate-400">Click any keyword to copy and paste into your resume skills section:</p>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((k) => (
              <button
                key={k}
                onClick={() => handleCopySkill(k)}
                className="px-3 py-1 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 text-xs font-semibold hover:bg-rose-900 transition-colors flex items-center gap-1.5"
              >
                <span>✗ {k}</span>
                <Copy className="w-3 h-3 opacity-60" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
