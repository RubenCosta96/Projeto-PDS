const express = require("express");
const router = express.Router();

const event_evalController = require("../controllers/event_evaluation");
const login = require("../middleware/login");
const utils = require("../utils");

// List all ad states
router.get("/event_evaluation", event_evalController.getEventsEval);
//List specific ad state
router.get("/event_evaluation/:id", event_evalController.getEventEval);
// Add ad state
router.post("/event_evaluation/add", login.required, event_evalController.addEventsEval);
// Edit ad
router.put("/event_evaluation/edit/:id", login.required, event_evalController.editEventsEval);
// Remove ad
router.delete("/event_evaluation/remove/:id", login.required, event_evalController.removeEventsEval);

module.exports = router;
