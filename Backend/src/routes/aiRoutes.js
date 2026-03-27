const express = require("express")
const router = express.Router()

const upload = require("../middleware/upload")
const { analyzeImage, continueChat } = require("../controllers/aiController")

router.post("/analyze-image", upload.single("image"), analyzeImage)
router.post("/chat-continue", continueChat)

module.exports = router