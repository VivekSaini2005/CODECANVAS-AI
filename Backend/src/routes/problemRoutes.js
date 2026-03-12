const express = require("express")
const router = express.Router()

const {getProblems,getProblem} = require("../controllers/problemController")

router.get("/",getProblems)
router.get("/:id",getProblem)

module.exports = router