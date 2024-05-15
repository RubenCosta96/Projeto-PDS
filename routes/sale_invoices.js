const express = require("express");
const router = express.Router();

const saleInvoiceController = require("../controllers/sale_invoices");
const login = require("../middleware/login");

// list All sales invoices
router.get("/saleInvoices", saleInvoiceController.getAllSales);

// list certain sale invoice
router.get("/saleInvoices/:id", saleInvoiceController.getSale);

// list All sales invoices related to a user
router.get("/saleInvoices/user/:id", saleInvoiceController.getSalesByUser);

// list All purchases invoices related to a Invoice Status
router.get("/saleInvoices/InvoiceStatus/:id", saleInvoiceController.getSalesByInvoiceStatus);

// Add sale invoice
router.post("/saleInvoices/add", login.required, saleInvoiceController.addSale);

// Edit sale invoice
router.put("/saleInvoices/edit/:id", login.required, saleInvoiceController.editSale);

// Remove sale invoice
router.delete("/saleInvoices/remove/:id", login.required, saleInvoiceController.removeSale);

module.exports = router;