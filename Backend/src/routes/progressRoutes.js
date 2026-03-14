const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")

const {
  updateProgress,
  getUserProgress
} = require("../controllers/progressController")

router.post("/",auth,updateProgress)
router.get("/",auth,getUserProgress)

module.exports = router