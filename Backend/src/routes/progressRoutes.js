const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")

const {
  updateProgress,
  getUserProgress,
  getUserStats
} = require("../controllers/progressController")

router.post("/",auth,updateProgress)
router.get("/",auth,getUserProgress)
router.get("/stats",auth,getUserStats)

module.exports = router