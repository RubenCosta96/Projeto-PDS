const db = require('../config/mysql');
const utils = require("../utils/index");
const services = require("../Services/proposal_states");

exports.getAllProposalStates = async (req, res) =>{
    try{
       
        let response = await services.getAllProposalStates();

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getProposalState = async (req, res) =>{
    try{
        let id = req.params.id;

        let response = await services.getProposalState(id);

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addProposalStates = async (req, res) =>{
    try{
        let idUserToken = req.user.id;
        let description = req.body.description;

        let response = await services.addProposalStates(idUserToken, description);
    
        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeProposalStates = async (req, res) =>{
    try{
        let idUserToken = req.user.id;
        let id = req.params.id;

        let response = await services.removeProposalStates(idUserToken, id);

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editProposalStates = async (req, res) =>{
    try{
        let id = req.params.id;
		let idUserToken = req.user.id;
        let description = req.body.description;

        let response = await services.editProposalStates(idUserToken, id, description);

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};