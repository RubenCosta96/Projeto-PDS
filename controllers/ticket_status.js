const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/ticket_status");

exports.getAllTicketStatus = async (req, res) => {
    try {
        let response = await services.getAllTicketStatus();
        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.getTicketStatus = async (req, res) => {
    try {
        let id = req.params.id;

        let response = await services.getTicketStatus(id);
        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.addTicketStatus = async (req, res) => {
    try {
        let description = req.body.description;
        let idUserToken = req.user.id;
        let response = await services.addTicketStatus(idUserToken, description);
        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.removeTicketStatus = async (req, res) => {
    try {
        let id = req.params.id;
        let idUserToken = req.user.id;
        let response = await services.removeTicketStatus(idUserToken, id);
        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.editTicketStatus = async (req, res) => {
    try {
        let id = req.params.id;
        let idUserToken = req.user.id;
        let description = req.body.description;
        let response = await services.editTicketStatus(
            idUserToken,
            id,
            description
        );
        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};
