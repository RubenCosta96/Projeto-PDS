const express = require("express");
const router = express.Router();

const event_statusController = require("../controllers/event_status");
const login = require("../middleware/login");
const utils = require("../utils");

// List all ad states
router.get("/event_status", event_statusController.getEventsStatus);
// List specific ad state
router.get("/event_status/:id", event_statusController.getEventStatus);
// Add ad state
router.post("/event_status/add", login.required, event_statusController.addEventStatus);
// Edit ad
router.put("/event_status/edit/:id", login.required, event_statusController.editEventStatus);
// Remove ad
router.delete("/event_status/remove/:id", login.required, event_statusController.removeEventStatus);

module.exports = router;
