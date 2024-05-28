const db = require('../config/mysql');
const utils = require("../utils/index");
const services = require('../Services/pieces');

exports.getPieces = async (req, res) => {
	try {
		
		let response = await services.getPieces();

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getPieceById = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getPieceById(id);

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error fetching piece:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getPiecesByName = async (req, res) => {
    try {
		let name = req.params.name;

		let response = await services.getPieceByName(name);

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error fetching pieces by name:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
}

exports.getPiecesByCategory = async (req, res) => {
    try {
        let categoryName = req.params.categoryName;

		let response = await services.getPieceByCategory(categoryName);

        return res.status(200).send(response);
    } catch (err) {
        console.error("Error fetching pieces by category:", err);
        return res.status(500).send({ error: err, message: err.message });
    }
}

exports.getPiecesByCollection = async (req, res) => {
    try {
        let collectionName = req.params.collectionName;

		let response = await services.getPieceByCollection(collectionName);

        return res.status(200).send(response);
    } catch (err) {
        console.error("Error fetching pieces by collection:", err);
        return res.status(500).send({ error: err, message: err.message });
    }
}

exports.getPiecesByMuseum = async (req, res) => {
    try {
        let id = req.params.id;

		let response = await services.getPieceByMuseum(id);

        return res.status(200).send(response);
    } catch (err) {
        console.error("Error fetching pieces by collection:", err);
        return res.status(500).send({ error: err, message: err.message });
    }
}

exports.addPieces = async (req, res) => {
	try {

		let name = req.body.name;
        let artist = req.body.artist;
        let collection = req.body.collection;
        let category = req.body.category;
        let museum = req.body.museum;
		
		let response = await services.addPieces(name, artist, collection, category, museum);

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error adding piece:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removePiece = async (req, res) => {
	try {

		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.removePiece(id, idUserToken);
		
		return res.status(200).send(response);
	} catch (err) {
		console.error("Error removing piece:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};
