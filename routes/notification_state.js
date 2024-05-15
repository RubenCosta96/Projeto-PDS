const express = require("express");
const router = express.Router();

const notificationStateController = require("../controllers/notification_state");
const login = require("../middleware/login");
const utils = require("../utils");

// List all notification states
router.get("/notification_state", notificationStateController.getNotificationStates);
// List specific notification state
router.get("/notification_state/:id", notificationStateController.getNotificationState);
// Add notification state
router.post("/notification_state/add", login.required, notificationStateController.addNotificationState);
// Edit notification state
router.put("/notification_state/edit/:id", login.required, notificationStateController.editNotificationState);
// Remove notification state
router.delete("/notification_state/remove/:id", login.required, notificationStateController.removeNotificationState);

module.exports = router;
