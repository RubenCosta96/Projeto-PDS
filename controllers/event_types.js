const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/event_types");

exports.getEventTypes = async (req, res) => {
  try {

    let response = await services.getEventsType();

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getEventType = async (req, res) => {
  try {
    let id = req.params.id;

    let response = await services.getEventType(id);

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addEventType = async (req, res) => {
  try {
    let { description } = req.body;
    let idUserToken = req.user.id;

    let response = await services.addEventType(idUserToken, description);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding event type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editEventType = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;
    let { description } = req.body;

    let response = await services.editEventType(idUserToken,id,description);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing event type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeEventType = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let response = await services.removeEventType(idUserToken,id);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing event type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
