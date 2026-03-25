const express = require("express")
const router = express.Router()
const auth = require("../middleware/authMiddleware")

const controller = require("../controllers/platformStatsController")
const apitestcontroller = require("../controllers/apitest")

router.post("/leetcode", auth, controller.syncLeetcode)
router.post("/codeforces", auth, controller.syncCodeforces)
router.post("/codechef", auth, controller.syncCodechef)

router.post("/sync-all", auth, controller.syncAllPlatforms)
router.get("/stored", auth, controller.getPlatformStats)

router.get("/heatmap", auth, controller.getUserHeatmap);
// router.get("/apitest/:username", auth, apitestcontroller.getLeetcodeHeatmap);
router.get("/apitest/:username", auth, apitestcontroller.getCodeforcesHeatmap);
// router.get("/apitest/:username", auth, apitestcontroller.getCodechefHeatmap);

module.exports = router