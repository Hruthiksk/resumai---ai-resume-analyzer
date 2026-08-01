import { createClient } from '@supabase/supabase-js';
import { User, Resume, AnalysisReport } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const STORAGE_BUCKET = 'resumes';

// Helper to ensure bucket exists or fails gracefully
export const ensureResumeBucketExists = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    if (buckets && !buckets.some((b) => b.name === STORAGE_BUCKET)) {
      await supabase.storage.createBucket(STORAGE_BUCKET, { public: true });
    }
  } catch (err) {
    console.warn('Could not list/create storage buckets:', err);
  }
};

// Profile Sync Helper
export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name || 'Job Seeker',
      avatarUrl: data.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: (data.role as 'USER' | 'ADMIN') || 'USER',
      targetRole: data.target_role || 'Senior Full Stack Engineer',
      createdAt: data.created_at || new Date().toISOString(),
    };
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
};

export const syncUserProfile = async (user: User) => {
  try {
    const { error } = await supabase.from('profiles').upsert(
      {
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        avatar_url: user.avatarUrl,
        role: user.role,
        target_role: user.targetRole,
        created_at: user.createdAt,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.warn('Supabase profile upsert warning (table might need creation):', error.message);
    }
  } catch (err) {
    console.error('Failed to sync profile to Supabase:', err);
  }
};

// Resume Storage & Database Helper
export const uploadFileToSupabaseStorage = async (
  userId: string,
  file: File
): Promise<{ path: string; publicUrl: string } | null> => {
  try {
    await ensureResumeBucketExists();
    const fileExt = file.name.split('.').pop() || 'pdf';
    const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (error) {
      console.warn('Supabase storage upload notice:', error.message);
      return {
        path: fileName,
        publicUrl: URL.createObjectURL(file), // Fallback preview URL
      };
    }

    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);

    return {
      path: data.path,
      publicUrl: urlData.publicUrl,
    };
  } catch (err) {
    console.error('Error uploading file to Supabase storage:', err);
    return null;
  }
};

export const saveResumeToSupabase = async (resume: Resume, filePath?: string) => {
  try {
    const { error } = await supabase.from('resumes').upsert(
      {
        id: resume.id,
        user_id: resume.userId,
        file_name: resume.fileName,
        file_type: resume.fileType,
        file_size: resume.fileSize,
        file_path: filePath || null,
        parsed_text: resume.parsedText,
        job_title: resume.jobTitle,
        version_number: resume.versionNumber,
        latest_ats_score: resume.latestAtsScore || 80,
        uploaded_at: resume.uploadedAt,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.warn('Supabase resume save warning:', error.message);
    }
  } catch (err) {
    console.error('Error saving resume to Supabase:', err);
  }
};

export const fetchResumesFromSupabase = async (userId: string): Promise<Resume[]> => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });

    if (error || !data) return [];

    return data.map((r) => ({
      id: r.id,
      userId: r.user_id,
      fileName: r.file_name,
      fileType: r.file_type as 'pdf' | 'docx' | 'txt',
      fileSize: r.file_size,
      parsedText: r.parsed_text,
      uploadedAt: r.uploaded_at,
      latestAtsScore: r.latest_ats_score,
      jobTitle: r.job_title,
      versionNumber: r.version_number,
    }));
  } catch (err) {
    console.error('Error fetching resumes from Supabase:', err);
    return [];
  }
};

export const saveAnalysisReportToSupabase = async (report: AnalysisReport, userId: string) => {
  try {
    const { error } = await supabase.from('analysis_reports').upsert(
      {
        id: report.id,
        resume_id: report.resumeId,
        user_id: userId,
        job_title: report.jobTitle,
        job_description: report.jobDescription,
        ats_score: report.atsScore,
        breakdown: report.breakdown,
        keyword_analysis: report.keywordAnalysis,
        grammar_issues: report.grammarIssues,
        formatting_feedback: report.formattingFeedback,
        skills_gap: report.skillsGap,
        strengths: report.strengths,
        weaknesses: report.weaknesses,
        suggestions: report.suggestions,
        created_at: report.createdAt,
        ai_model_used: report.aiModelUsed || 'gemini-3.6-flash',
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.warn('Supabase analysis report save warning:', error.message);
    }
  } catch (err) {
    console.error('Error saving analysis report to Supabase:', err);
  }
};

export const fetchAnalysisReportsFromSupabase = async (
  userId: string
): Promise<Record<string, AnalysisReport>> => {
  try {
    const { data, error } = await supabase
      .from('analysis_reports')
      .select('*')
      .eq('user_id', userId);

    if (error || !data) return {};

    const reportsMap: Record<string, AnalysisReport> = {};
    data.forEach((r) => {
      reportsMap[r.resume_id] = {
        id: r.id,
        resumeId: r.resume_id,
        jobTitle: r.job_title,
        jobDescription: r.job_description,
        atsScore: r.ats_score,
        breakdown: r.breakdown,
        keywordAnalysis: r.keyword_analysis,
        grammarIssues: r.grammar_issues || [],
        formattingFeedback: r.formatting_feedback || [],
        skillsGap: r.skills_gap,
        strengths: r.strengths || [],
        weaknesses: r.weaknesses || [],
        suggestions: r.suggestions || [],
        createdAt: r.created_at,
        aiModelUsed: r.ai_model_used,
      };
    });
    return reportsMap;
  } catch (err) {
    console.error('Error fetching analysis reports from Supabase:', err);
    return {};
  }
};

export const deleteResumeFromSupabase = async (resumeId: string) => {
  try {
    await supabase.from('analysis_reports').delete().eq('resume_id', resumeId);
    await supabase.from('resumes').delete().eq('id', resumeId);
  } catch (err) {
    console.error('Error deleting resume from Supabase:', err);
  }
};
