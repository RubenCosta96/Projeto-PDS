const express = require("express");
const router = express.Router();

const adController = require("../controllers/ads");
const login = require("../middleware/login");
const utils = require("../utils");
const user = require("../models/user");

// List all ads
router.get("/ads", adController.getAds);
// List specific ad
router.get("/ads/:id", adController.getAd);
// Add ad
router.post("/ads/add", login.required, adController.addAd);
// Edit ad
router.put("/ads/edit/:id", login.required, adController.editAd);
// Remove ad
router.delete("/ads/remove/:id", login.required, adController.removeAd);

module.exports = router;
