const db = require("../config/mysql");
const utils = require('../utils/index');

exports.getPieceCategories = async (req, res) => {
  try {
    let pieceCategories = await db.piece_category.findAll();

    if (pieceCategories.length === 0) {
      return res.status(404).send({ success: 0, message: "Não existem categorias de peças" });
    }

    let response = {
      success: 1,
      length: pieceCategories.length,
      results: pieceCategories.map((pieceCategory) => {
        return {
          description: pieceCategory.pc_description,
        };
      }),
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getPieceCategory = async (req, res) => {
  try {
    let id = req.params.id;

    let pieceCategory = await db.piece_category.findByPk(id);

    if (!pieceCategory) {
      return res.status(404).send({ success: 0, message: "Categoria de peça inexistente" });
    }

    let response = {
      success: 1,
      length: 1,
      results: [
        {
          description: pieceCategory.pc_description,
        },
      ],
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addPieceCategory = async (req, res) => {
  try {
    let { description } = req.body;

    let newPieceCategory = await db.piece_category.create({
      pc_description: description,
    });

    let response = {
      success: 1,
      message: "Categoria de peça criada com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding piece category:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editPieceCategory = async (req, res) => {
  try {
    let id = req.params.id;
    let { description } = req.body;

    let pieceCategory = await db.piece_category.findByPk(id);

    if (!pieceCategory) {
      return res.status(404).send({ success: 0, message: "Categoria de peça inexistente" });
    }

    if (description) {
      pieceCategory.pc_description = description;
      await pieceCategory.save();
    }

    let response = {
      success: 1,
      message: "Categoria de peça editada com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing piece category:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removePieceCategory = async (req, res) => {
  try {
    let id = req.params.id;

    const pieceCategory = await db.piece_category.findByPk(id);

    if (!pieceCategory) {
      return res.status(404).send({ success: 0, message: "Categoria de peça inexistente" });
    }

    await pieceCategory.destroy();

    let response = {
      success: 1,
      message: "Categoria de peça removida com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing piece category:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
