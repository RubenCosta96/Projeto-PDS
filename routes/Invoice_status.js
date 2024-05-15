const express = require("express");
const router = express.Router();

const InvoiceStatusController = require("../controllers/Invoice_status");
const login = require("../middleware/login");


// list All evaluations
router.get("/InvoiceStatus", InvoiceStatusController.getAllInvoiceStatus);

// list certain evaluation
router.get("/InvoiceStatus/:id", InvoiceStatusController.getInvoiceStatus);

// Add evaluations
router.post("/InvoiceStatus/add", login.required, InvoiceStatusController.addInvoiceStatus);

// Edit evaluation
router.put("/InvoiceStatus/edit/:id", login.required, InvoiceStatusController.editInvoiceStatus);

// Remove evaluation
router.delete("/InvoiceStatus/remove/:id", login.required, InvoiceStatusController.removeUserState);

module.exports = router;