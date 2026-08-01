import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Page,
  User,
  Resume,
  AnalysisReport,
  JobRole,
  Skill,
  ChatMessage,
  AiUsageLog,
  Announcement,
  AdminSettings,
} from '../types';
import {
  initialUser,
  initialAdminUser,
  sampleResumes,
  sampleAnalysisReports,
  sampleJobRoles,
  sampleSkills,
  sampleChatMessages,
  sampleAiLogs,
  sampleAnnouncements,
  sampleAdminSettings,
} from '../data/initialData';
import {
  supabase,
  fetchUserProfile,
  syncUserProfile,
  fetchResumesFromSupabase,
  saveResumeToSupabase,
  uploadFileToSupabaseStorage,
  fetchAnalysisReportsFromSupabase,
  saveAnalysisReportToSupabase,
  deleteResumeFromSupabase,
} from '../lib/supabase';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  
  // User state & Auth
  currentUser: User;
  isLoggedIn: boolean;
  isAdmin: boolean;
  authLoading: boolean;
  loginAsUser: () => void;
  loginAsAdmin: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithSupabase: (email: string, password: string) => Promise<{ success: boolean; role?: 'USER' | 'ADMIN'; error?: string }>;
  signupWithSupabase: (fullName: string, email: string, password: string) => Promise<{ success: boolean; role?: 'USER' | 'ADMIN'; error?: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<User>) => Promise<void>;

  // Resumes & Storage
  resumes: Resume[];
  activeResumeId: string | null;
  setActiveResumeId: (id: string | null) => void;
  activeResume: Resume | null;
  addResume: (resume: Resume, file?: File | null) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;

  // Analysis Reports
  reports: Record<string, AnalysisReport>;
  saveReport: (resumeId: string, report: AnalysisReport) => Promise<void>;
  getReportForResume: (resumeId: string) => AnalysisReport | undefined;

  // Job Roles & Skills
  jobRoles: JobRole[];
  addJobRole: (role: JobRole) => void;
  deleteJobRole: (id: string) => void;
  skills: Skill[];
  addSkill: (skill: Skill) => void;
  deleteSkill: (id: string) => void;

  // Chat
  chatMessages: Record<string, ChatMessage[]>;
  addChatMessage: (resumeId: string, msg: ChatMessage) => void;

  // Admin
  adminSettings: AdminSettings;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  announcements: Announcement[];
  addAnnouncement: (announcement: Announcement) => void;
  deleteAnnouncement: (id: string) => void;
  aiLogs: AiUsageLog[];
  addAiLog: (log: AiUsageLog) => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('resumai_theme') === 'dark' || true;
  });
  
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [resumes, setResumes] = useState<Resume[]>(sampleResumes);
  const [activeResumeId, setActiveResumeId] = useState<string | null>('res_v2');
  const [reports, setReports] = useState<Record<string, AnalysisReport>>(sampleAnalysisReports);

  const [jobRoles, setJobRoles] = useState<JobRole[]>(sampleJobRoles);
  const [skills, setSkills] = useState<Skill[]>(sampleSkills);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(sampleChatMessages);

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(sampleAdminSettings);
  const [announcements, setAnnouncements] = useState<Announcement[]>(sampleAnnouncements);
  const [aiLogs, setAiLogs] = useState<AiUsageLog[]>(sampleAiLogs);

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Initialize Supabase Auth Session listener
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;

        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          const userObj: User = profile || {
            id: session.user.id,
            email: session.user.email || 'user@example.com',
            fullName: session.user.user_metadata?.full_name || 'Job Seeker',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            role: session.user.email?.includes('admin') ? 'ADMIN' : 'USER',
            targetRole: 'Senior Full Stack Engineer',
            createdAt: new Date().toISOString(),
          };

          setCurrentUser(userObj);
          setIsLoggedIn(true);
          await loadUserSupabaseData(userObj.id);
        }
      } catch (err) {
        console.error('Error initializing Supabase Auth:', err);
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        const userObj: User = profile || {
          id: session.user.id,
          email: session.user.email || 'user@example.com',
          fullName: session.user.user_metadata?.full_name || 'Job Seeker',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          role: session.user.email?.includes('admin') ? 'ADMIN' : 'USER',
          targetRole: 'Senior Full Stack Engineer',
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(userObj);
        setIsLoggedIn(true);
        await loadUserSupabaseData(userObj.id);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setCurrentUser(initialUser);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Helper to fetch user data from Supabase DB
  const loadUserSupabaseData = async (userId: string) => {
    try {
      const fetchedResumes = await fetchResumesFromSupabase(userId);
      if (fetchedResumes.length > 0) {
        setResumes(fetchedResumes);
        setActiveResumeId(fetchedResumes[0].id);
      }

      const fetchedReports = await fetchAnalysisReportsFromSupabase(userId);
      if (Object.keys(fetchedReports).length > 0) {
        setReports((prev) => ({ ...prev, ...fetchedReports }));
      }
    } catch (err) {
      console.error('Error loading Supabase data:', err);
    }
  };

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('resumai_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('resumai_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Quick Demo Mode Switchers
  const loginAsUser = () => {
    setCurrentUser(initialUser);
    setIsLoggedIn(true);
    showToast('Switched to Job Seeker Demo Mode', 'info');
  };

  const loginAsAdmin = () => {
    setCurrentUser(initialAdminUser);
    setIsLoggedIn(true);
    showToast('Switched to Platform Admin Demo Mode', 'info');
  };

  // Real Supabase Authentication Methods
  const loginWithSupabase = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; role?: 'USER' | 'ADMIN'; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showToast(error.message, 'error');
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        const userObj: User = profile || {
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || 'Job Seeker',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          role: email.includes('admin') ? 'ADMIN' : 'USER',
          targetRole: 'Senior Full Stack Engineer',
          createdAt: new Date().toISOString(),
        };

        setCurrentUser(userObj);
        setIsLoggedIn(true);
        await syncUserProfile(userObj);
        await loadUserSupabaseData(userObj.id);
        showToast(`Welcome back, ${userObj.fullName}!`, 'success');
        return { success: true, role: userObj.role };
      }
      return { success: false, error: 'User missing' };
    } catch (err: any) {
      const msg = err?.message || 'Login failed';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };
  const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://resumai-ai-resume-analyzer-five.vercel.app/'
    }
  });

  if (error) {
    showToast(error.message, 'error');
  }
};

  const signupWithSupabase = async (
    fullName: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; role?: 'USER' | 'ADMIN'; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: "https://resumai-ai-resume-analyzer-five.vercel.app/",
    data: {
      full_name: fullName,
    },
  },
});

      if (error) {
        let formattedMsg = error.message;
        if (error.status === 429 || error.message?.toLowerCase().includes('rate limit')) {
          formattedMsg = 'Email rate limit exceeded (HTTP 429). Please wait a minute before retrying, or log in if your account is already created.';
        }
        showToast(formattedMsg, 'error');
        return { success: false, error: formattedMsg };
      }

      const userId = data.user?.id || 'usr_' + Date.now();
      const newUserObj: User = {
        id: userId,
        email,
        fullName,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: email.includes('admin') ? 'ADMIN' : 'USER',
        targetRole: 'Senior Full Stack Engineer',
        createdAt: new Date().toISOString(),
      };

      setCurrentUser(newUserObj);
      setIsLoggedIn(true);
      await syncUserProfile(newUserObj);

      showToast(`Account created successfully for ${fullName}!`, 'success');
      return { success: true, role: newUserObj.role };
    } catch (err: any) {
      const msg = err?.message || 'Signup failed';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setIsLoggedIn(false);
    setCurrentPage('landing');
    showToast('Signed out successfully');
  };

  const updateUserProfile = async (profile: Partial<User>) => {
    const updatedUser = { ...currentUser, ...profile };
    setCurrentUser(updatedUser);
    await syncUserProfile(updatedUser);
    showToast('Profile updated in Supabase');
  };

  const activeResume = resumes.find((r) => r.id === activeResumeId) || resumes[0] || null;

  const addResume = async (resume: Resume, file?: File | null) => {
    setResumes((prev) => [resume, ...prev]);
    setActiveResumeId(resume.id);

    let filePath: string | undefined = undefined;
    if (file && currentUser.id) {
      const uploadRes = await uploadFileToSupabaseStorage(currentUser.id, file);
      if (uploadRes) {
        filePath = uploadRes.path;
      }
    }

    await saveResumeToSupabase({ ...resume, userId: currentUser.id }, filePath);
    showToast(`Saved ${resume.fileName} to Supabase`);
  };

  const deleteResume = async (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
    if (activeResumeId === id) {
      const remaining = resumes.filter((r) => r.id !== id);
      setActiveResumeId(remaining.length > 0 ? remaining[0].id : null);
    }
    await deleteResumeFromSupabase(id);
    showToast('Resume removed from database', 'info');
  };

  const saveReport = async (resumeId: string, report: AnalysisReport) => {
    setReports((prev) => ({ ...prev, [resumeId]: report }));
    setResumes((prev) =>
      prev.map((r) => (r.id === resumeId ? { ...r, latestAtsScore: report.atsScore } : r))
    );

    await saveAnalysisReportToSupabase(report, currentUser.id);
  };

  const getReportForResume = (resumeId: string) => {
    return reports[resumeId];
  };

  const addJobRole = (role: JobRole) => {
    setJobRoles((prev) => [role, ...prev]);
    showToast(`Added job role "${role.title}"`);
  };

  const deleteJobRole = (id: string) => {
    setJobRoles((prev) => prev.filter((j) => j.id !== id));
    showToast('Job role removed', 'info');
  };

  const addSkill = (skill: Skill) => {
    setSkills((prev) => [skill, ...prev]);
    showToast(`Added skill "${skill.name}"`);
  };

  const deleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
    showToast('Skill deleted', 'info');
  };

  const addChatMessage = (resumeId: string, msg: ChatMessage) => {
    setChatMessages((prev) => ({
      ...prev,
      [resumeId]: [...(prev[resumeId] || []), msg],
    }));
  };

  const updateAdminSettings = (settings: Partial<AdminSettings>) => {
    setAdminSettings((prev) => ({ ...prev, ...settings }));
    showToast('Admin AI settings saved');
  };

  const addAnnouncement = (announcement: Announcement) => {
    setAnnouncements((prev) => [announcement, ...prev]);
    showToast('Announcement published');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Announcement removed', 'info');
  };

  const addAiLog = (log: AiUsageLog) => {
    setAiLogs((prev) => [log, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        currentUser,
        isLoggedIn,
        isAdmin: currentUser.role === 'ADMIN',
        authLoading,
        loginAsUser,
        loginAsAdmin,
        loginWithGoogle,
        loginWithSupabase,
        signupWithSupabase,
        logout,
        updateUserProfile,
        resumes,
        activeResumeId,
        setActiveResumeId,
        activeResume,
        addResume,
        deleteResume,
        reports,
        saveReport,
        getReportForResume,
        jobRoles,
        addJobRole,
        deleteJobRole,
        skills,
        addSkill,
        deleteSkill,
        chatMessages,
        addChatMessage,
        adminSettings,
        updateAdminSettings,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        aiLogs,
        addAiLog,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

