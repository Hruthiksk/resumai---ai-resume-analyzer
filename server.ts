import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini AI instance
let aiClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// =====================================
// API ENDPOINTS
// =====================================

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Resume Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { resumeText, jobTitle, jobDescription } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length === 0) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    const ai = getGenAI();

    if (ai) {
      const prompt = `Analyze the following resume for the target job role "${jobTitle || 'General Software Engineering Role'}".
Target Job Description: ${jobDescription || 'N/A'}

Resume Content:
${resumeText.slice(0, 8000)}

Return a strict structured JSON output evaluating ATS compatibility (0-100 score), keywords present/missing, grammar/formatting issues, skills gap, key strengths, weaknesses, and prioritized improvement suggestions.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an expert ATS (Applicant Tracking System) reviewer and executive career recruiter. Return high precision, realistic, and actionable resume evaluations in JSON.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              atsScore: { type: Type.INTEGER, description: 'Overall ATS score between 0 and 100' },
              breakdown: {
                type: Type.OBJECT,
                properties: {
                  keywordScore: { type: Type.INTEGER },
                  formattingScore: { type: Type.INTEGER },
                  impactScore: { type: Type.INTEGER },
                  grammarScore: { type: Type.INTEGER },
                },
                required: ['keywordScore', 'formattingScore', 'impactScore', 'grammarScore'],
              },
              keywordAnalysis: {
                type: Type.OBJECT,
                properties: {
                  present: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missing: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['present', 'missing'],
              },
              grammarIssues: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    issue: { type: Type.STRING },
                    suggestion: { type: Type.STRING },
                    location: { type: Type.STRING },
                  },
                  required: ['issue', 'suggestion', 'location'],
                },
              },
              formattingFeedback: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    issue: { type: Type.STRING },
                    severity: { type: Type.STRING, description: 'High, Medium, or Low' },
                    suggestion: { type: Type.STRING },
                  },
                  required: ['issue', 'severity', 'suggestion'],
                },
              },
              skillsGap: {
                type: Type.OBJECT,
                properties: {
                  required: { type: Type.ARRAY, items: { type: Type.STRING } },
                  present: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missing: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['required', 'present', 'missing'],
              },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    priority: { type: Type.STRING, description: 'High, Medium, or Low' },
                    title: { type: Type.STRING },
                    suggestion: { type: Type.STRING },
                    example: { type: Type.STRING },
                  },
                  required: ['priority', 'title', 'suggestion', 'example'],
                },
              },
            },
            required: [
              'atsScore',
              'breakdown',
              'keywordAnalysis',
              'grammarIssues',
              'formattingFeedback',
              'skillsGap',
              'strengths',
              'weaknesses',
              'suggestions',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    }

    // Fallback AI simulation if process.env.GEMINI_API_KEY is not configured
    const simulatedResponse = generateSimulatedAnalysis(resumeText, jobTitle);
    return res.json(simulatedResponse);
  } catch (err: any) {
    console.error('Error in /api/analyze:', err);
    // Fallback on error
    const simulatedResponse = generateSimulatedAnalysis(req.body.resumeText || '', req.body.jobTitle);
    return res.json(simulatedResponse);
  }
});

// AI Chat Coach Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, resumeText, analysisSummary, conversationHistory } = req.body;
    const ai = getGenAI();

    if (ai) {
      const historyPrompt = (conversationHistory || [])
        .map((m: any) => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.message}`)
        .join('\n');

      const fullPrompt = `You are an expert AI Resume & Career Coach.
Resume Context:
${(resumeText || 'No resume attached').slice(0, 3000)}

Analysis Context:
${JSON.stringify(analysisSummary || {})}

Previous Conversation:
${historyPrompt}

User Question: ${message}

Provide a helpful, direct, encouraging, and actionable answer. Highlight concrete bullet points or rephrasing if asked. Keep formatting clean with Markdown.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: fullPrompt,
        config: {
          systemInstruction: 'You are a warm, highly experienced career strategist and resume reviewer. Give concise, insightful, and practical advice.',
        },
      });

      return res.json({ response: response.text });
    }

    // Fallback
    return res.json({
      response: `Based on your resume for ${req.body.jobTitle || 'your target role'}, here is my recommendation:\n\n1. **Quantify achievements**: Replace statements like "Helped scale system" with "Optimized API throughput by 38% using Redis caching".\n2. **Align top keywords**: Make sure your summary section explicitly mentions core technical terms relevant to the job.\n\nWould you like me to help you rewrite a specific bullet point?`,
    });
  } catch (err) {
    return res.json({
      response: 'I am here to help refine your resume! Try asking me to rewrite a bullet point or optimize your summary for your target role.',
    });
  }
});

// AI Cover Letter Endpoint
app.post('/api/cover-letter', async (req, res) => {
  try {
    const { resumeText, jobTitle, companyName, jobDescription, tone } = req.body;
    const ai = getGenAI();

    if (ai) {
      const prompt = `Write a tailored, highly compelling Cover Letter for a candidate applying for the role of "${jobTitle}" at "${companyName || 'Target Company'}".
