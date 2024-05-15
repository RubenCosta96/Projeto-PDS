const express = require("express");
const router = express.Router();

const UserMuseumController = require("../controllers/usermuseums");
const login = require("../middleware/login");

// list All evaluations
router.get("/userMuseum", UserMuseumController.getAllUserMuseum);

// list certain evaluation
router.get("/userMuseum/specific", UserMuseumController.getUserMuseum);

// Add evaluations
router.post("/userMuseum/add", login.required, UserMuseumController.addUserMuseum);

// Remove evaluation
router.delete("/userMuseum/remove", login.required, UserMuseumController.removeUserMuseum);
 
module.exports = router;