const express = require("express");
const router = express.Router();

const ticketsController = require("../controllers/tickets");
const ticketStatusController = require("../controllers/ticket_status");
const login = require("../middleware/login");

// List all tickets
router.get("/tickets", login.required,ticketsController.getAllTickets);
// List alll tickets by event
router.get("/tickets/event/:id", login.required,ticketsController.getAllTicketsByEvent);
// Add tickets
router.post("/tickets/add/:id", login.required,ticketsController.addTickets);
// List all ticket status
router.get("/tickets/status", login.required,ticketStatusController.getAllTicketStatus);
// List specific status
router.get("/tickets/status/:id", login.required,ticketStatusController.getTicketStatus);
// Add ticket status
router.post("/tickets/status/add", login.required,ticketStatusController.addTicketStatus);
// Remove ticket status
router.delete("/tickets/status/remove/:id", login.required,ticketStatusController.removeTicketStatus);
// Edit ticket status
router.put("/tickets/status/edit/:id",login.required,ticketStatusController.editTicketStatus);


module.exports = router;