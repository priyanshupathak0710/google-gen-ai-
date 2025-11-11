import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔑 Your Gemini API key
const genAI = new GoogleGenerativeAI("AIzaSyAeiarBfddEVdTdsqLdUx8MmgwExgoLt5c");

// 🧠 Load Gemini model
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

// 🧩 Function to send text for depression detection
async function analyzeDepression(text) {
  try {
    console.log("📤 Sending text to Gemini for depression analysis...\n");

    const prompt = `
You are a psychological text analyzer.
Analyze the emotional tone of the following text.
Focus on signs of **depression, sadness, hopelessness, or anxiety**.

Return ONLY a JSON object like this:
{
  "emotion": "neutral|sad|hopeless|anxious|happy",
  "depressionRisk": "Low|Moderate|High",
  "reason": "short and human-readable explanation"
}

Text: """${text}"""
`;

    const result = await model.generateContent(prompt);
    const output = result.response.text();

    console.log("🧠 Gemini Raw Response:\n", output);

    // Try to parse JSON safely
    try {
      const parsed = JSON.parse(output);
      console.log("\n✅ Parsed Result:\n", parsed);
    } catch {
      console.warn("\n⚠️ Gemini returned non-JSON output, showing raw text instead.\n");
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

// 🧪 Example test
const testText = `
I feel empty and tired all the time. Nothing excites me anymore, and I can’t focus on work.
`;

analyzeDepression(testText);
