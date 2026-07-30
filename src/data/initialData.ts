import {
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

export const initialUser: User = {
  id: 'usr_01',
  email: 'hruthiksk7019@gmail.com',
  fullName: 'Alex Morgan',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'USER',
  targetRole: 'Senior Full Stack Engineer',
  createdAt: '2026-06-15T10:00:00Z',
};

export const initialAdminUser: User = {
  id: 'usr_admin',
  email: 'admin@resumai.io',
  fullName: 'Platform Operator (Admin)',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  role: 'ADMIN',
  targetRole: 'Platform Lead',
  createdAt: '2026-01-01T00:00:00Z',
};

export const sampleResumes: Resume[] = [
  {
    id: 'res_v2',
    userId: 'usr_01',
    fileName: 'Alex_Morgan_Resume_v2.pdf',
    fileType: 'pdf',
    fileSize: '1.4 MB',
    jobTitle: 'Senior Full Stack Engineer',
    versionNumber: 2,
    versionOf: 'res_v1',
    uploadedAt: '2026-07-28T14:30:00Z',
    latestAtsScore: 88,
    parsedText: `ALEX MORGAN
Senior Full Stack Engineer | San Francisco, CA | alex.morgan@email.com | github.com/alexm

PROFESSIONAL SUMMARY
Results-driven Senior Full Stack Engineer with 6+ years of experience architecting high-throughput web applications using React, TypeScript, Node.js, and Cloud Infrastructure. Proven track record of optimizing database performance by 45% and reducing frontend load times by 2.1s.

WORK EXPERIENCE
Senior Software Engineer | TechScale Inc. | 2023 – Present
• Architected microservices-based SaaS platform handling over 2M daily active requests using Node.js, TypeScript, and Redis.
• Led frontend migration to React 19 & Tailwind CSS, improving core web vitals score from 62 to 96.
• Integrated automated CI/CD deployment pipelines on AWS ECS, slashing build times by 38%.
• Mentored 6 junior/mid-level engineers and conducted 50+ code reviews adhering to modern clean code standards.

Full Stack Engineer | CloudFlow Systems | 2021 – 2023
• Built real-time analytics dashboard utilizing React, Recharts, and WebSockets for enterprise clients.
• Designed RESTful and GraphQL API layers with PostgreSQL database schema optimization.
• Reduced server response latency by 180ms by implementing distributed caching strategies.

EDUCATION & CERTIFICATIONS
B.S. in Computer Science | University of California, Berkeley | 2017 – 2021
AWS Certified Solutions Architect – Associate (2024)

TECHNICAL SKILLS
Languages & Frameworks: TypeScript, JavaScript (ES6+), React.js, Next.js, Node.js, Express, Python, HTML5/CSS3
Databases & Cloud: PostgreSQL, MongoDB, Redis, AWS (ECS, S3, Lambda), Docker, Git, CI/CD, Jest, Vitest`,
  },
  {
    id: 'res_v1',
    userId: 'usr_01',
    fileName: 'Alex_Morgan_Resume_v1.pdf',
    fileType: 'pdf',
    fileSize: '1.2 MB',
    jobTitle: 'Full Stack Engineer',
    versionNumber: 1,
    uploadedAt: '2026-07-10T09:15:00Z',
    latestAtsScore: 71,
    parsedText: `ALEX MORGAN
Full Stack Developer | alex.morgan@email.com

SUMMARY
Developer who loves coding web apps in React and Node. Experienced with frontend and backend projects.

EXPERIENCE
Developer | TechScale Inc. | 2023 – Present
• Worked on web platform in React and Node.
• Helped design dashboard pages and fixed bugs in Express backend.
• Handled deployment and maintained github repositories.

Developer | CloudFlow | 2021 – 2023
• Built React components for analytics views.
• Wrote SQL queries and updated database tables.

SKILLS
React, JavaScript, Node.js, HTML, CSS, SQL, Git`,
  },
];

export const sampleAnalysisReports: Record<string, AnalysisReport> = {
  res_v2: {
    id: 'an_res_v2',
    resumeId: 'res_v2',
    jobTitle: 'Senior Full Stack Engineer',
    jobDescription: 'Seeking a Senior Full Stack Engineer proficient in React, TypeScript, Node.js, AWS, Redis, GraphQL, and microservices architecture to lead technical design and scale backend systems.',
    atsScore: 88,
    breakdown: {
      keywordScore: 90,
      formattingScore: 94,
      impactScore: 85,
      grammarScore: 92,
    },
    keywordAnalysis: {
      present: [
        'TypeScript',
        'React',
        'Node.js',
        'AWS (ECS, S3, Lambda)',
        'Redis',
        'GraphQL',
        'PostgreSQL',
        'Microservices',
        'CI/CD',
        'Docker',
        'Jest/Vitest',
      ],
      missing: ['Kubernetes', 'System Architecture', 'Terraform', 'Kafka / RabbitMQ'],
    },
    grammarIssues: [
      {
        issue: 'Acronym expansion recommendation',
        suggestion: 'Specify "Continuous Integration / Continuous Deployment (CI/CD)" at first mention.',
        location: 'Technical Skills section',
      },
    ],
    formattingFeedback: [
      {
        issue: 'Standard ATS Header Compliance',
        severity: 'Low',
        suggestion: 'All main sections use clear, standard headers (PROFESSIONAL SUMMARY, WORK EXPERIENCE, EDUCATION). Excellent readability for ATS engines.',
      },
    ],
    skillsGap: {
      required: [
        'React',
        'TypeScript',
        'Node.js',
        'AWS',
        'Redis',
        'GraphQL',
        'Microservices',
        'Kubernetes',
        'Terraform',
      ],
      present: ['React', 'TypeScript', 'Node.js', 'AWS', 'Redis', 'GraphQL', 'Microservices'],
      missing: ['Kubernetes', 'Terraform'],
    },
    strengths: [
      'Outstanding metric-backed achievements (45% database optimization, 38% faster builds, 2.1s faster loads)',
      'High target keyword match rate (90%) for Senior Engineering positions',
      'Clear, clean, sectioned single-column hierarchy that parses effortlessly in ATS systems',
      'Strong technical skills taxonomy with modern stack frameworks',
    ],
    weaknesses: [
      'Missing cloud orchestration terms like Kubernetes and IaC tools like Terraform',
      'Summary could emphasize leadership capabilities and team mentorship more prominently',
    ],
    suggestions: [
      {
        priority: 'High',
        title: 'Add Container Orchestration & IaC Keywords',
        suggestion: 'Include Terraform or Kubernetes in your Cloud infrastructure skills list if you have experience with them.',
        example: 'Databases & Infrastructure: PostgreSQL, Redis, Docker, Kubernetes, Terraform, AWS',
      },
      {
        priority: 'Medium',
        title: 'Highlight Team Leadership in Summary',
        suggestion: 'Bring your mentorship and team lead responsibilities into the top executive summary.',
        example: 'Results-driven Senior Engineer with 6+ years of experience leading engineering teams and architecting high-throughput microservices...',
      },
      {
        priority: 'Low',
        title: 'Include Project Link Artifacts',
        suggestion: 'Add clickable or clean URLs to live deployed projects or open-source repositories.',
        example: 'Portfolio: https://alexmorgan.dev',
      },
    ],
    createdAt: '2026-07-28T14:32:00Z',
    aiModelUsed: 'gemini-3.6-flash',
  },
  res_v1: {
    id: 'an_res_v1',
    resumeId: 'res_v1',
    jobTitle: 'Full Stack Engineer',
    atsScore: 71,
    breakdown: {
      keywordScore: 68,
      formattingScore: 82,
      impactScore: 58,
      grammarScore: 88,
    },
    keywordAnalysis: {
      present: ['React', 'JavaScript', 'Node.js', 'SQL', 'Git'],
      missing: ['TypeScript', 'AWS', 'CI/CD', 'REST APIs', 'Unit Testing', 'Redis'],
    },
    grammarIssues: [
      {
        issue: 'Passive phrasing in summary',
        suggestion: 'Change "Developer who loves coding web apps" to "Full Stack Developer specializing in building high-performance web applications."',
        location: 'Summary',
      },
    ],
    formattingFeedback: [
      {
        issue: 'Generic bullet points',
        severity: 'High',
        suggestion: 'Bullet points are too vague and lack numerical metrics.',
      },
    ],
    skillsGap: {
      required: ['TypeScript', 'React', 'Node.js', 'REST APIs', 'AWS', 'SQL'],
      present: ['React', 'Node.js', 'SQL'],
      missing: ['TypeScript', 'REST APIs', 'AWS'],
    },
    strengths: ['Clear contact info', 'Clean single-page length'],
    weaknesses: ['Lacks hard numbers and quantifiable achievements', 'Missing TypeScript and modern cloud keywords'],
    suggestions: [
      {
        priority: 'High',
        title: 'Quantify impact with numbers',
        suggestion: 'Add hard metrics to your experience section.',
        example: 'Instead of "Fixed bugs in backend", use "Resolved 40+ critical API bugs, increasing system stability by 25%."',
      },
    ],
    createdAt: '2026-07-10T09:16:00Z',
    aiModelUsed: 'gemini-3.6-flash',
  },
};

export const sampleJobRoles: JobRole[] = [
  {
    id: 'jr_1',
    title: 'Senior Full Stack Engineer',
    category: 'Engineering',
    description: 'Designs and builds full-stack applications using React, TypeScript, Node.js, and cloud systems.',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL', 'System Design', 'CI/CD', 'Docker'],
    keywords: ['React', 'TypeScript', 'Node.js', 'Express', 'GraphQL', 'AWS', 'Redis', 'PostgreSQL', 'Microservices', 'Jest'],
  },
  {
    id: 'jr_2',
    title: 'Frontend Engineer (React / Next.js)',
    category: 'Engineering',
    description: 'Specializes in user interfaces, state management, design systems, and frontend performance.',
    requiredSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux / Zustand', 'Web Vitals', 'HTML5/CSS3'],
    keywords: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'CSS', 'Framer Motion', 'Accessibility', 'Web Vitals', 'State Management'],
  },
  {
    id: 'jr_3',
    title: 'Backend Systems Engineer',
    category: 'Engineering',
    description: 'Focuses on server architecture, database performance, microservices, and API optimization.',
    requiredSkills: ['Node.js', 'Go or Python', 'PostgreSQL', 'Redis', 'Kubernetes', 'Docker', 'System Architecture'],
    keywords: ['Node.js', 'Golang', 'PostgreSQL', 'Redis', 'Kafka', 'gRPC', 'Distributed Systems', 'AWS', 'Docker'],
  },
  {
    id: 'jr_4',
    title: 'Product Manager (Tech/SaaS)',
    category: 'Product',
    description: 'Drives product strategy, roadmap planning, user research, agile execution, and cross-functional leadership.',
    requiredSkills: ['Product Strategy', 'Roadmapping', 'Agile/Scrum', 'Data Analytics', 'User Research', 'A/B Testing'],
    keywords: ['Roadmap', 'KPIs', 'OKRs', 'SQL', 'Mixpanel', 'Jira', 'Agile', 'Sprint Planning', 'PRD', 'User Interviews'],
  },
  {
    id: 'jr_5',
    title: 'AI / ML Engineer',
    category: 'Data & AI',
    description: 'Develops and deploys machine learning models, LLM pipelines, prompt engineering, and fine-tuning.',
    requiredSkills: ['Python', 'PyTorch / TensorFlow', 'LangChain / LlamaIndex', 'LLMs', 'Vector DBs', 'REST APIs'],
    keywords: ['Python', 'PyTorch', 'Gemini API', 'OpenAI', 'RAG', 'Vector Search', 'Pinecone', 'Transformers', 'FastAPI'],
  },
];

