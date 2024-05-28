const utils = require("../utils/index");
const db = require("../config/mysql");
const services = require("../Services/favorites");

exports.getFavorites = async (req, res) => {
    try {
        let response = await services.getFavorites();

        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.getFavoriteById = async (req, res) => {
    try {
        let id = req.params.id;

        let response = await services.getFavoriteById(id);

        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.addFavorite = async (req, res) => {
    try {
        let product_id = req.body.product_id;
        let idUserToken = req.user.id;

        let response = await services.addFavorite(idUserToken, product_id);

        return res.status(200).send(response);
    } catch (err) {
        console.error("Error adding favorite:", err);
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        let id = req.params.id;
        let idUserToken = req.user.id;

        let response = await services.removeFavorite(idUserToken, id);

        return res.status(200).send(response);
    } catch (err) {
        console.error("Error removing favorite:", err);
        return res.status(500).send({ error: err, message: err.message });
    }
};
