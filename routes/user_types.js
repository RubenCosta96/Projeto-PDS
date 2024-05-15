const express = require("express");
const router = express.Router();

const UserTypeController = require("../controllers/user_types");
const login = require("../middleware/login");

// list All evaluations
router.get("/UserType", UserTypeController.getAllUserTypes);

// list certain evaluation
router.get("/UserType/:id", UserTypeController.getUserType);

// Add evaluations
router.post("/UserType/add", login.required, UserTypeController.addUserType);

//testar
// Edit evaluation
router.put("/UserType/edit/:id", login.required, UserTypeController.editUserType);

//testar
// Remove evaluation
router.delete("/UserType/remove/:id", login.required, UserTypeController.removeUserState);
 
module.exports = router;