const express = require("express");
const router = express.Router();

const museumsController = require("../controllers/museums");
const museum_categoryController = require("../controllers/museum_category");
const museum_evaluationController = require("../controllers/museum_evaluation");
const login = require("../middleware/login");

// List all museums
router.get("/museums", museumsController.getMuseums);
// List specific museum by id
router.get("/museums/:id", museumsController.getMuseumById);
// List specific museum by id
router.get("/museums/name/:name", museumsController.getMuseumsByName);
// List specific museum by category
router.get("/museums/category/:category", museumsController.getMuseumsByCategory);
// Add museum
router.post("/museums/add", login.required, museumsController.addMuseum);
// Edit museum
router.put("/museums/edit/:id", login.required, museumsController.editMuseum);
// Remove museum
router.delete("/museums/remove/:id", login.required, museumsController.removeMuseum);
// Approve museum
router.put("/museums/approve/:id", login.required, museumsController.approveMuseum);

//List all collections
router.get("/museums/category", museum_categoryController.getMuseumCategories);
// List specific collection
router.get("/museums/category/:id", museum_categoryController.getMuseumCategory);
// Add collection
router.post("/museums/category/add", login.required, museum_categoryController.addMuseumCategory);
// Edit collection
router.put("/museums/category/edit/:id", login.required, museum_categoryController.editMuseumCategory);
// Remove artist
router.delete("/museums/category/remove/:id", login.required, museum_categoryController.removeMuseumCategory);


// List all evaluations
router.get("/museums/evaluation", museum_evaluationController.getMuseumEvaluations);
// List specific evaluation
router.get("/museum/evaluation/:id", museum_evaluationController.getMuseumEvaluation);
// Add evaluation
router.post("/museum/evaluation/add", login.required, museum_evaluationController.addMuseumEvaluation);
// Edit evaluation
router.put("/museum/evaluation/edit/:id", login.required, museum_evaluationController.editMuseumEvaluation);
// Remove evaluation
router.delete("/museum/evaluation/remove/:id", login.required, museum_evaluationController.removeMuseumEvaluation);

module.exports = router;
