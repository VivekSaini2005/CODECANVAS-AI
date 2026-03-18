const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview"
})

async function getAIResponse(parsed, problem, action) {
  try {

    let prompt = ""

    // 🔥 Dynamic Prompt Based on Action
    if (action === "analyze") {
      prompt = `
You are a DSA mentor.

Problem: ${problem}

User drawing interpretation:
${JSON.stringify(parsed)}

Task:
1. Analyze user's logic
2. Identify mistakes
3. Explain in simple terms
      `
    }

    if (action === "pseudocode") {
      prompt = `
You are a DSA expert.

Problem: ${problem}

User approach:
${JSON.stringify(parsed)}

Task:
Generate clean pseudocode only.
Do not give full code.
      `
    }

    if (action === "hint") {
      prompt = `
You are a strict coding mentor.

Problem: ${problem}

User approach:
${JSON.stringify(parsed)}

Task:
Give only hint (no solution).
Guide step-by-step thinking.
      `
    }

    console.log(prompt);

    const result = await model.generateContent(prompt)
    // console.log(result)
    const response = await result.response
    // console.log(response)
    console.log(response.text())
    return response.text()

  } catch (error) {
    console.error("Gemini Error:", error)
    return "AI failed"
  }
}

module.exports = { getAIResponse }