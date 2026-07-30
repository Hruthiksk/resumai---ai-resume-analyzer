import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Upload,
  FileCheck2,
  TrendingUp,
  Bot,
  Briefcase,
  FileText,
  Trash2,
  ArrowRight,
  Sparkles,
  Layers,
  Award,
  CheckCircle,
  Clock,
  Printer,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { VersionCompareModal } from '../components/common/VersionCompareModal';
import { PDFReportModal } from '../components/common/PDFReportModal';

export const DashboardPage: React.FC = () => {
  const {
    resumes,
    activeResume,
    setActiveResumeId,
    reports,
    setCurrentPage,
    deleteResume,
    currentUser,
    announcements,
  } = useApp();

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectedPdfReportId, setSelectedPdfReportId] = useState<string | null>(null);

  // Compute stats
  const totalResumes = resumes.length;
  const scores = resumes.map((r) => r.latestAtsScore || 70);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const topScore = scores.length > 0 ? Math.max(...scores) : 0;

  // Chart data sorted chronologically
  const chartData = [...resumes]
    .reverse()
    .map((r) => ({
      date: r.uploadedAt.split('T')[0],
      score: r.latestAtsScore || 70,
      version: `v${r.versionNumber}`,
    }));

  const pdfReportToView = selectedPdfReportId ? reports[selectedPdfReportId] : null;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto text-slate-100">
      {/* Platform Active Announcements Banner */}
      {announcements.filter((a) => a.isActive).length > 0 && (
        <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-700/50 p-4 rounded-2xl flex items-start gap-3 shadow-lg">
          <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold text-white mr-2">{announcements[0].title}:</span>
            <span className="text-indigo-200">{announcements[0].body}</span>
          </div>
        </div>
      )}

      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Welcome back, {currentUser.fullName}!
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Target Role: <strong className="text-indigo-400 font-semibold">{currentUser.targetRole || 'Senior Full Stack Engineer'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            Compare Versions
          </button>
          <button
            onClick={() => setCurrentPage('upload')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload New Version
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Uploaded Resumes</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalResumes}</div>
          <p className="text-xs text-slate-500 mt-1">Revisions tracked</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Top ATS Score</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{topScore}/100</div>
          <p className="text-xs text-emerald-500/80 mt-1">Passes screening threshold</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Average ATS Score</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{avgScore}/100</div>
          <p className="text-xs text-slate-500 mt-1">Across all versions</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>AI Coach Status</span>
            <Bot className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-sm font-bold text-white mt-1">Ready to assist</div>
          <button
            onClick={() => setCurrentPage('ai-coach')}
            className="text-xs font-semibold text-indigo-400 hover:underline mt-2 inline-block"
          >
            Open Chat Coach →
          </button>
        </div>
      </div>

      {/* Score Trend Chart Section */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              ATS Score Progression History
            </h2>
            <p className="text-xs text-slate-400">Score improvement across resume iterations over time</p>
          </div>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="version" stroke="#64748b" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resume History List Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Your Resume Revisions ({resumes.length})
          </h2>
        </div>

        <div className="divide-y divide-slate-800/80 overflow-x-auto">
          {resumes.map((resume) => {
            const isCurrent = activeResume?.id === resume.id;
            const score = resume.latestAtsScore || 70;

            return (
              <div
                key={resume.id}
                className={`py-4 px-3 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  isCurrent ? 'bg-indigo-950/20 border border-indigo-800/40' : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">
                    v{resume.versionNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{resume.fileName}</h3>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Active Selection
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      Uploaded {new Date(resume.uploadedAt).toLocaleDateString()} • {resume.fileSize}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  {/* ATS Score badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">ATS Score:</span>
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-black border ${
                        score >= 80
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : score >= 65
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}
                    >
                      {score}/100
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveResumeId(resume.id);
                        setCurrentPage('analysis');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
                    >
                      View Report
                    </button>

                    <button
                      onClick={() => {
                        setActiveResumeId(resume.id);
                        setSelectedPdfReportId(resume.id);
                      }}
                      title="Download PDF Report"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteResume(resume.id)}
                      title="Delete Resume"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <VersionCompareModal isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
      {pdfReportToView && (
        <PDFReportModal
          isOpen={!!selectedPdfReportId}
          onClose={() => setSelectedPdfReportId(null)}
          report={pdfReportToView}
          resume={resumes.find((r) => r.id === selectedPdfReportId)}
        />
      )}
    </div>
  );
};
