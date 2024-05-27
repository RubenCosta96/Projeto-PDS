const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/tickets");

exports.getAllTickets = async (req, res) => {
	try {
		let idUserToken = req.user.id;

		let response = await services.getTickets(idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getAllTicketsByEvent = async (req, res) => {
	try {
		let idUserToken = req.user.id;
		let id = req.params.id;

		let response = await services.getTicketsByEvent(idUserToken, id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addTickets = async (req, res) => {
	try {
		let idUserToken = req.user.id;
		let purchase_date = req.body.purchase_date;
		let eventId = req.params.event;
		let quantity = req.body.quantity;

		let response = await services.addTickets(idUserToken, purchase_date, eventId, quantity);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};
