const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");
const user = require("../models/user");
const services = require("../Services/proposals");

exports.getAllProposals = async (req, res) => {
	try {
		let idUserToken = req.user.id;

		let response = await services.getAllProposals(idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getAllProposalsByMuseum = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getAllProposalsByMuseum(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getAllProposalsByAd = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getAllProposalsByAd(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getProposal = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getProposal(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addProposal = async (req, res) => {
	try {
		let price = req.body.price;
		let adId = req.body.adId;
		let idUserToken = req.user.id;

		let response = await services.addProposal(price, adId, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeProposal = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.removeProposal(id, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.acceptProposal = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.acceptProposal(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.rejectProposal = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.rejectProposal(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};
