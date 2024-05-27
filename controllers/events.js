const utils = require("../utils/index");
const db = require("../config/mysql");
const services = require("../Services/events");

exports.getEvents = async (req, res) => {
	try {
		let response = await services.getEvents();

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getEvent = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getEvent(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getEventsByMuseum = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getEventByMuseum(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addEvent = async (req, res) => {
	try {
		let { start_date, end_date, type, museum, status } = req.body;
		let idUserToken = req.user.id;

		let response = await services.addEvent(idUserToken, start_date, end_date, type, museum, status);

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error adding event:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editEvent = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;
		let { start_date, end_date, type,status, price } = req.body;

		let response = await services.editEvent(id,idUserToken, start_date, end_date, type,status, price);

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error editing event:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeEvent = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.removeEvent(id, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error removing event:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editPriceEvent = async (req, res) => {
	try {
		let idUserToken = req.user.id;
		let price = req.body.price;
		let eventId = req.params.id;

		let response = await services.editPriceEvent(idUserToken, eventId, price);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};
