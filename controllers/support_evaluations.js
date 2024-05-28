const db = require('../config/mysql');
const utils = require("../utils/index");
const services = require('../services/support_evaluations');


exports.getAllSupportEvaluations = async (req, res) =>{
    try{
		let idUserToken = req.user.id;

		let response = await services.getAllSupportEvaluations(idUserToken);

    	return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}

};

exports.getSupportEvaluations = async (req, res) =>{
    try{
        let id = req.params.id
		
		let response = await services.getSupportEvaluationsBySupportTicket(id);

    	return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

//Testar a partir daqui 
exports.addSupportEvaluation = async (req, res) =>{
    try {
		let description = req.body.description;
		let evaluation = req.body.evaluation;
		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = services.addSupportEvaluation(description,evaluation,id,idUserToken);
	
		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeSupportEvaluation = async (req, res) =>{
    try{
        let id = req.params.id;
		let idUserToken = req.user.id;

		let response = services.removeSupportEvaluation(id,idUserToken);

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editSupportEvaluation = async (req, res) =>{
    try{
        let id = req.params.id;
		let idUserToken = req.user.id;
        let description = req.body.description;
        let evaluate = req.body.evaluate;

        let response = services.editSupportEvaluation(id,description,evaluate,idUserToken);

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};


exports.refuseSupportEvaluation = async (req, res) =>{
    try{
        let id = req.body.Ticketid;
		let idUserToken = req.user.id;

        let response = await services.refuseSupportEvaluation(idUserToken, id);

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};