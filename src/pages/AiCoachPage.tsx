import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bot, Send, User, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';

export const AiCoachPage: React.FC = () => {
  const { activeResume, reports, chatMessages, addChatMessage, showToast, addAiLog } = useApp();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const resumeId = activeResume?.id || 'res_v2';
  const history = chatMessages[resumeId] || [];
  const activeReport = reports[resumeId];

  const quickPrompts = [
    'How do I quantify my bullet points with metrics?',
    'Give me 3 stronger executive summaries for my target role.',
    'What missing keywords should I prioritize adding?',
    'Rewrite my project experience bullet point to emphasize leadership.',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      resumeId,
      role: 'user',
      message: text,
      createdAt: new Date().toISOString(),
    };

    addChatMessage(resumeId, userMsg);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          resumeText: activeResume?.parsedText,
          analysisSummary: activeReport,
          conversationHistory: history,
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        resumeId,
        role: 'assistant',
        message: data.response || 'Here is my suggestion based on your resume context...',
        createdAt: new Date().toISOString(),
      };

      addChatMessage(resumeId, assistantMsg);

      addAiLog({
        id: 'log_' + Date.now(),
        userEmail: 'user@resumai.io',
        endpoint: '/api/chat',
        modelUsed: 'gemini-3.6-flash',
        tokensUsed: 800,
        costEstimate: 0.00024,
        status: 'SUCCESS',
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      showToast('AI response error, please try again', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied answer to clipboard!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto h-[calc(100vh-5rem)] flex flex-col text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 p-4 sm:p-6 rounded-t-3xl border border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              AI Resume & Career Coach
            </h1>
            <p className="text-xs text-slate-400">
              Context: <strong className="text-indigo-400">{activeResume?.fileName || 'Resume'}</strong> (Target: {activeReport?.jobTitle || 'Software Engineer'})
            </p>
          </div>
        </div>
      </div>

      {/* Message Chat History */}
      <div className="flex-1 bg-slate-950 border-x border-slate-800 p-4 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar">
        {history.length === 0 ? (
          <div className="text-center py-12 text-slate-500 space-y-3">
            <Sparkles className="w-10 h-10 text-indigo-400 mx-auto" />
            <p className="text-sm">Start a conversation with your AI Career Coach!</p>
          </div>
        ) : (
          history.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-slate-800 text-slate-300' : 'bg-indigo-600 text-white'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm space-y-2 relative group ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.message}</div>

                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.message)}
                    title="Copy message"
                    className="absolute top-2 right-2 p-1 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold p-3 bg-slate-900 rounded-2xl border border-slate-800 w-max">
            <RefreshCw className="w-4 h-4 animate-spin" />
            AI Coach is thinking & generating tailored advice...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips & Input Footer */}
      <div className="bg-slate-900 p-4 rounded-b-3xl border border-slate-800 space-y-3 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-medium whitespace-nowrap transition-colors"
            >
              💡 {qp}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI coach anything about your resume or target role..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
