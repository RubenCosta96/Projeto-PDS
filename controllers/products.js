const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/products");

exports.getAllProducts = async (req, res) => {
	try {
		let response = await services.getAllProducts();

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getProductsByMuseum = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getProductsByMuseum(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getProductsByCategory = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getProductsByCategory(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getProduct = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getProduct(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addProduct = async (req, res) => {
	try {
		let name = req.body.name;
		let price = req.body.price;
		let mid = req.body.museummid;
		let type = req.body.type;
		let idUserToken = req.user.id;

		let response = await services.addProduct(name, price, mid, type, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editProduct = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;
		let { name, price, museummid, type } = req.body;

		let response = await services.editProduct(id, idUserToken, name, price, museummid, type);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeProduct = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.removeProduct(id, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};
