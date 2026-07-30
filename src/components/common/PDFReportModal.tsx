import React from 'react';
import { AnalysisReport, Resume } from '../../types';
import { X, Printer, Download, CheckCircle2, AlertTriangle, Award, Sparkles, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface PDFReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AnalysisReport;
  resume?: Resume | null;
}

export const PDFReportModal: React.FC<PDFReportModalProps> = ({
  isOpen,
  onClose,
  report,
  resume,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-8 text-slate-100 shadow-2xl my-8 print:border-none print:shadow-none print:bg-white print:text-slate-900 print:w-full print:max-w-none"
      >
        {/* Header toolbar - Hidden during browser print */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">AI Resume Analysis PDF Report</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/30"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div id="printable-pdf-area" className="space-y-6 print:text-black">
          {/* Executive Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 print:border-slate-300 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-black tracking-tight text-white print:text-slate-900">
                  Resum<span className="text-indigo-500">AI</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 print:border-slate-400 print:text-slate-700">
                  Executive ATS Report
                </span>
              </div>
              <p className="text-sm text-slate-400 print:text-slate-600">
                Target Position: <strong className="text-slate-200 print:text-black">{report.jobTitle}</strong>
              </p>
              <p className="text-xs text-slate-500 print:text-slate-500">
                File: {resume?.fileName || 'Uploaded Resume'} | Generated: {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-4 sm:mt-0 bg-slate-950 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300 flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-slate-400 print:text-slate-600 uppercase font-bold tracking-wider">ATS Score</p>
                <p className="text-3xl font-black text-indigo-400 print:text-indigo-700">{report.atsScore}/100</p>
              </div>
              <div className="h-8 w-px bg-slate-800 print:bg-slate-300" />
              <div className="text-xs space-y-1 text-slate-300 print:text-slate-700">
                <div>Keywords: <strong className="text-emerald-400 print:text-emerald-700">{report.breakdown.keywordScore}%</strong></div>
                <div>Formatting: <strong className="text-indigo-400 print:text-indigo-700">{report.breakdown.formattingScore}%</strong></div>
                <div>Impact: <strong className="text-amber-400 print:text-amber-700">{report.breakdown.impactScore}%</strong></div>
              </div>
            </div>
          </div>

          {/* Key Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/50 print:bg-slate-50 p-4 rounded-xl border border-emerald-900/30 print:border-emerald-300">
              <h3 className="font-semibold text-emerald-400 print:text-emerald-800 flex items-center gap-2 mb-3 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Resume Strengths
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 print:text-slate-800">
                {report.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 print:text-emerald-600 font-bold">•</span>
                    {str}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/50 print:bg-slate-50 p-4 rounded-xl border border-rose-900/30 print:border-rose-300">
              <h3 className="font-semibold text-rose-400 print:text-rose-800 flex items-center gap-2 mb-3 text-sm">
                <AlertTriangle className="w-4 h-4" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 print:text-slate-800">
                {report.weaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 print:text-rose-600 font-bold">•</span>
                    {weak}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Keywords & Skills Gap */}
          <div className="bg-slate-950/50 print:bg-slate-50 p-5 rounded-xl border border-slate-800 print:border-slate-300 space-y-3">
            <h3 className="font-semibold text-white print:text-slate-900 text-sm">ATS Keyword & Skills Gap Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-medium text-emerald-400 print:text-emerald-700 mb-1.5">Matched Target Keywords ({report.keywordAnalysis.present.length}):</p>
                <div className="flex flex-wrap gap-1.5">
                  {report.keywordAnalysis.present.map((k) => (
                    <span key={k} className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/80 text-emerald-300 print:bg-emerald-100 print:text-emerald-800 print:border-emerald-300">
                      ✓ {k}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium text-rose-400 print:text-rose-700 mb-1.5">Missing Required Keywords ({report.keywordAnalysis.missing.length}):</p>
                <div className="flex flex-wrap gap-1.5">
                  {report.keywordAnalysis.missing.map((k) => (
                    <span key={k} className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800/80 text-rose-300 print:bg-rose-100 print:text-rose-800 print:border-rose-300">
                      ✗ {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Suggestions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white print:text-slate-900 text-sm">Actionable AI Fixes</h3>
            <div className="space-y-3">
              {report.suggestions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300 text-xs sm:text-sm space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white print:text-slate-900">{item.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.priority === 'High'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800 print:bg-rose-100 print:text-rose-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800 print:bg-amber-100 print:text-amber-800'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>
                  <p className="text-slate-300 print:text-slate-700">{item.suggestion}</p>
                  {item.example && (
                    <p className="text-indigo-300 print:text-indigo-800 font-mono text-[11px] bg-slate-900 print:bg-slate-200 p-2 rounded mt-2">
                      {item.example}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer stamp */}
          <div className="pt-4 border-t border-slate-800 print:border-slate-300 flex items-center justify-between text-xs text-slate-500 print:text-slate-600">
            <span>Powered by ResumAI Intelligence Engine</span>
            <span>Confidential Resume Evaluation</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
