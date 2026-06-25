import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("⚠️ GEMINI_API_KEY is not configured or still matches template placeholder. AI features will require you to add it via Settings > Secrets.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY });
});

// 2. AI Korean correction endpoint
app.post("/api/ai/correct", async (req, res) => {
  try {
    const { sentence } = req.body;
    if (!sentence || typeof sentence !== "string" || sentence.trim() === "") {
      return res.status(400).json({ error: "请输入需要纠错的韩语内容" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured.",
        needsConfig: true,
        fallbackMessage: "请在 AI Studio 主界面的【Settings > Secrets】中配置您的 GEMINI_API_KEY 以解锁 AI 智能纠错功能！"
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `分析以下韩语输入，并纠正其中的语法、拼写或用词错误。返回流畅标准的韩语、拼音、翻译及词汇拆解。输入: "${sentence}"`,
      config: {
        systemInstruction: "你是一个专业的韩语学习助手。请分析用户的韩语句子，找出所有的拼写、语法或助词错误，给出纠正后的句子。如果句子本身正确，设 isCorrect 为 true。对其中的重要单词/语法助词进行拆解，并全部使用中文进行解释。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING, description: "原始输入的韩语句子" },
            corrected: { type: Type.STRING, description: "纠正或改进后的标准韩语句子" },
            isCorrect: { type: Type.BOOLEAN, description: "输入是否已经完全完美无误。若无错为 true，有修改为 false" },
            explanation: { type: Type.STRING, description: "错误的详细分析或语法点讲解，使用友好耐心的中文" },
            pronunciation: { type: Type.STRING, description: "纠正后韩语的标准罗马拼音或中文近似发音提示" },
            translation: { type: Type.STRING, description: "纠正后句子的中文翻译" },
            breakdown: {
              type: Type.ARRAY,
              description: "对句子中的词汇和句型进行逐项拆解说明",
              items: {
                type: Type.OBJECT,
                properties: {
                  token: { type: Type.STRING, description: "词汇或助词原形" },
                  meaning: { type: Type.STRING, description: "该成分在该语境下的中文含义或语法作用" }
                },
                required: ["token", "meaning"]
              }
            }
          },
          required: ["original", "corrected", "isCorrect", "explanation", "pronunciation", "translation", "breakdown"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("模型未返回任何文本");
    }

    res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error("AI correction error:", error);
    res.status(500).json({ error: error.message || "AI 纠错处理失败，请稍后重试" });
  }
});

// 3. AI Situational conversational challenge generator
app.post("/api/ai/generate-challenge", async (req, res) => {
  try {
    const { theme } = req.body; // e.g. "餐厅", "便利店", "机场"
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured.",
        needsConfig: true
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `围绕场景: "${theme || '日常寒暄'}"，随机生成一句店员或对方说的话，作为互动挑战题，让用户用韩语回复。`,
      config: {
        systemInstruction: "你是一个韩语会话互动考官。根据提供的生活场景，生成一句自然的韩语，并附带其中文翻译。这将作为对话挑战让用户用韩语回复。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenario: { type: Type.STRING, description: "简短场景介绍，如：在首尔的一家烤肉店" },
            challengerLine: { type: Type.STRING, description: "对方说的一句韩语（比如店员、路人）" },
            challengerPronunciation: { type: Type.STRING, description: "罗马拼音发音" },
            challengerTranslation: { type: Type.STRING, description: "对方说话的中文翻译" },
            hint: { type: Type.STRING, description: "给用户的回复提示或通关提示，说明他们可以用什么韩语大意来回答，用中文写" }
          },
          required: ["scenario", "challengerLine", "challengerPronunciation", "challengerTranslation", "hint"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("无法生成挑战");
    }

    res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error("AI generate challenge error:", error);
    res.status(500).json({ error: error.message || "AI 会话生成失败" });
  }
});

// Initialize server and mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Korean Learning Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
