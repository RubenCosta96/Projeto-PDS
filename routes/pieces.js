const express = require("express");
const router = express.Router();

const piecesController = require("../controllers/pieces");
const pieceCategoryController = require("../controllers/piece_category");
const login = require("../middleware/login");

// List all pieces
router.get("/pieces", piecesController.getPieces);
// List specific piece by id
router.get("/pieces/:id", piecesController.getPieceById);
// List specific piece by name
router.get("/pieces/name/:name", piecesController.getPiecesByName);
// List specific piece by category
router.get("/pieces/category/name/:category", piecesController.getPiecesByCategory);
// List specific piece by collection
router.get("/pieces/collection/name/:collection", piecesController.getPiecesByCollection);
// List pieces by museum
router.get("/pieces/museum/:id", piecesController.getPiecesByMuseum);
// Add pieces
router.post("/pieces/add", login.required, piecesController.addPieces);
// Remove pieces
router.delete("/pieces/remove/:id", login.required, piecesController.removePiece);

// Listar todas as categorias de peças
router.get("/pieces/category", pieceCategoryController.getPieceCategories);
// Listar uma categoria de peça específica
router.get("/pieces/category/:id", pieceCategoryController.getPieceCategory);
// Adicionar uma categoria de peça
router.post("/pieces/category/add", login.required, pieceCategoryController.addPieceCategory);
// Editar uma categoria de peça
router.put("/pieces/category/edit/:id", login.required, pieceCategoryController.editPieceCategory);
// Remover uma categoria de peça
router.delete("/pieces/category/remove/:id", login.required, pieceCategoryController.removePieceCategory);


module.exports = router;
