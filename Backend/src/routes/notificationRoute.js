const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/authMiddleware');

router.get('/',auth,notificationController.getNotifications);
router.patch("/:id/read",auth,notificationController.markAsRead);


module.exports = router;