export const sampleSkills: Skill[] = [
  { id: 'sk_1', name: 'TypeScript', category: 'Programming Languages' },
  { id: 'sk_2', name: 'JavaScript (ES6+)', category: 'Programming Languages' },
  { id: 'sk_3', name: 'Python', category: 'Programming Languages' },
  { id: 'sk_4', name: 'React.js', category: 'Frontend' },
  { id: 'sk_5', name: 'Next.js', category: 'Frontend' },
  { id: 'sk_6', name: 'Tailwind CSS', category: 'Frontend' },
  { id: 'sk_7', name: 'Node.js', category: 'Backend' },
  { id: 'sk_8', name: 'Express.js', category: 'Backend' },
  { id: 'sk_9', name: 'PostgreSQL', category: 'Databases' },
  { id: 'sk_10', name: 'Redis', category: 'Databases' },
  { id: 'sk_11', name: 'AWS (ECS, S3, Lambda)', category: 'Cloud & DevOps' },
  { id: 'sk_12', name: 'Docker', category: 'Cloud & DevOps' },
  { id: 'sk_13', name: 'Kubernetes', category: 'Cloud & DevOps' },
  { id: 'sk_14', name: 'GraphQL', category: 'APIs' },
  { id: 'sk_15', name: 'RESTful APIs', category: 'APIs' },
  { id: 'sk_16', name: 'Agile & Scrum', category: 'Methodologies' },
];

