const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/usermuseums");
const user = require("../models/user");

exports.getAllUserMuseum = async (req, res) => {
	try {
		let response = await services.getAllUserMuseum();

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getUserMuseum = async (req, res) => {
	try {
		let museumId = req.body.museumId;
		let userId = req.body.userId;

		let response = await services.getUserMuseum(museumId, userId);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addUserMuseum = async (req, res) => {
	try {
		let museumId = req.body.museumId;
		let userId = req.body.userId;
		let idUserToken = req.user.id;

		let response = await services.addUserMuseum(museumId, userId, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeUserMuseum = async (req, res) => {
	try {
		let museumId = req.body.museumId;
		let userId = req.body.userId;
		let idUserToken = req.user.id;

		let response = await services.removeUserMuseum(museumId, userId, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};
