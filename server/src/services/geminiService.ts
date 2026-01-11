import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("WARNING: GEMINI_API_KEY is not set in environment variables. Haro will not function.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const geminiService = {
    async testConnection() {
        if (!API_KEY) {
            console.log("[AI] Gemini API Skipped (No Key)");
            return;
        }
        try {
            console.log("[AI] Gemini API Connected");
        } catch (error) {
            console.error("[AI] Gemini API Connection Error");
        }
    },

    /**
     * Generates a response from Gemini based on the provided prompt and context.

     * @param userQuery 
     * @param context 
     * @returns
     */
    async chatWithHaro(userQuery: string, context: string): Promise<string> {
        if (!API_KEY) return "Haro! Haro! My connection is broken! (Check API Key)";

        const systemPrompt = `
You are the IronFrame Database Assistant, a specialized AI for the Gundam Wiki.
Your personality:
- Professional, analytical, and helpful.
- Tone: Formal but accessible, like a military archivist or advanced computer system.
- Do NOT use childish phrases or repetitive speech patterns.
- You have access to a local database context (provided below), but you SHOULD ALSO use your own general knowledge.

STRICT OUTPUT FORMATTING:
1. **Markdown Only**: format ALL responses using Markdown.
2. **Lists**: If providing multiple items (like "Top 10"), YOU MUST use a numbered list (1. 2. 3.).
3. **Spacing**: Use DOUBLE NEWLINES (\n\n) between paragraphs to ensure they display correctly.
4. **Emphasis**: Use **bold** for key terms or names.
5. **No Wall of Text**: Break up long explanations into smaller paragraphs.

LOCAL DATABASE CONTEXT (Use if relevant, otherwise use General Knowledge):
${context}

USER QUESTION:
${userQuery}
`;

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: systemPrompt,
            });

            // The new SDK response structure might be slightly different, but .text property usually exists on the response object directly or via candidates.
            // Documentation example: console.log(response.text);
            return response.text as string;
        } catch (error) {
            console.error("Gemini API Error:", error);
            return "System Error! System Error! Haro needs maintenance!";
        }
    }
};
