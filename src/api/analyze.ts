import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGenAI, Type, generateSimulatedAnalysis } from './_utils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { resumeText, jobTitle, jobDescription } = req.body || {};

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
      return res.status(200).json(parsed);
    }

    const simulatedResponse = generateSimulatedAnalysis(resumeText, jobTitle);
    return res.status(200).json(simulatedResponse);
  } catch (err: any) {
    console.error('Error in src/api/analyze:', err);
    const simulatedResponse = generateSimulatedAnalysis(req.body?.resumeText || '', req.body?.jobTitle);
    return res.status(200).json(simulatedResponse);
  }
}