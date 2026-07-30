import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { UploadResumePage } from './pages/UploadResumePage';
import { AnalysisDetailPage } from './pages/AnalysisDetailPage';
import { JobMatchPage } from './pages/JobMatchPage';
import { AiCoachPage } from './pages/AiCoachPage';
import { CoverLetterPage } from './pages/CoverLetterPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppRouter: React.FC = () => {
  const { currentPage, darkMode, isLoggedIn, isAdmin } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Unauthenticated visitors accessing public pages
  if (currentPage === 'landing') return <LandingPage />;
  if (currentPage === 'login') return <LoginPage />;
  if (currentPage === 'signup') return <SignupPage />;

  // Protected Route Check: redirect unauthenticated users to login
  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'upload':
        return <UploadResumePage />;
      case 'analysis':
        return <AnalysisDetailPage />;
      case 'job-match':
        return <JobMatchPage />;
      case 'ai-coach':
        return <AiCoachPage />;
      case 'cover-letter':
        return <CoverLetterPage />;
      case 'interview-prep':
        return <InterviewPrepPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'admin':
        // Protect admin page from regular users
        return isAdmin ? <AdminDashboardPage /> : <DashboardPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className={`min-h-screen flex bg-slate-950 font-sans text-slate-100 ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar Navigation */}
      <Sidebar isOpen={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="flex-1 overflow-y-auto">{renderCurrentPage()}</main>
        <Footer />
      </div>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
