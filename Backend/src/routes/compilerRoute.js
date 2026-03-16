const express = require("express")
const router = express.Router()
const runcode = require("../controllers/runcode");

router.post("/coderun",runcode);

module.exports = router;