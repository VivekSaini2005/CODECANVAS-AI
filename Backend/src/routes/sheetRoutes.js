const express = require("express")
const router = express.Router()
const auth = require("../middleware/authMiddleware")

const {
  getSheets,
  getSheetProblems,
  createSheet,
  getSheetsProg
} = require("../controllers/sheetController")

router.get("/sheet-progress", auth, getSheetsProg)
router.get("/:id", getSheetProblems)
router.get("/", getSheets)
router.post("/", auth, createSheet)

module.exports = router