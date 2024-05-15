const express = require("express");
const router = express.Router();

const purchaseInvoiceController = require("../controllers/purchase_invoices");
const login = require("../middleware/login");

// list All purchases invoices
router.get("/purchaseInvoices", purchaseInvoiceController.getAllPurchases);

// list certain purchases invoices
router.get("/purchaseInvoices/:id", purchaseInvoiceController.getPurchase);

// list All purchases invoices related to a museum
router.get("/purchaseInvoices/museum/:id", purchaseInvoiceController.getPurchasesByMuseum);

// Add purchase invoice
router.post("/purchaseInvoices/add", login.required, purchaseInvoiceController.addPurchase);

//testar
// Edit purchase invoice
router.put("/purchaseInvoices/edit/:id", login.required, purchaseInvoiceController.editPurchase);

//testar
// Remove purchase invoice
router.delete("/purchaseInvoices/remove/:id", login.required, purchaseInvoiceController.removePurchase);

module.exports = router;