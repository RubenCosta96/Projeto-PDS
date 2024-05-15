const express = require("express");
const router = express.Router();

const ZipCodeController = require("../controllers/zip_codes");
const login = require("../middleware/login");

// list All evaluations
router.get("/zipCode", ZipCodeController.getAllZipCodes);

// list certain evaluation
router.get("/zipCode/:id", ZipCodeController.getZipCode);

// Add evaluations
router.post("/zipCode/add", login.required, ZipCodeController.addZipCode);

// Remove evaluation
router.delete("/zipCode/remove", login.required, ZipCodeController.removeZipCode);
 
module.exports = router;