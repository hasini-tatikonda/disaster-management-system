import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "DisasterSafe Control API", timestamp: new Date().toISOString() });
});

// Gemini AI proxy route
app.post("/api/ai/ask", async (req, res) => {
  const { prompt, disasterType, language = "English" } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Return flag indicating local fallback should be used
    return res.json({
      useFallback: true,
      message: "No valid GEMINI_API_KEY configured. Using local safety knowledge base."
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `You are SafeGuide AI, an official Emergency & Disaster Safety Assistant for DisasterSafe (Smart India Hackathon prototype).
Your goal is to provide concise, calm, step-by-step, actionable disaster safety guidance.
Always prioritize personal safety, evacuation if instructed by local authorities, emergency numbers, and emergency assistance.

CRITICAL LANGUAGE REQUIREMENT: You MUST reply ENTIRELY in ${language} language (script and translation appropriate for ${language}). Do NOT reply in English unless ${language} is English.
If the query is about a specific disaster (${disasterType || "general"}), provide BEFORE, DURING, and AFTER safety instructions in ${language}.
Never claim to dispatch real emergency services. Remind users to confirm SOS in the app if they need emergency coordination.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}` }] }
      ]
    });

    const replyText = response.text || "Please follow standard safety procedures and follow instructions from local authorities.";
    return res.json({ useFallback: false, reply: replyText });
  } catch (error: any) {
    console.error("Gemini API Error:", error?.message || error);
    return res.json({
      useFallback: true,
      error: error?.message,
      message: "API error. Falling back to local disaster knowledge base."
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚨 DisasterSafe Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
