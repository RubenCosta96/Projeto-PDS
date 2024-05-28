const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/products_type");

exports.getAllProductTypes = async (req, res) => {
  try {

    let response = await services.getAllProductTypes();
    
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getProductType = async (req, res) => {
  try {
    let id = req.params.id;
    
    let response = await services.getProductType(id);

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addProductType = async (req, res) => {
  try {
    let description = req.body.description;
    let idUserToken = req.user.id;

    let response = await services.addProductType(idUserToken, description);
    
    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding Product type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editProductType = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;
    let description = req.body.description;

    let response = await services.editProductType(id, idUserToken,description);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing Product:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeProductType = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let response = await services.removeProductType(id, idUserToken);
    
    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing Product Type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
