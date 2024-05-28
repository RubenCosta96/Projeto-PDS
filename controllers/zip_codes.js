const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/zip_codes");

exports.getAllZipCodes = async (req, res) => {
    try {
        let response = await services.getAllZipCodes();
        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.getZipCode = async (req, res) => {
    try {
        let code = req.params.id;
        let response = await services.getZipCode(code);
        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.addZipCode = async (req, res) => {
    try {
        let code = req.body.zipCode;
        let location = req.body.location;
        let idUserToken = req.user.id;
        let response = await services.addZipCode(idUserToken, code, location);
        return res.status(200).send(response);
    } catch (err) {
        console.error("Error adding record:", err);
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.removeZipCode = async (req, res) => {
    try {
        let code = req.body.zipCode;
        let idUserToken = req.user.id;
        let response = await services.removeZipCode(idUserToken, code);
        return res.status(200).send(response);
    } catch (err) {
        console.error("Error removing record:", err);
        return res.status(500).send({ error: err, message: err.message });
    }
};
