const express = require("express");
const router = express.Router();

const eventsController = require("../controllers/events");
const event_evalController = require("../controllers/event_evaluation");
const event_statusController = require("../controllers/event_status");
const event_typesController = require("../controllers/event_types");
const login = require("../middleware/login");
const utils = require("../utils");

//List all events
router.get("/events", eventsController.getEvents);
// List specific collection
router.get("/events/:id", eventsController.getEvent);
// List all events by museum
router.get("/events/museum/:id", eventsController.getEventsByMuseum);
// Add event
router.post("/events/add", login.required, eventsController.addEvent);
// Edit event
router.put("/events/edit/:id", login.required, eventsController.editEvent);
// Remove artist
router.delete("/events/remove/:id", login.required, eventsController.removeEvent);
// Edit price event
router.put("/events/edit/price/:id", login.required, eventsController.editPriceEvent);

// List all ad state evaluation
router.get("/events/evaluation", event_evalController.getEventsEval);
//List specific ad state evaluation
router.get("/events/evaluation/:id", event_evalController.getEventEval);
// Add ad state evaluation
router.post("/events/evaluation/add", login.required, event_evalController.addEventsEval);
// Edit ad evaluation
router.put("/events/evaluation/edit/:id", login.required, event_evalController.editEventsEval);
// Remove ad evaluation
router.delete("/events/evaluation/remove/:id", login.required, event_evalController.removeEventsEval);

// List all ad state status
router.get("/events/status", event_statusController.getEventsStatus);
// List specific ad state status
router.get("/events/status/:id", event_statusController.getEventStatus);
// Add ad state status
router.post("/events/status/add", login.required, event_statusController.addEventStatus);
// Edit ad status
router.put("/events/status/edit/:id", login.required, event_statusController.editEventStatus);
// Remove ad status
router.delete("/events/status/remove/:id", login.required, event_statusController.removeEventStatus);

// List all ad states types
router.get("/events/types", event_typesController.getEventTypes);
// List specific ad state type
router.get("/events/types/:id", event_typesController.getEventType);
// Add ad state type
router.post("/events/types/add", login.required, event_typesController.addEventType);
// Edit ad type
router.put("/events/types/edit/:id", login.required, event_typesController.editEventType);
// Remove ad type
router.delete("/events/types/remove/:id", login.required, event_typesController.removeEventType);

module.exports = router;
