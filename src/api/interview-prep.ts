import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGenAI, Type } from './_utils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { resumeText, jobTitle, jobDescription } = req.body || {};
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
      return res.status(200).json({ questions: parsed });
    }

    return res.status(200).json({
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
}