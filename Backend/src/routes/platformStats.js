const express = require("express")
const router = express.Router()
const auth = require("../middleware/authMiddleware")

const controller = require("../controllers/platformStatsController")

router.post("/leetcode", auth, controller.syncLeetcode)
router.post("/codeforces", auth, controller.syncCodeforces)
router.post("/codechef", auth, controller.syncCodechef)

router.post("/sync-all", auth, controller.syncAllPlatforms)

module.exports = router