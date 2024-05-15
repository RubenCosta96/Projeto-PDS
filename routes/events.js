const express = require("express");
const router = express.Router();

const eventsController = require("../controllers/events");
const login = require("../middleware/login");
const utils = require("../utils");

//List all collections
router.get("/events", eventsController.getEvents);
// List specific collection
router.get("/events/:id", eventsController.getEvent);
// Add collection
router.post("/events/add", login.required, eventsController.addEvent);
// Edit collection
router.put("/events/edit/:id", login.required, eventsController.editEvent);
// Remove artist
router.delete("/events/remove/:id", login.required, eventsController.removeEvent);

module.exports = router;
