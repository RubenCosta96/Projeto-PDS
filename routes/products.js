const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products");
const productTypeController = require("../controllers/product_type");
const ProductEvalationController = require("../controllers/product_evaluations");
const login = require("../middleware/login");

// list All products
router.get("/products", productsController.getAllProducts);

// list certain museum products
router.get("/products/museum/:id", productsController.getProductsByMuseum);

//list certain type products
router.get("/products/category/:id", productsController.getProductsByCategory);

//List specific Product
router.get("/products/:id", productsController.getProduct);

// Add Product
router.post("/products/add", login.required, productsController.addProduct);

// Edit Product
router.put("/products/edit/:id", login.required, productsController.editProduct);

// Remove user
router.delete("/products/remove/:id", login.required, productsController.removeProduct);

// list All evaluations
router.get("/products/evaluations", ProductEvalationController.getAllEvaluations);

// list certain evaluation
router.get("/products/evaluations/:id", ProductEvalationController.getEvaluation);

// list All evaluations related to a user
router.get("/products/evaluations/user/:id", ProductEvalationController.getEvaluationsByUser);

// list All evaluations related to a product
router.get("/products/evaluations/product/:id", ProductEvalationController.getEvaluationsByProduct);

// Add evaluations
router.post("/products/evaluations/add", login.required, ProductEvalationController.addEvaluation);

// Edit evaluation
router.put("/products/evaluations/edit/:id", login.required, ProductEvalationController.editEvaluation);

// Remove evaluation
router.delete("/products/evaluations/remove/:id", login.required, ProductEvalationController.removeEvaluation);

// list All product types
router.get("/products/types", productTypeController.getAllProductTypes);

// list certain product type
router.get("/products/types/:id", productTypeController.editProductType);

// Add Product type
router.post("/products/types/add", login.required, productTypeController.addProductType);

// Edit Product type
router.put("/products/types/edit/:id", login.required, productTypeController.editProductType);

// Remove product type
router.delete("/products/types/remove/:id", login.required, productTypeController.removeProductType);

module.exports = router;