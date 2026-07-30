import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Sun,
  Moon,
  Upload,
  UserCheck,
  ShieldAlert,
  FileText,
  ChevronDown,
  Sparkles,
  Plus,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    currentPage,
    setCurrentPage,
    darkMode,
    toggleDarkMode,
    resumes,
    activeResumeId,
    setActiveResumeId,
    currentUser,
    loginAsUser,
    loginAsAdmin,
    isAdmin,
  } = useApp();

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'upload':
        return 'Upload Resume';
      case 'analysis':
        return 'ATS Analysis & Score';
      case 'job-match':
        return 'Job Role Match & Skills Gap';
      case 'ai-coach':
        return 'AI Resume Coach';
      case 'cover-letter':
        return 'Cover Letter Generator';
      case 'interview-prep':
        return 'Interview Preparation';
      case 'profile':
        return 'User Profile';
      case 'settings':
        return 'Settings';
      case 'admin':
        return 'Platform Admin Console';
      case 'login':
        return 'Sign In';
      case 'signup':
        return 'Create Account';
      default:
        return 'ResumAI Workspace';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Resume Selector Dropdown (when logged in & has resumes) */}
        {resumes.length > 0 && currentPage !== 'landing' && (
          <div className="hidden sm:flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <select
              value={activeResumeId || ''}
              onChange={(e) => setActiveResumeId(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer max-w-[160px] truncate"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                  v{r.versionNumber} - {r.fileName} ({r.latestAtsScore ? `${r.latestAtsScore} pts` : 'Pending'})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* User / Admin Role Toggle Button */}
        <button
          onClick={isAdmin ? loginAsUser : loginAsAdmin}
          title={isAdmin ? 'Switch to Job Seeker View' : 'Switch to Platform Admin View'}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
            isAdmin
              ? 'bg-amber-950/60 border-amber-800/80 text-amber-300 hover:bg-amber-900/80'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {isAdmin ? (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Admin Mode</span>
            </>
          ) : (
            <>
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">User Mode</span>
            </>
          )}
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          title="Toggle Dark / Light theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>

        {/* Quick Upload Action */}
        {currentPage !== 'upload' && (
          <button
            onClick={() => setCurrentPage('upload')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload Resume</span>
          </button>
        )}
      </div>
    </header>
  );
};
