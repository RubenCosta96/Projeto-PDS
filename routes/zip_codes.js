const express = require("express");
const router = express.Router();

const ZipCodeController = require("../controllers/zip_codes");
const login = require("../middleware/login");

// list All evaluations
router.get("/ZipCode", ZipCodeController.getAllZipCodes);

// list certain evaluation
router.get("/ZipCode/:id", ZipCodeController.getZipCode);

// Add evaluations
router.post("/ZipCode/add", login.required, ZipCodeController.addZipCode);

// Remove evaluation
router.delete("/ZipCode/remove", login.required, ZipCodeController.removeZipCode);
 
module.exports = router;