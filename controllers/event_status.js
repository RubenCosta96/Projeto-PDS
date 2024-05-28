const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/event_status");

exports.getEventsStatus = async (req, res) => {
  try {

    let response = await services.getEventsStatus();

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getEventStatus = async (req, res) => {
  try {
    let id = req.params.id;
    
    let response = await services.getEventStatus(id);

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addEventStatus = async (req, res) => {
  try {
    let { description } = req.body;
    let idUserToken = req.user.id;

    let response = await services.addEventStatus(idUserToken, description);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding event state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editEventStatus = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;
    let { description } = req.body;

    let response = await services.editEventStatus(idUserToken, id, description);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing event state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeEventStatus = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let response = await services.editEventStatus(idUserToken, id);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing event state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
