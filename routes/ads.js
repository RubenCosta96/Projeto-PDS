const express = require("express");
const router = express.Router();

const adController = require("../controllers/ads");
const ad_statesController = require("../controllers/ad_states");
const login = require("../middleware/login");
const utils = require("../utils");
const user = require("../models/user");

// List all ads
router.get("/ads", login.required,adController.getAds);
// List specific ad
router.get("/ads/:id", login.required,adController.getAd);
// Add ad
router.post("/ads/add", login.required, adController.addAd);
// Edit ad
router.put("/ads/edit/:id", login.required, adController.editAd);
// Remove ad
router.delete("/ads/remove/:id", login.required, adController.removeAd);
// Confirm payment
router.put("/ads/confirmPayment/:id", login.required, adController.confirmPayment);
// Confirm Reception
router.put("/ads/confirmReception/:id", login.required, adController.confirmReception);

// List all ad states
router.get("/ads/states", login.required,ad_statesController.getAdStates);
// List specific ad state
router.get("/ads/states/:id", login.required,ad_statesController.getAdState);
// Add ad state
router.post("/ads/states/add", login.required, ad_statesController.addAdState);
// Edit ad
router.put("/ads/states/edit/:id", login.required, ad_statesController.editAdState);
// Remove ad
router.delete("/ads/states/remove/:id", login.required, ad_statesController.removeAdState);

module.exports = router;
