const express = require("express")
const router = express.Router()
const auth = require("../middleware/authMiddleware")

const {
  getProblems,
  getProblem,
  createProblem
} = require("../controllers/problemController")

router.get("/", getProblems)
router.get("/:slug", getProblem)
router.post("/create", auth, createProblem)

module.exports = router