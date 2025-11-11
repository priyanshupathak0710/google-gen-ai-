/**
 * Facial Emotion / Depression Detection using Google Gemini API
 * Compatible with Node.js 18+ and @google/generative-ai v0.14.0+
 */

import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔑 Use your Gemini API key (get it from https://makersuite.google.com/app/apikey)
const API_KEY = "AIzaSyC62AgSq-Q0w2u8BbL1JXIpA_c4mVywmEk";
const genAI = new GoogleGenerativeAI(API_KEY);

// ✅ Use the correct model name
// You can use: "gemini-2.0-flash" (faster) or "gemini-2.0-pro" (more powerful)
const MODEL_NAME = "gemini-2.5-pro";
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// --- Helper: Get correct MIME type ---
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  throw new Error("Unsupported image format. Use PNG or JPG only.");
}

// --- Helper: Convert image to Gemini-readable format ---
function fileToGenerativePart(filePath) {
  const mimeType = getMimeType(filePath);
  const imageBase64 = fs.readFileSync(filePath).toString("base64");
  return {
    inlineData: {
      data: imageBase64,
      mimeType,
    },
  };
}

// --- Main Function ---
async function analyzeImageEmotion(imagePath) {
  console.log("📸 Analyzing image with Gemini...");

  const imagePart = fileToGenerativePart(imagePath);
  const prompt = `
You are a professional psychologist AI.
Analyze the uploaded face photo and estimate the emotion and depression risk level.
Base your answer only on facial expressions, not assumptions.

Respond in **pure JSON** format (no markdown):
{
  "emotion": "neutral|sad|anxious|hopeless|happy",
  "depressionRisk": "Low|Moderate|High",
  "confidence": "percentage",
  "summary": "1-sentence explanation of your reasoning"
}
`;

  try {
    const result = await model.generateContent([
      { text: prompt },
      imagePart,
    ]);

    const text = result.response.text().trim();
    console.log("\n🧠 Gemini Raw Output:\n", text);

    // Try parsing JSON safely
    try {
      const cleanText = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanText);
      console.log("\n✅ Parsed JSON Result:\n", parsed);
    } catch {
      console.warn("\n⚠️ Could not parse as JSON. Showing text output instead.");
    }
  } catch (error) {
    console.error("\n❌ Error analyzing image:", error.message);
  }
}

// 🧪 Run the function with your test image
analyzeImageEmotion("./t1.png");
