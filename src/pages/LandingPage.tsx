import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Zap,
  TrendingUp,
  Shield,
  Bot,
  HelpCircle,
  Star,
  ChevronDown,
  UploadCloud,
  Layers,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Footer } from '../components/layout/Footer';

export const LandingPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Senior Software Engineer at Stripe',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      comment: 'ResumAI helped me catch missing AWS & GraphQL keywords that were filtering my resume out. My ATS score went from 62 to 91, and I landed 4 interviews in two weeks!',
      scoreBefore: 62,
      scoreAfter: 91,
    },
    {
      name: 'David Chen',
      role: 'Product Manager at Meta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      comment: 'The side-by-side version comparison and AI Resume Coach rephrased my bullet points with exact quantitative metrics. Best SaaS career investment I made.',
      scoreBefore: 68,
      scoreAfter: 94,
    },
    {
      name: 'Elena Rostova',
      role: 'Full Stack Engineer at Datadog',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      comment: 'The Cover Letter Generator and Interview Prep Flashcards saved me hours during my job hunt. Truly a complete AI career suite!',
      scoreBefore: 71,
      scoreAfter: 89,
    },
  ];

  const faqs = [
    {
      q: 'How does the AI ATS Resume Analyzer evaluate my resume?',
      a: 'Our engine uses advanced Large Language Models (Gemini AI) combined with real corporate Applicant Tracking System parsing logic. It analyzes keyword density, section header hierarchy, formatting compliance, action verb strength, and quantifiable impact metrics relative to your target job role.',
    },
    {
      q: 'Can I compare two different versions of my resume?',
      a: 'Yes! You can upload revisions over time and use our Side-by-Side Version Comparison tool to see exact score deltas, newly matched keywords, and resolved formatting errors.',
    },
    {
      q: 'Is my personal information secure?',
      a: 'Absolutely. ResumAI enforces strict privacy standards. Your uploaded resumes are stored securely and are never shared or used to train public models.',
    },
    {
      q: 'Does ResumAI support custom job descriptions?',
      a: 'Yes! You can paste any target job description or select from our pre-seeded library of job roles to tailor your analysis specifically for the job you want.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Resum<span className="text-indigo-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage('login')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => setCurrentPage('upload')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 text-xs font-semibold mb-8 shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Powered by Gemini 3.6 Flash & Real ATS Algorithms
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6"
        >
          Land 3x More Interviews with <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">AI ATS Resume Optimization</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Stop getting filtered out by automated recruiters. Upload your resume, receive an instant ATS score, fix missing job keywords, and chat with your personal AI Resume Coach.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          <button
            onClick={() => setCurrentPage('upload')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <UploadCloud className="w-5 h-5" />
            Analyze My Resume Now
          </button>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-semibold text-base transition-all"
          >
            Explore Demo App
          </button>
        </motion.div>

        {/* Hero Interactive ATS Visual Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-5xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl relative text-left"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-slate-500 ml-2">resumai-ats-evaluation.json</span>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Score: 92/100 (Passes ATS Screen)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">ATS Score Gauge</div>
              <div className="text-4xl font-black text-emerald-400 my-2">92%</div>
              <p className="text-xs text-slate-400">Exceeds 85% threshold for Senior Engineering roles.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Keyword Alignment</div>
              <div className="flex flex-wrap gap-1.5 my-2">
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">✓ React 19</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">✓ TypeScript</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">✓ AWS ECS</span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">✗ Kubernetes</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">AI Impact Fix</div>
              <p className="text-xs text-indigo-300 font-mono bg-slate-900 p-2.5 rounded border border-slate-800">
                "Improved page load by 2.1s & reduced bundle by 32% using React 19..."
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Core Feature Grid */}
      <section className="py-20 px-6 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-white mb-4">Complete AI Job Hunt Suite</h2>
            <p className="text-slate-400 text-base">
              Everything you need to beat automated ATS filters, tailor your resume for specific positions, and impress hiring managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-800/80 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ATS Compatibility Scoring</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Get a comprehensive 0–100 ATS score breakdown covering keywords, formatting, grammar, and metric quantification.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-800/80 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Interactive AI Resume Coach</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ask your personal AI coach to rewrite weak bullet points, craft executive summaries, and optimize keywords in real time.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-800/80 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Side-by-Side Version Comparison</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Track how edits impact your score across revisions with side-by-side metric comparison and keyword delta tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-white mb-4">Transparent Pricing for Job Seekers</h2>
          <p className="text-slate-400 text-base">Start free, upgrade as you scale your applications.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
              <p className="text-slate-400 text-sm mb-6">Perfect for quick one-off resume checks.</p>
              <div className="text-4xl font-black text-white mb-6">$0 <span className="text-sm font-medium text-slate-400">/ forever</span></div>
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3 Resume ATS Analyses</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Basic Keyword Check</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Executive PDF Summary</li>
              </ul>
            </div>
            <button
              onClick={() => setCurrentPage('upload')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all"
            >
              Start Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-indigo-950 to-slate-900 p-8 rounded-3xl border border-indigo-500/80 shadow-2xl relative flex flex-col justify-between">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
              Most Popular
            </span>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Pro Job Seeker</h3>
              <p className="text-slate-400 text-sm mb-6">Unlimited AI optimization & cover letters.</p>
              <div className="text-4xl font-black text-white mb-6">$19 <span className="text-sm font-medium text-slate-400">/ month</span></div>
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited Resume Analyses</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited AI Coach Chat</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI Cover Letter Generator</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Side-by-Side Version Comparison</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Interview Prep Generator</li>
              </ul>
            </div>
            <button
              onClick={() => setCurrentPage('upload')}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-600/30"
            >
              Get Pro Access
            </button>
          </div>

          {/* Executive Plan */}
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Executive</h3>
              <p className="text-slate-400 text-sm mb-6">For senior leaders & career coaches.</p>
              <div className="text-4xl font-black text-white mb-6">$49 <span className="text-sm font-medium text-slate-400">/ month</span></div>
              <ul className="space-y-3 text-sm text-slate-300 mb-8">
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> All Pro Features Included</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-User Team Workspaces</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Admin API & Usage Analytics</li>
              </ul>
            </div>
            <button
              onClick={() => setCurrentPage('upload')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all"
            >
              Choose Executive
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-white mb-4">Trusted by Thousands of Applicants</h2>
            <p className="text-slate-400">See how job seekers landed offers at top tech companies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6 italic">"{t.comment}"</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                    <div>
                      <p className="text-xs font-bold text-white">{t.name}</p>
                      <p className="text-[10px] text-slate-400">{t.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Score Lift</span>
                    <span className="text-xs font-extrabold text-emerald-400">{t.scoreBefore} → {t.scoreAfter} pts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 px-6 max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-black text-white text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-slate-100 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};