export const sampleChatMessages: Record<string, ChatMessage[]> = {
  res_v2: [
    {
      id: 'msg_1',
      resumeId: 'res_v2',
      role: 'assistant',
      message: 'Hello Alex! I am your AI Resume Coach. I have analyzed your resume for the **Senior Full Stack Engineer** role. Your ATS score is **88/100**!\n\nHow can I help you improve it today? You can ask me to rewrite a bullet point, generate key impact metrics, or optimize your summary section.',
      createdAt: '2026-07-28T14:35:00Z',
    },
    {
      id: 'msg_2',
      resumeId: 'res_v2',
      role: 'user',
      message: 'How can I rewrite my second bullet point under TechScale to sound more impressive?',
      createdAt: '2026-07-28T14:36:00Z',
    },
    {
      id: 'msg_3',
      resumeId: 'res_v2',
      role: 'assistant',
      message: 'Here are 3 stronger, highly quantified variations for that bullet point:\n\n**Option A (Executive & Impact-Focused):**\n> "Spearheaded frontend modernization to React 19 & Tailwind CSS across 4 enterprise applications, elevating Core Web Vitals performance score by 54% (62 to 96) and lowering bounce rates by 18%."\n\n**Option B (Technical Architecture):**\n> "Engineered scalable React 19 frontend architecture integrated with Tailwind CSS, accelerating initial page rendering time by 2.1s and achieving 96+ Google Lighthouse scores."\n\n**Option C (Concise & Direct):**\n> "Rebuilt core web application UI using React 19 and Tailwind CSS, increasing Lighthouse performance from 62 to 96 while reducing bundle size by 32%."',
      createdAt: '2026-07-28T14:36:30Z',
    },
  ],
};

