import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Moon, Sun, Bell, Key, RefreshCw, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { darkMode, toggleDarkMode, showToast } = useApp();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [atsScoreAlerts, setAtsScoreAlerts] = useState(true);

  const handleResetData = () => {
    localStorage.clear();
    showToast('Reset application cache to defaults!');
    window.location.reload();
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8 text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-indigo-400" />
          Application Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">Configure appearance, notifications, and environment settings.</p>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6">
        {/* Appearance */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              {darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              Theme Mode
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Switch between Dark Slate mode and Light mode</p>
          </div>

          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            {darkMode ? 'Dark Mode (Active)' : 'Light Mode (Active)'}
          </button>
        </div>

        {/* Notifications */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            Notification Preferences
          </h2>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300">Email digest on score changes</span>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300">ATS keyword recommendation tips</span>
            <input
              type="checkbox"
              checked={atsScoreAlerts}
              onChange={(e) => setAtsScoreAlerts(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* AI API Status */}
        <div className="border-b border-slate-800 pb-6 space-y-2">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            AI Model Engine Status
          </h2>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-200 font-semibold">Gemini 3.6 Flash Server Key Active</span>
            </div>
            <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
              ONLINE
            </span>
          </div>
        </div>

        {/* Danger zone */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-rose-400">Reset Local Storage Data</h3>
            <p className="text-[11px] text-slate-500">Restore application state back to initial mock resumes.</p>
          </div>
          <button
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Data Cache
          </button>
        </div>
      </div>
    </div>
  );
};
