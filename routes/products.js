const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products");
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

// Change User Type?? Sera que vale a pena, pode ser alterado em edit Product
//router.put("/users/edit/type/:id", login.required, usersController.changeUserType);

module.exports = router;