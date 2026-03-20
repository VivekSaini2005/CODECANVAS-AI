const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")

const {
  updateProgress,
  getUserProgress,
  getUserStats,
  getLeaderboard
} = require("../controllers/progressController")

router.get("/leaderboard", auth, getLeaderboard)
router.get("/stats", auth, getUserStats)
router.post("/", auth, updateProgress)
router.get("/", auth, getUserProgress)

module.exports = router