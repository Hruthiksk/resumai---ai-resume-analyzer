import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Briefcase, Award, Shield, CheckCircle2, Save, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile, showToast, resumes } = useApp();

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [targetRole, setTargetRole] = useState(currentUser.targetRole);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({ fullName, targetRole });
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8 text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <User className="w-8 h-8 text-indigo-400" />
          User Profile & Career Goal
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account details, target position, and subscription tier.</p>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={currentUser.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500"
          />
          <div>
            <h2 className="text-xl font-bold text-white">{currentUser.fullName}</h2>
            <p className="text-xs text-slate-400">{currentUser.email}</p>
            <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
              {currentUser.role === 'ADMIN' ? 'Platform Administrator' : 'Pro Job Seeker Plan'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Target Job Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Senior Full Stack Engineer"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Account Activity Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Uploaded Versions</span>
          <p className="text-3xl font-black text-white mt-1">{resumes.length}</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">AI Analyses Performed</span>
          <p className="text-3xl font-black text-indigo-400 mt-1">{resumes.length * 2 + 1}</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Subscription Tier</span>
          <p className="text-xl font-black text-emerald-400 mt-2">Active Pro</p>
        </div>
      </div>
    </div>
  );
};