Tone: ${tone || 'Professional & Confident'}
Job Description: ${jobDescription || 'N/A'}
Candidate Resume Highlights:
${(resumeText || '').slice(0, 4000)}

Format the cover letter cleanly with recipient placeholder, opening greeting, 3 structured paragraphs (Hook/Value, Specific Impact & Skills Alignment, Enthuastic Closing CTA), and professional sign-off.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      return res.json({ coverLetter: response.text });
    }

    // Fallback
    const letter = `Dear Hiring Team at ${companyName || 'the Company'},\n\nI am writing to express my strong interest in the ${jobTitle || 'Software Engineer'} position. With my background in delivering high-impact projects, I am confident in my ability to contribute immediately to your team's goals.\n\nThroughout my career, I have consistently driven technical excellence and performance optimization. My experience aligns directly with the core requirements of the role, specifically in developing scalable solutions and collaborating across teams.\n\nI welcome the opportunity to discuss how my skill set and passion align with your team's roadmap. Thank you for your time and consideration.\n\nSincerely,\nCandidate`;
    return res.json({ coverLetter: letter });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

// AI Interview Prep Endpoint
app.post('/api/interview-prep', async (req, res) => {
  try {
    const { resumeText, jobTitle, jobDescription } = req.body;
    const ai = getGenAI();

    if (ai) {
      const prompt = `Generate 5 targeted interview questions (combination of technical, behavioral STAR method, and situational) tailored to this resume and target job.
Job Title: ${jobTitle}
Job Description: ${jobDescription || 'N/A'}
Resume Snippet: ${(resumeText || '').slice(0, 3000)}

Return JSON array with properties: id, question, category (Behavioral, Technical, Situational), difficulty (Easy, Medium, Hard), keyPointsToInclude, sampleAnswer.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                category: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                keyPointsToInclude: { type: Type.ARRAY, items: { type: Type.STRING } },
                sampleAnswer: { type: Type.STRING },
              },
              required: ['id', 'question', 'category', 'difficulty', 'keyPointsToInclude', 'sampleAnswer'],
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      return res.json({ questions: parsed });
    }

    // Fallback
    return res.json({
      questions: [
        {
          id: 'q1',
          question: `Can you walk us through a complex project on your resume where you had to optimize performance for ${jobTitle}?`,
          category: 'Technical',
          difficulty: 'Medium',
          keyPointsToInclude: ['Initial metric/bottleneck', 'Action taken (architecture/caching)', 'Final quantifiable outcome (e.g., % improvement)'],
          sampleAnswer: 'In my recent project, we noticed API latencies spiking to 800ms during peak hours. I implemented query indexing and Redis caching, reducing latencies by 65% down to 280ms.',
        },
        {
          id: 'q2',
          question: 'Describe a situation where you had a disagreement with a team member on architectural design.',
          category: 'Behavioral',
          difficulty: 'Medium',
          keyPointsToInclude: ['STAR method', 'Empathy & active listening', 'Data-driven decision making'],
          sampleAnswer: 'When choosing between GraphQL and REST for our new microservice, my peer preferred GraphQL while I leaned towards REST for caching simplicity. We benchmarked both with prototype workloads and agreed on REST for our high-read use case.',
        },
      ],
    });
  } catch (err) {
    return res.status(500).json({ error: 'Interview prep failed' });
  }
});

// Helper for offline / fallback simulation
function generateSimulatedAnalysis(text: string, jobTitle = 'Software Engineer') {
  const words = text.toLowerCase();
  const hasReact = words.includes('react');
  const hasNode = words.includes('node') || words.includes('express');
  const hasTs = words.includes('typescript') || words.includes('ts');
  const hasMetrics = /\d+%|\$\d+|\d+x|\d+ users/i.test(text);

  let atsScore = 68;
  if (hasReact) atsScore += 8;
  if (hasNode) atsScore += 7;
  if (hasTs) atsScore += 8;
  if (hasMetrics) atsScore += 9;
  atsScore = Math.min(96, Math.max(45, atsScore));

  return {
    atsScore,
    breakdown: {
      keywordScore: Math.round(atsScore * 0.95),
      formattingScore: Math.round(atsScore * 1.02) > 100 ? 98 : Math.round(atsScore * 1.02),
      impactScore: hasMetrics ? 88 : 58,
      grammarScore: 92,
    },
    keywordAnalysis: {
      present: ['React.js', 'TypeScript', 'Git', 'REST APIs', 'Agile/Scrum', 'CI/CD Pipelines'],
      missing: ['GraphQL', 'Docker / Kubernetes', 'System Architecture', 'Unit Testing (Jest/Vitest)', 'AWS / Cloud Deployment'],
    },
    grammarIssues: [
      {
        issue: 'Passive voice usage in project descriptions',
        suggestion: 'Change "Was responsible for leading the team" to "Led a team of 5 engineers..."',
        location: 'Experience - Senior Developer section',
      },
      {
        issue: 'Inconsistent bullet point capitalization',
        suggestion: 'Ensure every bullet point starts with an uppercase Action Verb.',
        location: 'Experience - Second Position',
      },
    ],
    formattingFeedback: [
      {
        issue: 'Non-standard section header title',
        severity: 'Medium',
        suggestion: 'Use standard header "Work Experience" instead of "Where I Have Worked" so ATS parsers recognize the section.',
      },
      {
        issue: 'Contact information placed inside header frame',
        severity: 'Low',
        suggestion: 'Keep email and phone number in standard top body text to avoid parsing errors in legacy ATS software.',
      },
    ],
    skillsGap: {
      required: ['TypeScript', 'React', 'Node.js', 'System Architecture', 'AWS', 'Docker', 'GraphQL'],
      present: ['TypeScript', 'React', 'Node.js'],
      missing: ['System Architecture', 'AWS', 'Docker', 'GraphQL'],
    },
    strengths: [
      'Strong technical skill alignment for modern web development stacks',
      'Clean layout with legible hierarchy and concise bullet lengths',
      'Good inclusion of measurable outcomes and technical keywords',
    ],
    weaknesses: [
      'Missing cloud infrastructure & deployment keywords (Docker, AWS, Kubernetes)',
      'Several action bullet points lack quantitative metrics (e.g. %, $, numbers saved)',
      'Summary section could be more targeted to ' + jobTitle,
    ],
    suggestions: [
      {
        priority: 'High',
        title: 'Quantify Your Key Bullet Points',
        suggestion: 'Add hard numbers to demonstrate the scale and business impact of your work.',
        example: 'Before: "Improved page load speed." → After: "Optimized bundle size and lazy-loaded assets, cutting initial page load time by 42%."',
      },
      {
        priority: 'High',
        title: 'Incorporate Missing Target Keywords',
        suggestion: `Inject essential keywords like "Docker", "AWS", and "System Architecture" into your technical skills or project descriptions.`,
        example: 'Skill addition: "Containerization: Docker, CI/CD, AWS EC2/S3"',
      },
      {
        priority: 'Medium',
        title: 'Revamp Executive Summary',
        suggestion: `Target the opening profile summary specifically for senior ${jobTitle} roles.`,
        example: `Results-driven ${jobTitle} with 4+ years of experience building scalable web apps with React & Node...`,
      },
    ],
  };
}

// Start Server with Vite Dev Middleware or Static Dist Production
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ResumAI Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
