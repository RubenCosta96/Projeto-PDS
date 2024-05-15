const express = require("express");
const router = express.Router();

const UserMuseumController = require("../controllers/usermuseums");
const login = require("../middleware/login");

// list All evaluations
router.get("/UserMuseum", UserMuseumController.getAllUserMuseum);

// list certain evaluation
router.get("/UserMuseum/specific", UserMuseumController.getUserMuseum);

// Add evaluations
router.post("/UserMuseum/add", login.required, UserMuseumController.addUserMuseum);

// Remove evaluation
router.delete("/UserMuseum/remove", login.required, UserMuseumController.removeUserMuseum);
 
module.exports = router;