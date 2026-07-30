import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Users,
  Activity,
  Briefcase,
  Sliders,
  Megaphone,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  DollarSign,
  Cpu,
  Key,
} from 'lucide-react';
import { JobRole } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const {
    adminUsers,
    aiLogs,
    jobRoles,
    addJobRole,
    deleteJobRole,
    announcements,
    toggleAnnouncement,
    addAnnouncement,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'ai-logs' | 'job-roles' | 'announcements'>('users');

  // Job Role Form
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleCategory, setNewRoleCategory] = useState('Engineering');
  const [newRoleKeywords, setNewRoleKeywords] = useState('');

  // Announcement Form
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');

  // Admin stats
  const totalUsers = adminUsers.length;
  const totalTokenCost = aiLogs.reduce((acc, log) => acc + log.costEstimate, 0).toFixed(4);
  const totalCalls = aiLogs.length;

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleTitle.trim()) return;

    const keywordsArray = newRoleKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const newRole: JobRole = {
      id: 'role_' + Date.now(),
      title: newRoleTitle,
      category: newRoleCategory,
      keywords: keywordsArray.length > 0 ? keywordsArray : ['React', 'TypeScript', 'Node.js'],
      requiredSkills: keywordsArray.length > 0 ? keywordsArray : ['React', 'TypeScript'],
      description: 'Custom admin role definition',
    };

    addJobRole(newRole);
    setNewRoleTitle('');
    setNewRoleKeywords('');
    showToast(`Added job role "${newRoleTitle}"`);
  };

  const handleAddAnn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim()) return;

    addAnnouncement({
      id: 'ann_' + Date.now(),
      title: annTitle,
      body: annBody,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    setAnnTitle('');
    setAnnBody('');
    showToast('Published platform announcement!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-amber-500/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
              Admin Console Mode
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-amber-400" />
            Platform Admin & Operations Center
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage platform users, audit Gemini AI API token usage, configure job role templates, and broadcast announcements.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalUsers}</div>
          <p className="text-xs text-slate-500 mt-1">3 Active right now</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>AI API Calls</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{totalCalls}</div>
          <p className="text-xs text-slate-500 mt-1">Gemini 3.6 Flash</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Est. Token Cost</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">${totalTokenCost}</div>
          <p className="text-xs text-slate-500 mt-1">Under monthly quota</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Role Templates</span>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{jobRoles.length}</div>
          <p className="text-xs text-slate-500 mt-1">Pre-configured ATS criteria</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
        <div className="flex border-b border-slate-800 gap-6 text-sm font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              activeTab === 'users' ? 'border-b-2 border-amber-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            User Management ({adminUsers.length})
          </button>

          <button
            onClick={() => setActiveTab('ai-logs')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              activeTab === 'ai-logs' ? 'border-b-2 border-amber-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Logs & Billing Audit ({aiLogs.length})
          </button>

          <button
            onClick={() => setActiveTab('job-roles')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              activeTab === 'job-roles' ? 'border-b-2 border-amber-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Job Roles & ATS Criteria ({jobRoles.length})
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`pb-3 transition-colors whitespace-nowrap ${
              activeTab === 'announcements' ? 'border-b-2 border-amber-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            System Announcements ({announcements.length})
          </button>
        </div>

        {/* Tab 1: User Management */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="text-slate-400 bg-slate-950 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3 rounded-l-xl">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Resumes</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3 rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {adminUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-semibold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400">
                        {u.fullName[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{u.fullName}</p>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.status === 'Active'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="p-3 text-slate-300 font-mono">{u.resumesUploaded} files</td>
                    <td className="p-3 text-slate-400 text-xs">{new Date(u.joinedAt).toLocaleDateString()}</td>

                    <td className="p-3">
                      <button
                        onClick={() => showToast(`User ${u.fullName} permissions modified`)}
                        className="text-xs text-indigo-400 hover:underline font-semibold"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: AI Logs */}
        {activeTab === 'ai-logs' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>All requests routed through secure Express backend (`/api/*`)</span>
              <span className="font-mono text-indigo-400 font-bold">SDK: @google/genai</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm font-mono">
                <thead className="text-slate-400 bg-slate-950 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3 rounded-l-xl">Timestamp</th>
                    <th className="p-3">Endpoint</th>
                    <th className="p-3">Model</th>
                    <th className="p-3">Tokens</th>
                    <th className="p-3">Cost ($)</th>
                    <th className="p-3 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {aiLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30">
                      <td className="p-3 text-slate-400 text-[11px]">{new Date(log.createdAt).toLocaleTimeString()}</td>
                      <td className="p-3 text-indigo-400 font-bold">{log.endpoint}</td>
                      <td className="p-3 text-slate-300">{log.modelUsed}</td>
                      <td className="p-3 text-slate-300">{log.tokensUsed} pts</td>
                      <td className="p-3 text-amber-400 font-bold">${log.costEstimate}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Job Roles CRUD */}
        {activeTab === 'job-roles' && (
          <div className="space-y-6">
            <form onSubmit={handleAddRole} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Add New Target Job Position Template
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Job Title (e.g., DevOps Engineer)"
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />

                <input
                  type="text"
                  placeholder="Category (e.g., Infrastructure)"
                  value={newRoleCategory}
                  onChange={(e) => setNewRoleCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />

                <input
                  type="text"
                  placeholder="Keywords (Comma separated: Docker, AWS, Terraform)"
                  value={newRoleKeywords}
                  onChange={(e) => setNewRoleKeywords(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                Add Target Role Template
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobRoles.map((role) => (
                <div key={role.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{role.title}</span>
                    <button
                      onClick={() => deleteJobRole(role.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{role.category}</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {role.keywords.map((k) => (
                      <span key={k} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px]">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: System Announcements */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <form onSubmit={handleAddAnn} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-indigo-400" />
                Broadcast Platform Announcement
              </h3>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Announcement Title"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />

                <textarea
                  rows={3}
                  placeholder="Body content..."
                  value={annBody}
                  onChange={(e) => setAnnBody(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all"
              >
                Publish Broadcast
              </button>
            </form>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{ann.title}</h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ann.isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {ann.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{ann.body}</p>
                  </div>

                  <button
                    onClick={() => toggleAnnouncement(ann.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    Toggle Banner
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
