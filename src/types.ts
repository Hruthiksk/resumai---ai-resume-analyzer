export type Page =
  | 'landing'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'upload'
  | 'analysis'
  | 'job-match'
  | 'ai-coach'
  | 'cover-letter'
  | 'interview-prep'
  | 'profile'
  | 'settings'
  | 'admin'
  | 'not-found';

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  targetRole?: string;
  createdAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt';
  fileSize: string;
  parsedText: string;
  uploadedAt: string;
  latestAtsScore?: number;
  jobTitle?: string;
  versionNumber: number;
  versionOf?: string;
}

export interface ScoreBreakdown {
  keywordScore: number;
  formattingScore: number;
  impactScore: number;
  grammarScore: number;
}

export interface KeywordAnalysis {
  present: string[];
  missing: string[];
}

export interface GrammarIssue {
  issue: string;
  suggestion: string;
  location: string;
}

export interface FormattingFeedback {
  issue: string;
  severity: 'High' | 'Medium' | 'Low';
  suggestion: string;
}

export interface SkillsGap {
  required: string[];
  present: string[];
  missing: string[];
}

export interface SuggestionItem {
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  suggestion: string;
  example: string;
}

export interface AnalysisReport {
  id: string;
  resumeId: string;
  jobTitle: string;
  jobDescription?: string;
  atsScore: number;
  breakdown: ScoreBreakdown;
  keywordAnalysis: KeywordAnalysis;
  grammarIssues: GrammarIssue[];
  formattingFeedback: FormattingFeedback[];
  skillsGap: SkillsGap;
  strengths: string[];
  weaknesses: string[];
  suggestions: SuggestionItem[];
  createdAt: string;
  aiModelUsed?: string;
}

export interface JobRole {
  id: string;
  title: string;
  category: string;
  description: string;
  requiredSkills: string[];
  keywords: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  resumeId: string;
  role: 'user' | 'assistant';
  message: string;
  createdAt: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'Technical' | 'Behavioral' | 'Situational';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  keyPointsToInclude: string[];
  sampleAnswer: string;
}

export interface AiUsageLog {
  id: string;
  userEmail: string;
  endpoint: string;
  modelUsed: string;
  tokensUsed: number;
  costEstimate: number;
  status: 'SUCCESS' | 'ERROR' | 'RATE_LIMITED';
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminSettings {
  aiModel: string;
  promptTemplate: string;
  temperature: number;
  rateLimitPerDay: number;
}
