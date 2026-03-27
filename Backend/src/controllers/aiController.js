const { getAIImageResponse, getAIChatResponse } = require("../services/aiService")

exports.analyzeImage = async (req, res) => {
  try {
    const { problem, action } = req.body

    const imageBuffer = req.file.buffer
    // console.log('4')
    const aiResponse = await getAIImageResponse(
      imageBuffer,
      problem,
      action
    )
    // console.log('5')
    // console.log(aiResponse)
    res.json({ success: true, aiResponse })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

exports.continueChat = async (req, res) => {
  try {
    const { chatHistory, message, problem } = req.body

    if (!chatHistory || !message) {
      return res.status(400).json({ success: false, message: "Missing chat history or message" })
    }

    const aiResponse = await getAIChatResponse(chatHistory, message, problem)

    res.json({ success: true, aiResponse })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error in chat continuation" })
  }
}
