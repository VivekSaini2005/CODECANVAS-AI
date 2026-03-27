const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

async function getAIImageResponse(imageBuffer, problem, action) {
  try {

    // 🔥 Convert image → base64
    const base64Image = imageBuffer.toString("base64")
    // console.log('1');
    let prompt = ""

    if (action === "analyze") {
      prompt = `You are a DSA mentor.
Analyze this drawing and explain the logic and mistakes.
Problem: ${problem}`
    }

    if (action === "pseudocode") {
      prompt = `Generate pseudocode from this drawing.
Problem: ${problem}`
    }

    if (action === "hint") {
      prompt = `Give only a hint (no solution).
Problem: ${problem}`
    }

    // console.log('2');
    // 🔥 Gemini Vision Call (NEW FORMAT)
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",   // ✅ from your code
      contents: [
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Image
          }
        },
        {
          text: prompt
        }
      ]
    })
    // console.log('3');
    return response.text

  } catch (error) {
    console.error("Gemini Vision Error:", error)
    return "AI failed"
  }
}

async function getAIChatResponse(chatHistory, message, problem) {
  try {
    // Reconstruct history replacing dummy roles to expected genai format
    const contents = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add the new user message
    let promptText = message;
    if (problem) {
      promptText += `\n(Context - Problem: ${problem})`;
    }

    contents.push({
      role: 'user',
      parts: [{ text: promptText }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents
    });

    return response.text;

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "AI failed to respond. Please try again.";
  }
}

module.exports = { getAIImageResponse, getAIChatResponse }