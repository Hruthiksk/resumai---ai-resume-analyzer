import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

let model: any = null;

if (apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);

  model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
}

export async function generateContent(prompt: string) {
  if (!model) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

export function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
    },
  });
}

export function errorResponse(message: string, status = 500) {
  return jsonResponse(
    {
      success: false,
      error: message,
    },
    status
  );
}