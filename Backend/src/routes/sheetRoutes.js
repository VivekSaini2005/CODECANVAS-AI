const express = require("express")
const router = express.Router()

const {
  getSheets,
  getSheetProblems,
  createSheet
} = require("../controllers/sheetController")

router.get("/", getSheets)
router.get("/:id", getSheetProblems)
router.post("/", createSheet)

module.exports = router