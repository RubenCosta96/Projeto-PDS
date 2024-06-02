const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/purchase_lines");

exports.getAllPurchaseLines = async (req, res) => {
	try {
		let response = await services.getAllPurchaseLines();

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getLinesByPurchase = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getLinesByPurchase(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getPurchaseLine = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getPurchaseLine(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addPurchaseLine = async (req, res) => {
	try {
		let quantity = req.body.quantity;
		let purchaseId = req.body.PurchaseInvoiceId;
		let prodId = req.body.productId;
		let idUserToken = req.user.id;

		let response = await services.addPurchaseLine(quantity, purchaseId, prodId, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editPurchaseLine = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;
		let { quantity, purchaseId, prodId } = req.body;

		let response = await services.editPurchaseLine(id, idUserToken, quantity, purchaseId, prodId);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removePurchaseLine = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.removePurchaseLine(id, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};
