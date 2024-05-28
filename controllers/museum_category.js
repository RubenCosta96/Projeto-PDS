const utils = require("../utils/index");
const db = require("../config/mysql");
const services = require("../Services/museum_category");

exports.getMuseumCategories = async (req, res) => {
  try {

    let response = await services.getMuseumCategories();

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getMuseumCategory = async (req, res) => {
  try {
    let id = req.params.id;

    let response = await services.getMuseumCategory(id);

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addMuseumCategory = async (req, res) => {
  try {
    let { description } = req.body;
    let idUserToken = req.user.id;

    let response = await services.addMuseumCategory(idUserToken, description);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding category:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editMuseumCategory = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;
    let { description } = req.body;

    let response = await services.editMuseumCategory(idUserToken,id,description);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing category:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeMuseumCategory = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let response = await services.removeMuseumCategory(idUserToken,id);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing category:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
