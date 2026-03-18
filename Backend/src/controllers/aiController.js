const { parseDrawing } = require("../utils/parseDrawing")
const { getAIResponse } = require("../services/aiService")

exports.analyzeDrawing = async (req, res) => {
  try {
    const { elements, problem, action } = req.body
    // console.log(elements);
    // console.log(action);
    // console.log(problem);
    const parsed = parseDrawing(elements)
    // console.log(parsed);
    // 🔥 CALL GEMINI
    const aiResponse = await getAIResponse(parsed, problem, action)
    console.log(aiResponse);

    res.json({
      success: true,
      parsed,
      aiResponse
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}