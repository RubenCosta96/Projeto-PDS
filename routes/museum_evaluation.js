const express = require("express");
const router = express.Router();

const museum_evaluationController = require("../controllers/museum_evaluation");
const login = require("../middleware/login");
const utils = require("../utils");

// List all evaluations
router.get("/museum_evaluation", museum_evaluationController.getMuseumEvaluations);
// List specific evaluation
router.get("/museum_evaluation/:id", museum_evaluationController.getMuseumEvaluation);
// Add evaluation
router.post("/museum_evaluation/add", login.required, museum_evaluationController.addMuseumEvaluation);
// Edit evaluation
router.put("/museum_evaluation/edit/:id", login.required, museum_evaluationController.editMuseumEvaluation);
// Remove evaluation
router.delete("/museum_evaluation/remove/:id", login.required, museum_evaluationController.removeMuseumEvaluation);

module.exports = router;
