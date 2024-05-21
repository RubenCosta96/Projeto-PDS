const db = require('../config/mysql');
const utils = require('../utils/index');
const notification = require('./notifications');
const services = require('../Services/support_tickets')

exports.getSupportTickets = async (req, res) => {
	try {
		let idUserToken = req.user.id;

		
		let response = await services.SupportTickets(idUserToken);

		if (response.length === 0)
			return res.status(404).send({ success: 0, message: "Não existem pedidos de suporte" });

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getSupportTicket = async (req, res) => {
    try {
        let idUserToken = req.user.id;
        let id = req.params.id;

        let response = await services.getSupportTicket(idUserToken,id);

		if(response.length === 0)
			return res.status(404).send({ success: 0, message: "Não existem pedidos de suporte" });
		
        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};


exports.addSupportTicket = async (req, res) => {
	try {
		let description = req.body.description;
		let museumId = req.body.museum;
		let idUserToken = req.user.id;

		let museum = await db.museum.findByPk(museumId);

		if(!museum) return res.status(404).send({ success: 0, message: "Museu inexistente" });

		let newSupport_Ticket = await db.support_ticket.create({
			Description: description,
			support_statesssid: 1,
			museummid: museumId,
			useruid: idUserToken,
		});

		let response = {
			success: 1,
			message: "Pedido de Suporte criado com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editSupportTicket = async (req, res) =>{
	try{
		let description = req.body.description;
		let idUserToken = req.user.id;
		let id = req.params.id;

		let ticket = await db.support_ticket.findByPk(id);

		if(!ticket) return res.status(404).send({ success: 0, message: "Pedido de suporte inexistente" });
		if(ticket.useruid != idUserToken) return res.status(404).send({ success: 0, message: "Não existem pedidos de suporte a si pertencentes" });
		if(ticket.support_statesssid != 2) return res.status(403).send({ success: 0, message: 'Sem permissão' });

		ticket.Description = description;
		ticket.museummid = ticket.museummid;
		ticket.useruid = idUserToken;
		ticket.priority = 1;
		ticket.support_statesssid = 1;

		await ticket.save();

		let response = {
			success: 1,
			message: "Pedido editado com sucesso",
		};

		ticket.support_statesssid = 1;
		await ticket.save();

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};


exports.assignmentPriorityEstimatedDeadline = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;
		let priority = req.body.priority;
		let deadline = req.body.deadline;

		let isManager = await utils.isManager(idUserToken);
		if (!isManager) return res.status(403).send({ success: 0, message: 'Sem permissão' });

		let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });
		
		let support_ticket = await db.support_ticket.findByPk(id);

		if (!support_ticket) {
			return res.status(404).send({ success: 0, message: "Ticket inexistente" });
		}

		if (support_ticket.museummid !== manager.museummid) {
            return res.status(403).send({ success: 0, message: 'Ticket não pertence ao seu museu' });
        }

		if (support_ticket.priority != null) {
			return res.status(409).send({ success: 0, message: "Prioridade já atribuída" });
		}

		if(support_ticket.deadline != null){
			return res.status(409).send({ success: 0, message: "Data já atribuída" });
		}

		support_ticket.priority = priority;
		support_ticket.deadline = deadline;
		support_ticket.support_statesssid = 4;

		
		await support_ticket.save();

		let response = {
			success: 1,
			message: "Prioridade e data atribuídas com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};


exports.removeSupportTicket = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let ticket = await db.support_ticket.findByPk(id);

		if (!ticket) {
			return res.status(404).send({ success: 0, message: "Ticket inexistente" });
		}

		let isManager = await utils.isManager(idUserToken);
		if (!isManager) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}
		let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });
		if (ticket.museummid !== manager.museummid) {
            return res.status(403).send({ success: 0, message: 'Ticket não pertence ao seu museu' });
        }

		await ticket.destroy();

		let response = {
			success: 1,
			message: "Ticket removido com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

//Verificar codigo
exports.SupportTicketSolved = async (req, res) => {
	try {
		let id = req.params.id;
		let description = req.body.description;
		let type = req.body.type;
		let idUserToken = req.user.id;

		let support_ticket = await db.support_ticket.findByPk(id);

		if (!support_ticket) {
			return res.status(404).send({ success: 0, message: "Ticket inexistente" });
		}

		let isManager = await utils.isManager(idUserToken);
		let isAdmin = await utils.isAdmin(idUserToken);

		if (!isManager && !isAdmin) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}
		if(isManager){
			let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });
			if (support_ticket.museummid !== manager.museummid) {
				return res.status(403).send({ success: 0, message: 'Ticket não pertence ao seu museu' });
			}
		}else{
			if(support_ticket.support_statesssid != 5){
				return res.status(403).send({ success: 0, message: 'Ticket não redireçionado' });
			}
		}

		if (support_ticket.support_statesssid === 3) {
			return res.status(409).send({ success: 0, message: "Ticket já finalizado" });
		}
 
		support_ticket.support_statesssid = 9;

		try {
            await notification.addNotifications(description, type, support_ticket.useruid);
        } catch (notificationError) {
            return res.status(500).send({ error: notificationError, message: notificationError.message });
        }

		await support_ticket.save();

		let response = {
			success: 1,
			message: "Ticket finalizado com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

//Ver funçao
exports.approveSupportTicket = async (req, res) => {
    try {
        let id = req.params.id;
        let idUserToken = req.user.id;
		let description = req.body.description;
		let type = req.body.type;

		let support_ticket = await db.support_ticket.findByPk(id);
		
		if (!support_ticket) {
			return res.status(404).send({ success: 0, message: "Ticket inexistente" });
		}

        let isManager = await utils.isManager(idUserToken);
		if (!isManager) return res.status(403).send({ success: 0, message: 'Sem permissão' });
		
        let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });
		if (support_ticket.museummid !== manager.museummid) {
            return res.status(403).send({ success: 0, message: 'Ticket não pertence ao seu museu' });
        }

        if (support_ticket.support_statesssid != 1) {
            return res.status(409).send({ success: 0, message: "Impossível aprovar ticket" });
        }
		
        support_ticket.support_statesssid = 3;
		
		try {
            await notification.addNotifications(description, type, support_ticket.useruid);
        } catch (notificationError) {
            return res.status(500).send({ error: notificationError, message: notificationError.message });
        }
		

		await support_ticket.save();
		
        let response = {
            success: 1,
            message: "Ticket aprovado com sucesso",
        };

        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
    }
};

exports.sendNotifications = async (req, res) =>{
	try{

		let description = req.body.description;
		let type = req.body.type;
		let id = req.params.id;
		let idUserToken = req.user.id;

		let support_ticket = await db.support_ticket.findByPk(id);

		if (!support_ticket) {
			return res.status(404).send({ success: 0, message: "Pedido de suporte inexistente" });
		}

		let isManager = await utils.isManager(idUserToken);
		if (!isManager) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });
		if (support_ticket.museummid !== manager.museummid) {
            return res.status(403).send({ success: 0, message: 'Ticket não pertence ao seu museu' });
        }

		if(support_ticket.admin_useruid != idUserToken){
			return res.status(404).send({ success: 0, message: "Apenas o responsável pelo ticket tem permissão" });
		}

		try {
            await notification.addNotifications(description, type, support_ticket.useruid);
        } catch (notificationError) {
            return res.status(500).send({ error: notificationError, message: notificationError.message });
        }

		let response = {
			success: 1,
			message: "Notificação enviada com sucesso",
		};

		return res.status(200).send(response);
	}catch(err){
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.informMissingData = async (req, res) =>{
	try{

		let description = req.body.description;
		let type = req.body.type;
		let id = req.params.id;
		let idUserToken = req.user.id;

		let support_ticket = await db.support_ticket.findByPk(id);
 
		if (!support_ticket) {
			return res.status(404).send({ success: 0, message: "Pedido de suporte inexistente" });
		}

		let isManager = await utils.isManager(idUserToken);
		if (!isManager) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });
		if (support_ticket.museummid !== manager.museummid) {
            return res.status(403).send({ success: 0, message: 'Ticket não pertence ao seu museu' });
        }

		if(support_ticket.admin_useruid != idUserToken){
			return res.status(404).send({ success: 0, message: "Apenas o responsável pelo ticket tem permissão" });
		}

		try {
            await notification.addNotifications(description, type, support_ticket.useruid);
        } catch (notificationError) {
            return res.status(500).send({ error: notificationError, message: notificationError.message });
        }

		support_ticket.support_statesssid = 2;

		let response = {
			success: 1,
			message: "Notificação enviada com sucesso",
		};

		return res.status(200).send(response);
	}catch(err){
		return res.status(500).send({ error: err, message: err.message });
	}
};

