const express = require("express");
const router = express.Router();

const pieceCategoryController = require("../controllers/piece_category");
const login = require("../middleware/login");
const utils = require("../utils");

// Listar todas as categorias de peças
router.get("/piece_category", pieceCategoryController.getPieceCategories);
// Listar uma categoria de peça específica
router.get("/piece_category/:id", pieceCategoryController.getPieceCategory);
// Adicionar uma categoria de peça
router.post("/piece_category/add", login.required, pieceCategoryController.addPieceCategory);
// Editar uma categoria de peça
router.put("/piece_category/edit/:id", login.required, pieceCategoryController.editPieceCategory);
// Remover uma categoria de peça
router.delete("/piece_category/remove/:id", login.required, pieceCategoryController.removePieceCategory);

module.exports = router;
