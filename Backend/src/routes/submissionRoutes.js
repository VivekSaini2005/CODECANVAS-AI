const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")

const {
  createSubmission,
  getUserSubmissions
} = require("../controllers/submissionController")

router.post("/",createSubmission)
router.get("/",getUserSubmissions)

module.exports = router