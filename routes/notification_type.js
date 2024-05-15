const express = require("express");
const router = express.Router();

const notificationTypeController = require("../controllers/notification_type");
const login = require("../middleware/login");
const utils = require("../utils");

// List all notification types
router.get("/notification_type", notificationTypeController.getNotificationTypes);
// List specific notification type
router.get("/notification_type/:id", notificationTypeController.getNotificationType);
// Add notification type
router.post("/notification_type/add", login.required, notificationTypeController.addNotificationType);
// Edit notification type
router.put("/notification_type/edit/:id", login.required, notificationTypeController.editNotificationType);
// Remove notification type
router.delete("/notification_type/remove/:id", login.required, notificationTypeController.removeNotificationType);

module.exports = router;
