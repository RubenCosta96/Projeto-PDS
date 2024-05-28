const db = require("../config/mysql");
const utils = require('../utils/index');
const services = require("../Services/notifications_type");

exports.getNotificationTypes = async (req, res) => {
  try {

    let response = await services.getNotificationTypes();

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getNotificationType = async (req, res) => {
  try {
    let id = req.params.id;

    let response = await services.getNotificationType(id);

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addNotificationType = async (req, res) => {
  try {
    let { description } = req.body;
    let idUserToken = req.user.id;

    let response = await services.addNotificationType(idUserToken,description);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding notification type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editNotificationType = async (req, res) => {
  try {
    let id = req.params.id;
    let { description } = req.body;
    let idUserToken = req.user.id;
   
    let response = await services.editNotificationType(idUserToken, id, description);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing notification type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeNotificationType = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let response = await services.removeNotificationType(idUserToken, id);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing notification type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
