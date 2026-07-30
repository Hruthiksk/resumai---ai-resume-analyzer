import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  Printer,
  Bot,
  Layers,
  Copy,
  ChevronRight,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { motion } from 'motion/react';
import { PDFReportModal } from '../components/common/PDFReportModal';
import { VersionCompareModal } from '../components/common/VersionCompareModal';

export const AnalysisDetailPage: React.FC = () => {
  const { activeResume, reports, setCurrentPage, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'keywords' | 'grammar' | 'strengths' | 'suggestions'>('keywords');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const report = activeResume ? reports[activeResume.id] : undefined;

  if (!activeResume || !report) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <FileText className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Analysis Report Selected</h2>
        <p className="text-slate-400 text-sm">Please upload a resume or select an existing resume version from your dashboard.</p>
        <button
          onClick={() => setCurrentPage('upload')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm"
        >
          Upload Resume
        </button>
      </div>
    );
  }

  const score = report.atsScore;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 text-slate-100">
      {/* Header bar with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
              Target Role: {report.jobTitle}
            </span>
            <span className="text-xs text-slate-400">v{activeResume.versionNumber}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-7 h-7 text-indigo-400" />
            ATS Compatibility Evaluation
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            File: {activeResume.fileName} • Analyzed on {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            Compare Version
          </button>

          <button
            onClick={() => setCurrentPage('ai-coach')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            Ask AI Coach
          </button>

          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Download PDF Report
          </button>
        </div>
      </div>

      {/* Top Gauge & Score Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main ATS Score Ring Display */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall ATS Pass Rate</span>
          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            <div className="absolute inset-0 rounded-full border-8 border-slate-800" />
            <div
              className={`absolute inset-0 rounded-full border-8 ${
                score >= 80 ? 'border-emerald-500' : score >= 65 ? 'border-amber-500' : 'border-rose-500'
              }`}
              style={{
                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
              }}
            />
            <div className="text-center">
              <span className="text-4xl font-black text-white">{score}</span>
              <span className="text-xs font-bold text-slate-400 block">/ 100</span>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
              score >= 80
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : score >= 65
                ? 'bg-amber-950 text-amber-300 border-amber-800'
                : 'bg-rose-950 text-rose-300 border-rose-800'
            }`}
          >
            {score >= 80 ? 'HIGH ATS PASS CHANCE' : score >= 65 ? 'MODERATE ATS FIT' : 'NEEDS OPTIMIZATION'}
          </span>
        </div>

        {/* Breakdown Metric Bars */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            Evaluation Category Breakdown
          </h2>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Target Keyword Match</span>
                <span className="text-indigo-400">{report.breakdown.keywordScore}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${report.breakdown.keywordScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">ATS Formatting & Layout Compliance</span>
                <span className="text-indigo-400">{report.breakdown.formattingScore}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: `${report.breakdown.formattingScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Impact & Quantifiable Metrics</span>
                <span className="text-amber-400">{report.breakdown.impactScore}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${report.breakdown.impactScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Grammar & Syntax Integrity</span>
                <span className="text-emerald-400">{report.breakdown.grammarScore}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${report.breakdown.grammarScore}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categorized Detail Tabs */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
        <div className="flex border-b border-slate-800 gap-6 text-sm font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('keywords')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              activeTab === 'keywords' ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Keywords & Skills Gap ({report.keywordAnalysis.missing.length} missing)
          </button>

          <button
            onClick={() => setActiveTab('grammar')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              activeTab === 'grammar' ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Grammar & Formatting ({report.grammarIssues.length + report.formattingFeedback.length} flags)
          </button>

          <button
            onClick={() => setActiveTab('strengths')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              activeTab === 'strengths' ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Strengths & Weaknesses
          </button>

          <button
            onClick={() => setActiveTab('suggestions')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              activeTab === 'suggestions' ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Actionable AI Fixes ({report.suggestions.length})
          </button>
        </div>

        {/* Tab 1: Keywords & Skills Gap */}
        {activeTab === 'keywords' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-900/40">
                <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Matched Target Keywords ({report.keywordAnalysis.present.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.keywordAnalysis.present.map((k) => (
                    <span
                      key={k}
                      className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold"
                    >
                      ✓ {k}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-rose-900/40">
                <h3 className="text-sm font-bold text-rose-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Missing Required Keywords ({report.keywordAnalysis.missing.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.keywordAnalysis.missing.map((k) => (
                    <button
                      key={k}
                      onClick={() => handleCopy(k)}
                      title="Click to copy keyword"
                      className="px-3 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 text-xs font-semibold hover:bg-rose-900 transition-colors flex items-center gap-1.5"
                    >
                      <span>✗ {k}</span>
                      <Copy className="w-3 h-3 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Grammar & Formatting */}
        {activeTab === 'grammar' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-300">Formatting Feedback</h3>
              {report.formattingFeedback.map((f, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{f.issue}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.severity === 'High' ? 'bg-rose-950 text-rose-400' : 'bg-amber-950 text-amber-400'
                      }`}
                    >
                      {f.severity} Severity
                    </span>
                  </div>
                  <p className="text-slate-400">{f.suggestion}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-300">Grammar & Phrasing Corrections</h3>
              {report.grammarIssues.map((g, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <span className="text-indigo-400 font-semibold">{g.location}</span>
                  <p className="text-white font-medium">{g.issue}</p>
                  <p className="text-emerald-400 font-mono bg-slate-900 p-2 rounded border border-slate-800">{g.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Strengths & Weaknesses */}
        {activeTab === 'strengths' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-900/40 space-y-3">
              <h3 className="text-sm font-bold text-emerald-400">Key Resume Strengths</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {report.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-rose-900/40 space-y-3">
              <h3 className="text-sm font-bold text-rose-400">Main Weaknesses</h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {report.weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Suggestions */}
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            {report.suggestions.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                      item.priority === 'High' ? 'bg-rose-950 text-rose-400' : 'bg-amber-950 text-amber-400'
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>
                <p className="text-xs text-slate-300">{item.suggestion}</p>
                {item.example && (
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-indigo-300 font-mono flex items-center justify-between">
                    <span>{item.example}</span>
                    <button
                      onClick={() => handleCopy(item.example)}
                      className="p-1 text-slate-400 hover:text-white transition-colors shrink-0 ml-2"
                      title="Copy example"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <PDFReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        report={report}
        resume={activeResume}
      />

      <VersionCompareModal isOpen={isCompareModalOpen} onClose={() => setIsCompareModalOpen(false)} />
    </div>
  );
};
