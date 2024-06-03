const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/sale_lines");

exports.getAllSaleLines = async (req, res) => {
	try {
		let response = await services.getAllSaleLines();

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getLinesBySale = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getLinesBySale(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getSaleLine = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getSaleLine(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addSaleLine = async (req, res) => {
	try {
		let quantity = req.body.quantity;
		let saleId = req.body.saleInvoiceId;
		let prodId = req.body.productId;
		let idUserToken = req.user.id;

		let response = await services.addSaleLine(quantity, saleId, prodId, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editSaleLine = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;
		let { quantity, saleId, prodId } = req.body;

		let response = await services.editSaleLine(id, idUserToken, quantity, saleId, prodId);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeSaleLine = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.removeSaleLine(id, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};
