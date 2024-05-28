const utils = require("../utils/index");
const db = require("../config/mysql");
const services = require("../Services/museum_evaluation");
const user = require("../models/user");

exports.getMuseumEvaluations = async (req, res) => {
	try {
		let response = await services.getMuseumEvaluations();

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getMuseumEvaluation = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getMuseumEvaluation(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addMuseumEvaluation = async (req, res) => {
	try {
		let { description, evaluation, museumId, userId } = req.body;

		let response = await services.addMuseumEvaluation(description, evaluation, museumId, userId);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editMuseumEvaluation = async (req, res) => {
	try {
		let id = req.params.id;
		let { description, evaluation } = req.body;

		let response = await services.editMuseumEvaluation(id, description, evaluation);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeMuseumEvaluation = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.removeMuseumEvaluation(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};
