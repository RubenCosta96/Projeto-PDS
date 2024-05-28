const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/ad_states");

exports.getAdStates = async (req, res) => {
  try {

    let response = await services.getAdStates();

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getAdState = async (req, res) => {
  try {
    let id = req.params.id;

    let response = await services.getAdState(id);

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addAdState = async (req, res) => {
  try {
    let { description, adid } = req.body;

    let response = await services.addAdState(idUserToken,description);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding ad state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editAdState = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;
    let { description} = req.body;

    let response = await services.editAdState(id,idUserToken,description)

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing ad state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeAdState = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let response = await services.removeAdState(id,idUserToken);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing ad state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
