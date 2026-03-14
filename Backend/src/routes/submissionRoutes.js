const express = require("express")
const router = express.Router()

const auth = require("../middleware/authMiddleware")

const {
  createSubmission,
  getUserSubmissions
} = require("../controllers/submissionController")

router.post("/",auth,createSubmission)
router.get("/",auth,getUserSubmissions)

module.exports = router