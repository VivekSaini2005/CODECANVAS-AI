const express = require("express")
const router = express.Router()

const {getSheets,getSheetProblems} = require("../controllers/sheetController")

router.get("/",getSheets)
router.get("/:sheetId",getSheetProblems)

module.exports = router