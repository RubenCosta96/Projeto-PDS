const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/user_status");

exports.getAllUserStatus = async (req, res) => {
  try {

    let response = await services.getUsersStatus();

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getUserStatus = async (req, res) => {
  try {
    let id = req.params.id;

    let response = await services.getUserStatus(id);

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.addUserStatus = async (req, res) => {
  try {
    let description = req.body.description;
    let idUserToken = req.user.id;
    
    let response = await services.addUserStatus(idUserToken,description);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding User Status", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.editUserStatus = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;
    let description = req.body.description;

    let response = await services.editUserStatus(idUserToken, id, description);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing user state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeUserState = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let response = await services.removeEventStatus(idUserToken, id);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing User State:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