//
exports.getSupportTicketsBySuportState = async (req, res) => {
	try {
		let state = req.params.id;
		let idUserToken = req.user.id;
		let tickets;

		let result = await db.support_state.findByPk(state);

		if(!result){
			return res.status(404).send({ success: 0, message: "Não existe esse estado de pedido de suporte" });
		}

		let isManager = await utils.isManager(idUserToken);
		if(isManager){
			let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken }});
			tickets = await db.support_ticket.findAll({ where: { museummid: manager.museummid, support_statesssid: state}});
		}else{
			tickets = await db.support_ticket.findAll({ where: { useruid: idUserToken, support_statesssid: state}});
		} 

		if (tickets.length === 0)
			return res.status(404).send({ success: 0, message: "Não existem pedidos de suporte" });

		let response = {
			success: 1,
			length: tickets.length,
			results: tickets.map((support_ticket) => {
				return {
					id: support_ticket.stid,
					description: support_ticket.Description,
					statessid: support_ticket.support_statesssid,
					museumid: support_ticket.museummid,
					userid: support_ticket.useruid,
					priority: support_ticket.priority,
					responsible: support_ticket.admin_useruid,
					deadline: support_ticket.deadline,
				};
			}),
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};


exports.redirectTicket = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let isManager = await utils.isManager(idUserToken);
		if (!isManager) return res.status(403).send({ success: 0, message: 'Sem permissão' });

		let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });
		
		let support_ticket = await db.support_ticket.findByPk(id);

		if (!support_ticket) {
			return res.status(404).send({ success: 0, message: "Ticket inexistente" });
		}

		if (support_ticket.museummid !== manager.museummid) {
            return res.status(403).send({ success: 0, message: 'Ticket não pertence ao seu museu' });
        }

		support_ticket.support_statesssid = 5;

		
		await support_ticket.save();

		let response = {
			success: 1,
			message: "Ticket redirecionado com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};




// Fazer uma funçao para listar todos os tickets dos admins