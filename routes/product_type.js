const express = require("express");
const router = express.Router();

const productTypeController = require("../controllers/product_type");
const login = require("../middleware/login");

// list All product types
router.get("/productTypes", productTypeController.getAllProductTypes);

// list certain product type
router.get("/productTypes/:id", productTypeController.editProductType);

// Add Product type
router.post("/productTypes/add", login.required, productTypeController.addProductType);

// Edit Product type
router.put("/productTypes/edit/:id", login.required, productTypeController.editProductType);

// Remove product type
router.delete("/productTypes/remove/:id", login.required, productTypeController.removeProductType);

module.exports = router;