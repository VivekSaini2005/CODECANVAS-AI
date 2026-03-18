const express = require("express")
const router = express.Router()

const upload = require("../middleware/upload")
const { analyzeImage } = require("../controllers/aiController")

router.post("/analyze-image", upload.single("image"), analyzeImage)

module.exports = router