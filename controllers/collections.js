const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/collections");

exports.getCollections = async (req, res) => {
  try {

    let response = await services.getCollections();

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getCollection = async (req, res) => {
  try {
    let id = req.params.id;

    let response = await services.getCollection(id);

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addCollection = async (req, res) => {
  try {
    let name = req.body.name;
    let idUserToken = req.user.id;

    let response = await services.addCollection(idUserToken, name);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding collection:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editCollection = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;
    let { name } = req.body;

    let response = await services.editCollection(idUserToken, name);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing collection:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeCollection = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let response = await services.removeCollection(idUserToken, id);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing collection:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
