const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/purchase_invoices");

exports.getAllPurchases = async (req, res) => {
	try {
		let response = await services.getAllPurchases();

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getPurchasesByMuseum = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getPurchasesByMuseum(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getPurchasesByInvoiceStatus = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getPurchasesByInvoiceStatus(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getPurchase = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getPurchase(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addPurchase = async (req, res) => {
	try {
		let date = req.body.date;
		let museumid = req.body.museum_id;
		let idUserToken = req.user.id;

		let response = await services.addPurchase(date, museumid, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editPurchase = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;
		let { date, museum_id, invoiceStatus } = req.body;

		let response = await services.editPurchase(id, idUserToken, date, museum_id, invoiceStatus);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removePurchase = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.removePurchase(id, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.emitePurchase = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.emitePurchase(idUserToken, id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};
