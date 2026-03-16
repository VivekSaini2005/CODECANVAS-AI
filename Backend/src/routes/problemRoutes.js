const express = require("express")
const router = express.Router()
const auth = require("../middleware/authMiddleware")

const {
  getProblems,
  getProblem,
  createProblem,
  getRecommendedProblems,
  getRecentProblems
} = require("../controllers/problemController")

router.get("/recommended", auth, getRecommendedProblems)
router.get("/recent", auth, getRecentProblems)
router.get("/:slug", getProblem)
router.get("/", getProblems)
router.post("/create", auth, createProblem)

module.exports = router