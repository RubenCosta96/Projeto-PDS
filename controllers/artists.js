const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/artists");
const { response } = require("express");

exports.getArtists = async (req, res) => {
	try {
		let response = await services.getArtists();

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getArtist = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getArtist(id);

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error fetching artist:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addArtist = async (req, res) => {
	try {
		let name = req.body.name;
		let birthday = req.body.birthday;
		let idUserToken = req.user.id;

		let response = await services.addArtist(idUserToken, name, birthday);

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error adding museum:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editArtist = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;
		let { name, birthday } = req.body;

		let response = await services.addArtist(idUserToken, id, name, birthday);

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error editing artist:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeArtist = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.addArtist(idUserToken, id);

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error removing artist:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};
