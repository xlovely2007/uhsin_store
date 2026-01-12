
import { GoogleGenAI } from "@google/genai";

export async function generateProductDescription(name: string, category: string): Promise<string> {
  try {
    // Initialize GoogleGenAI with the API key from environment variables
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a compelling 20-word product description for a premium electronic accessory named "${name}" in the "${category}" category. Focus on reliability and modern design.`,
    });
    // Correctly extract text using property access as per guidelines
    return response.text || "A high-quality accessory designed for your modern tech lifestyle.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Premium electronic accessory built for performance and durability.";
  }
}
