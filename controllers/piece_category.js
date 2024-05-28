const db = require("../config/mysql");
const utils = require('../utils/index');
const services = require("../Services/piece_category");

exports.getPieceCategories = async (req, res) => {
  try {
    
    let response = await services.getPieceCategories();

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getPieceCategory = async (req, res) => {
  try {
    let id = req.params.id;

    let response = await services.getPieceCategory(id);

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addPieceCategory = async (req, res) => {
  try {
    let { description } = req.body;
    let idUserToken = req.user.id;

    let response = await services.addPieceCategory(idUserToken, description);

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
    let idUserToken = req.user.id;

    let response = await services.editPieceCategory(idUserToken, id);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing piece category:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removePieceCategory = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let response = await services.removePieceCategory(idUserToken, id);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing piece category:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
