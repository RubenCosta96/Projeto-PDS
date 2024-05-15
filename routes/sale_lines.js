const express = require("express");
const router = express.Router();

const saleLinesController = require("../controllers/sale_lines");
const login = require("../middleware/login");

// list All sale lines invoices
router.get("/saleLines", saleLinesController.getAllSaleLines);

// list certain sale invoice
router.get("/saleLines/:id", saleLinesController.getSaleLine);

// list All sales invoices related to a user
router.get("/saleLines/sale/:id", saleLinesController.getLinesBySale);

// Add sale invoice
router.post("/saleLines/add", login.required, saleLinesController.addSaleLine);

//testar
// Edit sale invoice
router.put("/saleLines/edit/:id", login.required, saleLinesController.editSaleLine);

//testar
// Remove sale invoice
router.delete("/saleLines/remove/:id", login.required, saleLinesController.removeSaleLine);

module.exports = router;