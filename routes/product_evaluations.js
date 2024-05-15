const express = require("express");
const router = express.Router();

const ProductEvalationController = require("../controllers/product_evaluations");
const login = require("../middleware/login");

// list All evaluations
router.get("/productEvaluations", ProductEvalationController.getAllEvaluations);

// list certain evaluation
router.get("/productEvaluations/:id", ProductEvalationController.getEvaluation);

// list All evaluations related to a user
router.get("/productEvaluations/user/:id", ProductEvalationController.getEvaluationsByUser);

// list All evaluations related to a product
router.get("/productEvaluations/product/:id", ProductEvalationController.getEvaluationsByProduct);

// Add evaluations
router.post("/productEvaluations/add", login.required, ProductEvalationController.addEvaluation);

//testar
// Edit evaluation
router.put("/productEvaluations/edit/:id", login.required, ProductEvalationController.editEvaluation);

//testar
// Remove evaluation
router.delete("/productEvaluations/remove/:id", login.required, ProductEvalationController.removeEvaluation);

module.exports = router;