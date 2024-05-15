const express = require("express");
const router = express.Router();

const CartController = require("../controllers/carts");
const login = require("../middleware/login");

// list All evaluations
router.get("/carts", CartController.getAllCarts);

// list All evaluations
router.get("/carts/product/:id", CartController.getCartByProduct);

// list All evaluations
router.get("/carts/user/:id", CartController.getCartByUsers);

// list certain evaluation
router.get("/carts/single", CartController.getCart);

// Add evaluations
router.post("/carts/add", login.required, CartController.addCart);

// Remove evaluation
router.delete("/carts/remove", login.required, CartController.removeCart);
 
module.exports = router;