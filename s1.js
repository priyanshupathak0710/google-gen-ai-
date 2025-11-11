// gemini-pi.js
// Run using: node gemini-pi.js

import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔑 Your Gemini API key
const genAI = new GoogleGenerativeAI("AIzaSyAeiarBfddEVdTdsqLdUx8MmgwExgoLt5c");

// 🧠 Load Gemini model
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

// 🧩 Function to send prompt
async function askGemini(prompt) {
  try {
    console.log("📤 Sending prompt to Gemini:", prompt, "\n");
    const result = await model.generateContent(prompt);
    const output = result.response.text();
    console.log("🧠 Gemini Response:\n");
    console.log(output);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

// 🧪 Example test prompt
const testPrompt = "What is the value of pi?";
askGemini(testPrompt);
