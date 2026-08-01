import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGenAI } from './_utils.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { resumeText, jobTitle, companyName, jobDescription, tone } = req.body || {};
    const ai = getGenAI();

    if (ai) {
      const prompt = `Write a tailored, highly compelling Cover Letter for a candidate applying for the role of "${jobTitle}" at "${companyName || 'Target Company'}".
Tone: ${tone || 'Professional & Confident'}
Job Description: ${jobDescription || 'N/A'}
Candidate Resume Highlights:
${(resumeText || '').slice(0, 4000)}

Format the cover letter cleanly with recipient placeholder, opening greeting, 3 structured paragraphs (Hook/Value, Specific Impact & Skills Alignment, Enthusiastic Closing CTA), and professional sign-off.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      return res.status(200).json({ coverLetter: response.text });
    }

    const letter = `Dear Hiring Team at ${companyName || 'the Company'},\n\nI am writing to express my strong interest in the ${jobTitle || 'Software Engineer'} position. With my background in delivering high-impact projects, I am confident in my ability to contribute immediately to your team's goals.\n\nThroughout my career, I have consistently driven technical excellence and performance optimization. My experience aligns directly with the core requirements of the role, specifically in developing scalable solutions and collaborating across teams.\n\nI welcome the opportunity to discuss how my skill set and passion align with your team's roadmap. Thank you for your time and consideration.\n\nSincerely,\nCandidate`;
    return res.status(200).json({ coverLetter: letter });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate cover letter' });
  }
}