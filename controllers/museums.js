const db = require('../config/mysql');
const utils = require('../utils/index');
const services = require("../Services/museums");

exports.getMuseums = async (req, res) => {
	try {
		
		let response = await services.getMuseums();

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getMuseumById = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getMuseumById(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getMuseumsByName = async (req, res) => {
    try {
		let name = req.params.name;

		let response = await services.getMuseumByName(name);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getMuseumsByCategory = async (req, res) => {
    try {
        let categoryName = req.params.categoryName;

        let response = await services.getMuseumByCategory(categoryName);

        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.addMuseum = async (req, res) => {
	try {

		let name = req.body.name;
		let address = req.body.address;
		let zip_ext = req.body.zip_ext;
		let category = req.body.category;
		let zip_code = req.body.zip_code;
		let idUserToken = req.user.id;

		let response = await services.addMuseum(idUserToken, name, address, zip_ext, category, zip_code);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editMuseum = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;
		let { name, address, category, zip_code, zip_ext } = req.body;

		let response = await services.editMuseum(idUserToken, id, name, address, zip_ext, category, zip_code );

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeMuseum = async (req, res) => {
	try {

		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.removeMuseum(idUserToken, id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.approveMuseum = async (req, res) => {
	try {

		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.approveMuseum(idUserToken, id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};


