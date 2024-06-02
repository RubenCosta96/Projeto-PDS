const { where } = require("sequelize");
const db = require("../config/mysql");
const user = require("../models/user");
const utils = require("../utils/index");
const services = require("../Services/carts");

exports.getAllCarts = async (req, res) => {
	try {
		let response = await services.getAllCarts();

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getCartByProduct = async (req, res) => {
	try {
		let prodId = req.params.id;

		let response = await services.getCartByProduct(prodId);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getCartByUsers = async (req, res) => {
	try {
		let userId = req.params.id;

		let response = await services.getCartByUsers(userId);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getCart = async (req, res) => {
	try {
		let userId = req.body.userId;
		let prodId = req.body.productId;

		let response = await services.getCart(userId, prodId);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addCart = async (req, res) => {
	try {
		let quantity = req.body.quantity;
		let prodId = req.body.productId;
		let idUserToken = req.user.id;

		let response = await services.addCart(quantity, prodId, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeCart = async (req, res) => {
	try {
		let prodId = req.body.productId;
		let idUserToken = req.user.id;

		let response = await services.removeCart(prodId, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};
