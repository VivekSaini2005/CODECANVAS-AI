const { getAIImageResponse } = require("../services/aiService")

exports.analyzeImage = async (req, res) => {
  try {
    const { problem, action } = req.body

    const imageBuffer = req.file.buffer
    console.log('4')
    const aiResponse = await getAIImageResponse(
      imageBuffer,
      problem,
      action
    )
    console.log('5')
    console.log(aiResponse)
    res.json({ success: true, aiResponse })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}