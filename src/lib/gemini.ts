import { GoogleGenAI } from '@google/genai';

// Initialize the shared server-side Gemini client with user-agent header
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});
