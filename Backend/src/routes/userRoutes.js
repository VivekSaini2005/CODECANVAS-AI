const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { updateProfileImage } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.post(
  "/upload-profile",
  auth,
  upload.single("image"),
  updateProfileImage
);

module.exports = router;