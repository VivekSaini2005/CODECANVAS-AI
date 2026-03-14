const express = require("express")
const router = express.Router()

const {
  getProblems,
  getProblem,
  createProblem
} = require("../controllers/problemController")

router.get("/", getProblems)
router.get("/:slug", getProblem)
router.post("/", createProblem)

module.exports = router