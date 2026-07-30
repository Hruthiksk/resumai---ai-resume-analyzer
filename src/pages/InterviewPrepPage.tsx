import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HelpCircle, Sparkles, CheckCircle2, ChevronDown, RefreshCw, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InterviewQuestion } from '../types';

export const InterviewPrepPage: React.FC = () => {
  const { activeResume, reports, showToast, addAiLog } = useApp();

  const [questions, setQuestions] = useState<InterviewQuestion[]>([
    {
      id: 'q1',
      question: 'Walk us through how you optimized database latency by 45% using PostgreSQL and Redis at TechScale.',
      category: 'Technical',
      difficulty: 'Hard',
      keyPointsToInclude: ['Initial metric/bottleneck', 'Query indexing & Redis caching strategy', 'Final quantifiable outcome (45% reduction)'],
      sampleAnswer: 'In my role at TechScale, API latency spiked during peak loads. I profiled queries using EXPLAIN ANALYZE, added compound B-Tree indexes on frequent join columns, and placed a Redis caching layer ahead of read-heavy queries. This reduced database response times from 420ms to 230ms (45% faster).',
    },
    {
      id: 'q2',
      question: 'Describe a situation where you had to lead a frontend migration (React 19) while maintaining active feature delivery.',
      category: 'Behavioral',
      difficulty: 'Medium',
      keyPointsToInclude: ['STAR method', 'Risk mitigation & feature flags', 'Cross-team communication'],
      sampleAnswer: 'During our platform overhaul, we migrated 4 enterprise dashboards to React 19. To minimize downtime, I created an incremental migration pathway using feature flags, enabling us to ship weekly releases while elevating Core Web Vitals to 96.',
    },
    {
      id: 'q3',
      question: 'How do you handle architectural disagreements regarding microservices vs monolith design?',
      category: 'Situational',
      difficulty: 'Medium',
      keyPointsToInclude: ['Empathy & active listening', 'Data-driven benchmarking', 'Alignment with business scale'],
      sampleAnswer: 'I believe architecture should fit domain requirements. When discussing microservices, I evaluate team velocity, deployment boundaries, and operational overhead before recommending a split.',
    },
  ]);

  const [expandedId, setExpandedId] = useState<string | null>('q1');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: activeResume?.parsedText,
          jobTitle: activeResume?.jobTitle || 'Senior Full Stack Engineer',
        }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setExpandedId(data.questions[0].id);
      }

      addAiLog({
        id: 'log_' + Date.now(),
        userEmail: 'user@resumai.io',
        endpoint: '/api/interview-prep',
        modelUsed: 'gemini-3.6-flash',
        tokensUsed: 950,
        costEstimate: 0.00028,
        status: 'SUCCESS',
        createdAt: new Date().toISOString(),
      });

      showToast('Generated fresh interview questions!');
    } catch (err) {
      showToast('Failed to generate interview questions', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-indigo-400" />
            AI Interview Preparation Simulator
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Targeted interview flashcards derived directly from your resume accomplishments and target role.
          </p>
        </div>

        <button
          onClick={handleGenerateQuestions}
          disabled={isGenerating}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 shrink-0"
        >
          {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate New Questions
        </button>
      </div>

      {/* Question Accordion List */}
      <div className="space-y-4">
        {questions.map((item, idx) => {
          const isOpen = expandedId === item.id;

          return (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden transition-all">
              <button
                onClick={() => setExpandedId(isOpen ? null : item.id)}
                className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-slate-800/40 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {item.category}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        item.difficulty === 'Hard'
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {item.difficulty} Difficulty
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    Q{idx + 1}: {item.question}
                  </h3>
                </div>

                <div className={`p-2 rounded-xl bg-slate-800 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6 pt-2 border-t border-slate-800/80 space-y-4 text-xs sm:text-sm"
                  >
                    <div>
                      <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mb-2">Key Talking Points to Cover</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.keyPointsToInclude.map((point, pIdx) => (
                          <span key={pIdx} className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-indigo-400 uppercase tracking-wider text-[11px] mb-2">Recommended STAR Response Model</h4>
                      <p className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed font-sans">
                        {item.sampleAnswer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
