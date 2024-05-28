const db = require("../config/mysql");
const utils = require('../utils/index');
const services = require("../Services/notifications_state");

exports.getNotificationStates = async (req, res) => {
  try {
    
    let response = await services.getNotificationStates();

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getNotificationState = async (req, res) => {
  try {
    let id = req.params.id;

    let response = await services.getNotificationState(id);

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addNotificationState = async (req, res) => {
  try {
    let { description } = req.body;
    let idUserToken = req.user.id;

    let response = await services.addNotificationState(idUserToken, description);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding notification state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editNotificationState = async (req, res) => {
  try {
    let id = req.params.id;
    let { description } = req.body;
    let idUserToken = req.user.id;

    let response = await services.editNotificationState(idUserToken, id, description);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing notification state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeNotificationState = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let response = await services.removeNotificationState(idUserToken, id);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing notification state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
