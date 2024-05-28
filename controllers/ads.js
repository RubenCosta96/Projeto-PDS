const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require('../Services/ads');

exports.getAds = async (req, res) => {
  try {

    let response = await services.getAds();

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getAd = async (req, res) => {
  try {
    let id = req.params.id;

    let response = await services.getAdById(id);

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addAd = async (req, res) => {
  try {
    let {piece_id, description } = req.body;
    let userToken = req.user.id;

    let response = await services.addAd(piece_id, description, userToken);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding ad:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editAd = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;
    let {piece_id, description } = req.body;

    let response = await services.editAd(idUserToken,piece_id,description);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing ad:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.removeAd = async (req, res) => {
  try {
    let id = req.params.id;

    let response = await services.adRemove(id);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing ad:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.confirmPayment = async (req, res) => {
  try {
    let id = req.params.id;
    let propId = req.body.proposalId;

    let response = await services.confirmPayment(id, propId);

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.confirmReception = async (req, res) => {
  try {
    let id = req.params.id;
    let propId = req.body.proposalId;

    let response = await services.confirmReception(id,propId);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing ad:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};


