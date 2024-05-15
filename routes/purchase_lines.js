const express = require("express");
const router = express.Router();

const purchaseLinesController = require("../controllers/purchase_lines");
const login = require("../middleware/login");

// list All sale lines invoices
router.get("/purchaseLines", purchaseLinesController.getAllPurchaseLines);

// list certain sale invoice
router.get("/purchaseLines/:id", purchaseLinesController.getPurchaseLine);

// list All sales invoices related to a purchase
router.get("/purchaseLines/purchase/:id", purchaseLinesController.getLinesByPurchase);

// Add sale invoice
router.post("/purchaseLines/add", login.required, purchaseLinesController.addPurchaseLine);

//testar
// Edit sale invoice
router.put("/purchaseLines/edit/:id", login.required, purchaseLinesController.editPurchaseLine);

//testar
// Remove sale invoice
router.delete("/purchaseLines/remove/:id", login.required, purchaseLinesController.removePurchaseLine);

module.exports = router;