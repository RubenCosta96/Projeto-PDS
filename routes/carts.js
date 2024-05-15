const express = require("express");
const router = express.Router();

const CartController = require("../controllers/carts");
const login = require("../middleware/login");

// list All evaluations
router.get("/Cart", CartController.getAllCarts);

// list All evaluations
router.get("/Cart/product/:id", CartController.getCartByProduct);

// list All evaluations
router.get("/Cart/user/:id", CartController.getCartByUsers);

// list certain evaluation
router.get("/Cart/single", CartController.getCart);

// Add evaluations
router.post("/Cart/add", login.required, CartController.addCart);

// Remove evaluation
router.delete("/Cart/remove", login.required, CartController.removeCart);
 
module.exports = router;