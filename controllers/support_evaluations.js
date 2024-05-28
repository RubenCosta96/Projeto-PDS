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


/*
exports.getAllSupportEvaluations = async (req, res) =>{
    try{
		let support_evaluations = await db.support_evaluation.findAll();

		if (support_evaluations.length === 0) return res.status(404).send({ success: 0, message: "Não existem avaliações de suporte." });

		

    	let response = {
      		success: 1,
      		length: support_evaluations.length,
      		results: support_evaluations.map((support_evaluation) => {
        		return {
					description: support_evaluation.se_description,
					evaluation: support_evaluation.se_evaluation,
					user: support_evaluation.useruid,
					ticket: support_evaluation.support_ticketstid,
       			 };
     		 }),
   		 };

    	return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}

};
*/



exports.getSupportEvaluations = async (req, res) =>{
    try{
        let id = req.params.id
		
		let support_ticket = await db.support_ticket.findByPk(id);
		if (!support_ticket) return res.status(404).send({ success: 0, message: "Ticket inexistente" });

		let support_evaluations = await db.support_evaluation.findAll({ where: { support_ticketstid: id }});

		if (support_evaluations.length === 0) return res.status(404).send({ success: 0, message: "Não existem avaliações de suporte." });

    	let response = {
      		success: 1,
      		length: support_evaluations.length,
      		results: support_evaluations.map((support_evaluation) => {
        		return {
					description: support_evaluation.se_description,
					evaluation: support_evaluation.se_evaluation,
					user: support_evaluation.useruid,
					ticket: support_evaluation.support_ticketstid,
       			 };
     		 }),
   		 };

    	return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addSupportEvaluation = async (req, res) =>{
    try {
		let description = req.body.description;
		let evaluation = req.body.evaluation;
		let id = req.params.id;
		let idUserToken = req.user.id;

		let ticket = await db.support_ticket.findByPk(id);
		if(!ticket){
			return res.status(404).send({ success: 0, message: "Ticket inexistente" });
		}
        if (ticket.useruid !== idUserToken) {
            return res.status(403).send({ success: 0, message: "Apenas o autor do ticket pode fornecer feedback" });
        }
		if(ticket.support_statesssid != 3){
			return res.status(403).send({ success: 0, message: 'Sem permissão' });
		}
	
		let new_Support_evaluation = await db.support_evaluation({
			se_description: description,
			se_evaluation: evaluation,
			support_ticketstid: ticket,
			useruid: userId
		});
	
		let response = {
			success: 1,
			message: "Pedido de Suporte avaliado com sucesso",
		};
	
		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removeSupportEvaluation = async (req, res) =>{
    try{
        let id = req.params.id;
		let idUserToken = req.user.id;

		let isAdmin = await utils.isAdmin(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: 'Sem permissão' });

        let evaluation = await db.support_evaluation.findByPk(id);

        if (!evaluation) {
			return res.status(404).send({ success: 0, message: "Avaliação inexistente" });
		}

        await evaluation.destroy();

		let response = {
			success: 1,
			message: "Avaliação removida com sucesso",
		};

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

        let evaluation = await db.support_evaluation.findByPk(id);

        if (!evaluation) {
			return res.status(404).send({ success: 0, message: "Avaliação inexistente" });
		}

        if(evaluation.useruid != idUserToken){
            return res.status(403).send({ success: 0, message: 'Sem permissão' });
        }

        evaluation.se_description = description;
        evaluation.se_evaluation = evaluate;
        evaluation.useruid = idUserToken;
        evaluation.ticketstid = id;

        await evaluation.save();

		let response = {
			success: 1,
			message: "Avaliação editada com sucesso",
		};

        return res.status(200).send(response);
    }catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};