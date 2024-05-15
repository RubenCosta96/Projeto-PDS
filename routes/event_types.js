const express = require("express");
const router = express.Router();

const event_typesController = require("../controllers/event_types");
const login = require("../middleware/login");
const utils = require("../utils");

// List all ad states
router.get("/event_types", event_typesController.getEventTypes);
// List specific ad state
router.get("/event_types/:id", event_typesController.getEventType);
// Add ad state
router.post("/event_types/add", login.required, event_typesController.addEventType);
// Edit ad
router.put("/event_types/edit/:id", login.required, event_typesController.editEventType);
// Remove ad
router.delete("/event_types/remove/:id", login.required, event_typesController.removeEventType);

module.exports = router;
