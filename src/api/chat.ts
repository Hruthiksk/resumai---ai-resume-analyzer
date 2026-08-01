import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGenAI } from './_utils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, resumeText, analysisSummary, conversationHistory, jobTitle } = req.body || {};
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

      return res.status(200).json({ response: response.text });
    }

    return res.status(200).json({
      response: `Based on your resume for ${jobTitle || 'your target role'}, here is my recommendation:\n\n1. **Quantify achievements**: Replace statements like "Helped scale system" with "Optimized API throughput by 38% using Redis caching".\n2. **Align top keywords**: Make sure your summary section explicitly mentions core technical terms relevant to the job.\n\nWould you like me to help you rewrite a specific bullet point?`,
    });
  } catch (err) {
    return res.status(200).json({
      response: 'I am here to help refine your resume! Try asking me to rewrite a bullet point or optimize your summary for your target role.',
    });
  }
}