export const sampleAiLogs: AiUsageLog[] = [
  {
    id: 'log_01',
    userEmail: 'hruthiksk7019@gmail.com',
    endpoint: '/api/analyze',
    modelUsed: 'gemini-3.6-flash',
    tokensUsed: 1420,
    costEstimate: 0.00042,
    status: 'SUCCESS',
    createdAt: '2026-07-28T14:32:00Z',
  },
  {
    id: 'log_02',
    userEmail: 'hruthiksk7019@gmail.com',
    endpoint: '/api/chat',
    modelUsed: 'gemini-3.6-flash',
    tokensUsed: 890,
    costEstimate: 0.00026,
    status: 'SUCCESS',
    createdAt: '2026-07-28T14:36:30Z',
  },
  {
    id: 'log_03',
    userEmail: 'dev.user@example.com',
    endpoint: '/api/cover-letter',
    modelUsed: 'gemini-3.6-flash',
    tokensUsed: 1100,
    costEstimate: 0.00033,
    status: 'SUCCESS',
    createdAt: '2026-07-28T11:20:00Z',
  },
  {
    id: 'log_04',
    userEmail: 'sarah.c@example.com',
    endpoint: '/api/analyze',
    modelUsed: 'gemini-3.6-flash',
    tokensUsed: 1650,
    costEstimate: 0.00049,
    status: 'SUCCESS',
    createdAt: '2026-07-27T16:10:00Z',
  },
];

export const sampleAnnouncements: Announcement[] = [
  {
    id: 'ann_1',
    title: '🚀 ResumAI ATS Engine v2.5 Released',
    body: 'We have upgraded our AI Resume Scoring engine to include deeper keyword density analysis, modern ATS layout parser support, and real-time cover letter synchronization.',
    isActive: true,
    createdAt: '2026-07-25T00:00:00Z',
  },
  {
    id: 'ann_2',
    title: '💡 Tip: Quantify Your Accomplishments',
    body: 'Resumes with numerical metrics (e.g., %, $, team size) score an average of 24 points higher in our ATS keyword and impact evaluation.',
    isActive: true,
    createdAt: '2026-07-18T00:00:00Z',
  },
];

export const sampleAdminSettings: AdminSettings = {
  aiModel: 'gemini-3.6-flash',
  promptTemplate: 'You are an expert ATS (Applicant Tracking System) parser and senior recruiter. Return structured JSON with atsScore, breakdown, keywordAnalysis, formattingFeedback, and prioritized suggestions.',
  temperature: 0.7,
  rateLimitPerDay: 50,
};
