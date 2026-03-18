const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

async function getAIImageResponse(imageBuffer, problem, action) {
  try {

    // 🔥 Convert image → base64
    const base64Image = imageBuffer.toString("base64")
    console.log('1');
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

    console.log('2');
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
    console.log('3');
    return response.text

  } catch (error) {
    console.error("Gemini Vision Error:", error)
    return "AI failed"
  }
}

module.exports = { getAIImageResponse }