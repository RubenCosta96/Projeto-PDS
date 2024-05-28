const utils = require("../utils/index");
const db = require("../config/mysql");
const event_evaluation = require("../models/event_evaluation");
const user = require("../models/user");
const event_status = require("../models/event_status");
const services = require("../Services/event_evaluation");

exports.getEventsEval = async (req, res) => {
	try {
		let response = await services.getEventsEval();

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getEventEval = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getEventEval(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addEventsEval = async (req, res) => {
	try {
		let { description, evaluation, user_id } = req.body;

		let response = await services.addEventsEval(description, evaluation, user_id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editEventsEval = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;
		let { description, evaluation, user_id } = req.body;

		let response = await services.editEventsEval(id, idUserToken, description, evaluation, user_id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeEventsEval = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.removeEventsEval(id, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};
