// src/routes/aiRoutes.js

const express = require("express")
const router = express.Router()

const { analyzeDrawing } = require("../controllers/aiController")

router.post("/analyze", analyzeDrawing)

module.exports = router