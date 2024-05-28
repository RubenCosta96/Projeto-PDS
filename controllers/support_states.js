const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../services/support_states");

exports.getAllSupportStates = async (req, res) => {
    try {
        let response = await services.getAllSupportStates();

        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.getSupportState = async (req, res) => {
    try {
        let id = req.params.id;

        let response = await services.getSupportState(id);

        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.addSupportState = async (req, res) => {
    try {
        let idUserToken = req.user.id;
        let ss_description = req.body.description;

        let response = await services.addSupportState(
            idUserToken,
            ss_description
        );

        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.removeSupportState = async (req, res) => {
    try {
        let idUserToken = req.user.id;
        let id = req.params.id;

        let response = await services.removeSupportState(idUserToken, id);

        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.editSupportState = async (req, res) => {
    try {
        let id = req.params.id;
        let idUserToken = req.user.id;
        let description = req.body.description;

        let response = await services.editSupportState(
            idUserToken,
            id,
            description
        );

        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};
