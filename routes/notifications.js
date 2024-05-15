const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notifications");
const notificationStateController = require("../controllers/notification_state");
const notificationTypeController = require("../controllers/notification_type");
const login = require("../middleware/login");

//List unread notifications
router.get('/notifications/unread', login.required,notificationController.getUnreadNotifications);
//List read notifications
router.get('/notifications/read', login.required,notificationController.getReadNotifications);
//List all notifications
router.get('/notifications', login.required,notificationController.getAllNotifications);
//Add notification
router.post('/notifications/add', login.required, notificationController.addNotifications);

// List all notification states
router.get("/notifications/states", notificationStateController.getNotificationStates);
// List specific notification state
router.get("/notifications/states/:id", notificationStateController.getNotificationState);
// Add notification state
router.post("/notifications/states/add", login.required, notificationStateController.addNotificationState);
// Edit notification state
router.put("/notifications/states/edit/:id", login.required, notificationStateController.editNotificationState);
// Remove notification state
router.delete("/notifications/states/remove/:id", login.required, notificationStateController.removeNotificationState);

// List all notification types
router.get("/notifications/types", notificationTypeController.getNotificationTypes);
// List specific notification type
router.get("/notifications/types/:id", notificationTypeController.getNotificationType);
// Add notification type
router.post("/notifications/types/add", login.required, notificationTypeController.addNotificationType);
// Edit notification type
router.put("/notifications/types/edit/:id", login.required, notificationTypeController.editNotificationType);
// Remove notification type
router.delete("/notifications/types/remove/:id", login.required, notificationTypeController.removeNotificationType);

module.exports = router;