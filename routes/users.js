const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users");
const UserStatusController = require("../controllers/user_status");
const UserTypeController = require("../controllers/user_types");
const login = require("../middleware/login");

// Authenticate
router.post("/users/login", usersController.login);
// Register
router.post("/users/register", usersController.register);
// Register Admin
router.post("/users/register/admin", login.required,usersController.registerAdmin);
// Verify Token
router.get("/users/token/verify/:token", usersController.tokenVerify);
// List all users
router.get("/users", login.required, usersController.getUsers);
// List specific user
router.get("/users/:id", login.required, usersController.getUser);
// Edit user
router.put("/users/edit/:id", login.required, usersController.editUser);
// Remove user
router.delete("/users/remove/:id", login.required, usersController.removeUser);
// Change User Type
router.put("/users/edit/type/:id", login.required, usersController.changeUserType);
// Change Password
router.put("/users/edit/password/:id", login.required, usersController.changePassword);
// Edit User
router.put("/users/edit/user", login.required, usersController.editUser);

// List All status
router.get("/users/status", UserStatusController.getAllUserStatus);
// List certain status
router.get("/users/status/:id", UserStatusController.getUserStatus);
// Add status
router.post("/users/status/add", login.required, UserStatusController.addUserStatus);
// Edit status
router.put("/users/status/edit/:id", login.required, UserStatusController.editUserStatus);
// Remove status
router.delete("/users/status/remove/:id", login.required, UserStatusController.removeUserState);

// List All types
router.get("/users/type", UserTypeController.getAllUserTypes);
// List certain type
router.get("/users/type/:id", UserTypeController.getUserType);
// Add types
router.post("/users/type/add", login.required, UserTypeController.addUserType);
// Edit type
router.put("/users/type/edit/:id", login.required, UserTypeController.editUserType);
// Remove type
router.delete("/users/type/remove/:id", login.required, UserTypeController.removeUserType);

module.exports = router;
