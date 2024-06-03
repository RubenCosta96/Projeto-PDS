const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/sale_invoices");

exports.getAllSales = async (req, res) => {
	try {
		let response = await services.getAllSales();

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getSalesByUser = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getSalesByUser(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getSalesByInvoiceStatus = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getSalesByInvoiceStatus(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getSale = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getSale(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addSale = async (req, res) => {
	try {
		let date = req.body.date;
		let userid = req.body.user_id;
		let invoiceStatus = req.body.invoice_status;
		let idUserToken = req.user.id;

		let response = await services.addSale(date, userid, invoiceStatus, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editSale = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;
		let { date, user_id, invoiceStatus } = req.body;

		let response = await services.editSale(id, idUserToken, date, user_id, invoiceStatus);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeSale = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.removeSale(id, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};
