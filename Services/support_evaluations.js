const { where } = require('sequelize');
const db = require('../config/mysql');
const utils = require("../utils/index");

exports.getAllSupportEvaluations = async (idUserToken) => {
    try {
        let user = await utils.userType(idUserToken);
        let result;
        
        switch (user) {
            case 1:     //Admin, tem acesso a todos os Tickets que estejam com o estado 
                result = await db.support_evaluation.findAll({
                    include: [{
                        model: db.user,
                        as: 'useru',
                        attributes: ['user_name']
                    },{
						model: db.support_ticket,
						as: 'support_ticketst',
						attributes: ['museummid']
					}]
                });
                break;
            case 2:     //Manager, tem acesso as tickets do seu museu
                let museum = await db.usermuseum.findOne({
                    where: {
                        useruid: idUserToken,
                    }
                });
				result = await db.support_evaluation.findAll({
					include: [
						{
							model: db.support_ticket,
							as: 'support_ticketst',
							attributes: ['museummid']
						},
						{
							model: db.user,
							as: 'useru',
							attributes: ['user_name']
						}
					],
					where: {
						'$support_ticketst.museummid$': museum.museummid, // Condição global usando includes
						// Adicione outras condições gerais aqui se necessário
					}
				});
                break;
            case 3:     //User, tem acesso aos seus tickets
                result = await db.support_evaluation.findAll({
                    where: {
                        useruid: idUserToken,
                    },
                    include: [{
                        model: db.support_ticket,
                        as: 'support_ticketst',
                        attributes: ['museummid']
                    },{
                        model: db.user,
                        as: 'useru',
                        attributes: ['user_name']
                    }
                ]
                });
                break;
            default:
                throw new Error("Utilizador nao reconhecido!");
        }

		let response = {
			success: 1,
			length: result.length,
			results: await Promise.all(result.map(async (support_evaluation) => {
				// Consulta para buscar o nome do museu
				const museum = await db.museum.findByPk(support_evaluation.support_ticketst.museummid);
				
				// Retornar os dados com o nome do museu
				return {
					description: support_evaluation.se_description,
					evaluation: support_evaluation.se_evaluation,
					user: support_evaluation.useruid,
					username: support_evaluation.useru.user_name,
					ticket: support_evaluation.support_ticketstid,
					museumMid: support_evaluation.support_ticketst.museummid,
					museumName: museum ? museum.museum_name : null, // Se o museu não for encontrado, retorna null
				};
			})),
		};

        return response;
    } catch (err) {
        throw new Error(err);
    }
}




exports.getSupportEvaluationsBySupportTicket = async (idUserToken) =>{
    try{
		let support_ticket = await db.support_ticket.findByPk(idUserToken);

		if (!support_ticket){
			throw new Error("Ticket inexistente!");
		} 

		let support_evaluations = await db.support_evaluation.findAll({ where: { support_ticketstid: id }});

		if (support_evaluations.length === 0){
			throw new Error("Não existem avaliações de suporte!");
		}

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

    	return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.addSupportEvaluation = async (description, evaluation, Ticketid, idUserToken) =>{
    try {
		let user = await utils.userType(idUserToken);
        
        switch (user) {
            case 1:
                throw new Error("sem permissão!");
            case 2:
                throw new Error("sem permissão!");
            case 3:
				let ticket = await db.support_ticket.findByPk(id);
				if(!ticket){
					throw new Error("Ticket inexistente!");
				}
				if(ticket.support_statesssid != 9){
					throw new Error("Sem permissão!");
				}
				let new_Support_evaluation = await db.support_evaluation.create({
					se_description: description,
					se_evaluation: evaluation,
					support_ticketstid: Ticketid,
					useruid: idUserToken
				});
                break;
            default:
                throw new Error("Utilizador nao reconhecido!");
        }
	
		let response = {
			success: 1,
			message: "Avaliação adicionada com sucesso!",
		};
	
		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.removeSupportEvaluation = async (evaluationId, idUserToken) =>{
    try{
		let user = await utils.userType(idUserToken);
        let evaluation; 

        switch (user) {
            case 1:
				evaluation = await db.support_evaluation.findByPk(evaluationId);

				if (!evaluation) {
					throw new Error("Avaliação inexistente!");
				}

				await evaluation.destroy();
                break;
            case 2:
                throw new Error("sem permissão!");
            case 3:
				evaluation = await db.support_evaluation.findByPk(evaluationId);

				if (!evaluation) {
					throw new Error("Avaliação inexistente!");
				}
				
				if(evaluation.useruid != idUserToken)
					throw new Error("sem permissão!");


				await evaluation.destroy();
                break;
            default:
                throw new Error("Utilizador nao reconhecido!");
        }

		let response = {
			success: 1,
			message: "Avaliação removida com sucesso",
		};

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.editSupportEvaluation = async (evaluationId,description,evaluate,idUserToken) =>{
    try{
		let user = await utils.userType(idUserToken);

        switch (user) {
            case 1:
				throw new Error("sem permissão!");
            case 2:
                throw new Error("sem permissão!");
            case 3:
				let evaluation = await db.support_evaluation.findByPk(id);

				if (!evaluation) {
					throw new Error("Avaliação inexistente!");
				}

				if(evaluation.useruid != idUserToken){
					throw new Error("sem permissão!");
				}

				if (description) evaluation.se_description = description;
				if (evaluate) evaluation.se_evaluation = evaluate;        

				await evaluation.save();

                break;
            default:
                throw new Error("Utilizador nao reconhecido!");
        }

		let response = {
			success: 1,
			message: "Avaliação editada com sucesso",
		};

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.refuseSupportEvaluation = async (idUserToken, ticketId) =>{
    try {
		let user = await utils.userType(idUserToken);
		
        switch (user) {
            case 1:
                throw new Error("sem permissão!");
            case 2:
                throw new Error("sem permissão!");
            case 3:
				let ticket = await db.support_ticket.findByPk(ticketId);

				if(!ticket){
					throw new Error("Ticket inexistente!");
				}

				if(ticket.support_statesssid != 9){
					throw new Error("Sem permissão!");
				}

				ticket.support_statesssid = 7;

				ticket.save();
				
                break;
            default:
                throw new Error("Utilizador nao reconhecido!");
        }
	
		let response = {
			success: 1,
			message: "Avaliação recusada",
		};
	
		return response;
	} catch (err) {
		throw new Error(err);
	}
};