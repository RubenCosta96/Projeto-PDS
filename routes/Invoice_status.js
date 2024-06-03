const express = require("express");
const router = express.Router();

const InvoiceStatusController = require("../controllers/invoice_status");
const login = require("../middleware/login");

// list All evaluations
router.get("/invoiceStatus", InvoiceStatusController.getAllInvoiceStatus);

// list certain evaluation
router.get("/invoiceStatus/:id", InvoiceStatusController.getInvoiceStatus);

// Add evaluations
router.post("/invoiceStatus/add", login.required, InvoiceStatusController.addInvoiceStatus);

// Edit evaluation
router.put("/invoiceStatus/edit/:id", login.required, InvoiceStatusController.editInvoiceStatus);

// Remove evaluation
router.delete("/invoiceStatus/remove/:id", login.required, InvoiceStatusController.removeUserState);

module.exports = router;
