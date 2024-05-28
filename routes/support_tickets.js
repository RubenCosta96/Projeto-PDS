const express = require("express");
const router = express.Router();

const support_ticket_controller = require("../controllers/support_tickets");
const supportTicketEvaluationController = require("../controllers/support_evaluations");
const supportTicketStateController = require("../controllers/support_states");
const login = require("../middleware/login");

//List all support tickets
router.get("/supportTickets", login.required, support_ticket_controller.getSupportTickets);
//List specific support ticket
router.get("/supportTickets/:id", login.required, support_ticket_controller.getSupportTicket);
//List all support tickets in a determinate state
router.get("/supportTickets/state/:id", login.required, support_ticket_controller.getSupportTicketsBySuportState);
//Add support ticket
router.post("/supportTickets/add", login.required, support_ticket_controller.addSupportTicket);
//Edit support ticket
router.put('/supportTickets/edit/:id', login.required, support_ticket_controller.editSupportTicket);
//Assignment priority and Estimated deadline
router.put("/supportTickets/assignmentPriorityDeadline/:id", login.required, support_ticket_controller.assignmentPriorityEstimatedDeadline);
//Remove support ticket
router.delete("/supportTickets/remove/:id", login.required, support_ticket_controller.removeSupportTicket);
//Conclude support ticket
router.put("/supportTickets/solved/:id", login.required, support_ticket_controller.SupportTicketSolved);
//Approve support ticket
router.put("/supportTickets/approve/:id", login.required, support_ticket_controller.approveSupportTicket);
//Send notifications
router.post('/supportTickets/sendNotifications/:id', login.required, support_ticket_controller.sendNotifications);
//Inform missing data
router.post('/supportTickets/informMissingData/:id', login.required, support_ticket_controller.informMissingData);
//Redirect ticket
router.put('/supportTickets/redirect/:id', login.required, support_ticket_controller.redirectTicket);

//List all support evaluations
router.get("/supportTicket/evaluations", login.required, supportTicketEvaluationController.getAllSupportEvaluations);   //ver problema com rota
//List sprecific support evaluations
router.get("/supportTickets/evaluations/:id", login.required, supportTicketEvaluationController.getSupportEvaluations);
//Add support evaluations
router.post("/supportTickets/evaluations/add", login.required, supportTicketEvaluationController.addSupportEvaluation);
//Remove support evaluations
router.delete("/supportTickets/evaluations/remove/:id", login.required, supportTicketEvaluationController.removeSupportEvaluation);
//Edit support evaluations
router.put("/supportTickets/evaluations/edit/:id", login.required, supportTicketEvaluationController.editSupportEvaluation);
//Edit support evaluations
router.put("/supportTickets/evaluations/refuse", login.required, supportTicketEvaluationController.refuseSupportEvaluation);

//List all support state
router.get("/supportTickets/states", login.required, supportTicketStateController.getAllSupportStates);
//List specific support state
router.get("/supportTickets/states/:id", login.required, supportTicketStateController.getSupportState);
//Add support state
router.post("/supportTickets/states/add", login.required, supportTicketStateController.addSupportState);
//Remove support state
router.delete("/supportTickets/states/remove/:id", login.required, supportTicketStateController.removeSupportState);
//Edit support state
router.get("/supportTickets/states/edit/:id", login.required, supportTicketStateController.editSupportState);

module.exports = router;