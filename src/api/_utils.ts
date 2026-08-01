import { GoogleGenAI, Type } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI | null {
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

export { Type };

export function generateSimulatedAnalysis(text: string, jobTitle = 'Software Engineer') {
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