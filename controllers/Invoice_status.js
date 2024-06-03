const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/invoice_status");

exports.getAllInvoiceStatus = async (req, res) => {
	try {
		let response = await services.getAllInvoiceStatus();

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getInvoiceStatus = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getInvoiceStatus(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addInvoiceStatus = async (req, res) => {
	try {
		let description = req.body.description;
		let idUserToken = req.user.id;

		let response = await services.addInvoiceStatus(description, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editInvoiceStatus = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;
		let description = req.body.description;

		let response = await services.editInvoiceStatus(id, idUserToken, description);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeUserState = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.removeUserState(id, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};
