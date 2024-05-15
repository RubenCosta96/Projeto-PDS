const express = require("express");
const router = express.Router();

const UserStatusController = require("../controllers/user_status");
const login = require("../middleware/login");

// list All evaluations
router.get("/UserStatus", UserStatusController.getAllUserStatus);

// list certain evaluation
router.get("/UserStatus/:id", UserStatusController.getUserStatus);

// Add evaluations
router.post("/UserStatus/add", login.required, UserStatusController.addUserStatus);

//testar
// Edit evaluation
router.put("/UserStatus/edit/:id", login.required, UserStatusController.editUserStatus);

//testar
// Remove evaluation
router.delete("/UserStatus/remove/:id", login.required, UserStatusController.removeUserState);
// 
module.exports = router;