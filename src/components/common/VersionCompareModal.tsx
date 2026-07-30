import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ArrowRight, TrendingUp, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface VersionCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionCompareModal: React.FC<VersionCompareModalProps> = ({ isOpen, onClose }) => {
  const { resumes, reports } = useApp();

  const [versionAId, setVersionAId] = useState<string>(resumes[1]?.id || resumes[0]?.id || '');
  const [versionBId, setVersionBId] = useState<string>(resumes[0]?.id || '');

  if (!isOpen) return null;

  const resA = resumes.find((r) => r.id === versionAId);
  const resB = resumes.find((r) => r.id === versionBId);

  const repA = resA ? reports[resA.id] : undefined;
  const repB = resB ? reports[resB.id] : undefined;

  const scoreA = repA?.atsScore || resA?.latestAtsScore || 0;
  const scoreB = repB?.atsScore || resB?.latestAtsScore || 0;
  const scoreDiff = scoreB - scoreA;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full p-6 text-slate-100 shadow-2xl my-8"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Side-by-Side Resume Version Comparison
            </h2>
            <p className="text-sm text-slate-400">
              Compare score delta, keywords, and structural feedback across resume revisions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Version A */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Base Version (Earlier)
            </label>
            <select
              value={versionAId}
              onChange={(e) => setVersionAId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  v{r.versionNumber} - {r.fileName} ({r.uploadedAt.split('T')[0]})
                </option>
              ))}
            </select>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-slate-400">ATS Score</span>
              <span className="text-2xl font-extrabold text-amber-400">{scoreA}/100</span>
            </div>
          </div>

          {/* Version B */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-indigo-900/50 bg-indigo-950/10">
            <label className="block text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
              Newer Revision (Target)
            </label>
            <select
              value={versionBId}
              onChange={(e) => setVersionBId(e.target.value)}
              className="w-full bg-slate-900 border border-indigo-600/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-400"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  v{r.versionNumber} - {r.fileName} ({r.uploadedAt.split('T')[0]})
                </option>
              ))}
            </select>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-slate-400">ATS Score</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-emerald-400">{scoreB}/100</span>
                {scoreDiff !== 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      scoreDiff > 0
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff} pts
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Breakdown A */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800 text-sm">
            <h3 className="font-semibold text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              v{resA?.versionNumber || 1} Metrics
            </h3>
            {repA ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Keyword Match</span>
                  <span className="font-medium text-slate-200">{repA.breakdown.keywordScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Formatting Quality</span>
                  <span className="font-medium text-slate-200">{repA.breakdown.formattingScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Impact Metrics</span>
                  <span className="font-medium text-slate-200">{repA.breakdown.impactScore}%</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800">
                  <p className="text-xs text-slate-400 font-medium mb-1">Keywords Identified ({repA.keywordAnalysis.present.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {repA.keywordAnalysis.present.slice(0, 6).map((k) => (
                      <span key={k} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-xs italic">No detailed analysis available for this version.</p>
            )}
          </div>

          {/* Breakdown B */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-indigo-900/30 text-sm">
            <h3 className="font-semibold text-indigo-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              v{resB?.versionNumber || 2} Metrics
            </h3>
            {repB ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Keyword Match</span>
                  <span className="font-medium text-emerald-400">{repB.breakdown.keywordScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Formatting Quality</span>
                  <span className="font-medium text-emerald-400">{repB.breakdown.formattingScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Impact Metrics</span>
                  <span className="font-medium text-emerald-400">{repB.breakdown.impactScore}%</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800">
                  <p className="text-xs text-slate-400 font-medium mb-1">Keywords Identified ({repB.keywordAnalysis.present.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {repB.keywordAnalysis.present.slice(0, 8).map((k) => (
                      <span key={k} className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/50 text-emerald-300">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-xs italic">No detailed analysis available for this version.</p>
            )}
          </div>
        </div>

        {/* Key Takeaway Summary */}
        <div className="p-4 bg-indigo-950/30 border border-indigo-800/50 rounded-xl text-sm text-indigo-200 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-white mb-1">AI Version Comparison Insight</h4>
            <p className="text-indigo-200/90 leading-relaxed text-xs sm:text-sm">
              {scoreDiff >= 0
                ? `Revision v${resB?.versionNumber} improved overall ATS compatibility by +${scoreDiff} points! You successfully added modern engineering keywords and increased technical impact metrics.`
                : `Revision v${resB?.versionNumber} registered a slight drop in score (-${Math.abs(scoreDiff)} pts). Ensure you haven't accidentally removed core keywords present in v${resA?.versionNumber}.`}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </motion.div>
    </div>
  );
};
