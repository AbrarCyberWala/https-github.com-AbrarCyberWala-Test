import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, WordData } from "../types";

// Initialize the Gemini API client
// Note: In a real production app, ensure this is behind a proxy if you want to hide the key,
// but for this frontend-only demo, we use the env variable directly as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";

export const generateWords = async (
  topic: string,
  difficulty: Difficulty,
  count: number = 5
): Promise<WordData[]> => {
  try {
    const prompt = `
      Generate ${count} distinct English words related to the topic "${topic}".
      Difficulty Level: ${difficulty}.
      
      Constraints:
      - Words must be single words (no spaces or hyphens).
      - Length should be appropriate for difficulty (Easy: 4-5 chars, Medium: 6-7, Hard: 8-9, Expert: 10+).
      - Provide a short, clear definition/hint for each word.
      - Ensure words are common enough to be guessable but challenging enough for the level.
      - Return pure JSON.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            words: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING, description: "The word to scramble (uppercase)" },
                  hint: { type: Type.STRING, description: "A helpful definition or clue" },
                },
                required: ["word", "hint"],
              },
            },
          },
          required: ["words"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from Gemini");
    }

    const data = JSON.parse(jsonText);
    
    // Validate and sanitize
    const sanitizedWords = data.words.map((item: any) => ({
      word: item.word.toUpperCase().trim(),
      hint: item.hint.trim(),
    })).filter((w: WordData) => w.word.length > 0 && /^[A-Z]+$/.test(w.word));

    return sanitizedWords;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback in case of API failure to keep the game playable
    return [
      { word: "REACT", hint: "A JavaScript library for building user interfaces." },
      { word: "GEMINI", hint: "A constellation and a powerful AI model." },
      { word: "TYPESCRIPT", hint: "A typed superset of JavaScript." },
      { word: "FRONTEND", hint: "The part of the web app users interact with." },
      { word: "SCRAMBLE", hint: "To mix up letters." }
    ];
  }
};