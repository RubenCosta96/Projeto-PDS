const express = require("express");
const router = express.Router();

const favoritesController = require("../controllers/favorites");
const login = require("../middleware/login");
const utils = require("../utils");

// List all favorites
router.get("/favorites", login.required, favoritesController.getFavorites);
// Get favorite by ID
router.get("/favorites/:id", login.required, favoritesController.getFavoriteById);
// Add favorite
router.post("/favorites/add", login.required, favoritesController.addFavorite);
// Remove favorite
router.delete("/favorites/remove/:id", login.required, favoritesController.removeFavorite);

module.exports = router;
