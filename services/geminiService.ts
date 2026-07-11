import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateSupervisorResponse = async (
  userMessage: string,
  systemContext: any
) => {
  if (!apiKey) {
    return "SYSTEM ERROR: API_KEY_MISSING. Contact Administrator.";
  }

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
      model: 'gemini-3-flash-preview',
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