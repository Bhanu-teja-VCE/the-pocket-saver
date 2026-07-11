import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

export const generateSupervisorResponse = async (
  userMessage: string,
  systemContext: any
) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || localStorage.getItem("GEMINI_API_KEY") || '';

  if (!apiKey) {
    return "SYSTEM ERROR: API_KEY_MISSING. Please configure your GEMINI_API_KEY in settings or localStorage.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const contextString = JSON.stringify(systemContext, null, 2);
  
  const prompt = `
  [SYSTEM CONTEXT]
  ${contextString}
  
  [USER MESSAGE]
  ${userMessage}
  
  [INSTRUCTION]
  Respond as the NEXUS Supervisor. Be brief. Acknowledge the context.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 200, // Keep it punchy
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "CONNECTION_LOST. EXECUTE PROTOCOL MANUALLY.";
  }
};