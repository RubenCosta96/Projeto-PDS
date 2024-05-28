const db = require('../config/mysql');
const utils = require('../utils/index');
const notification = require('./notifications');
const services = require('../services/support_tickets');

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

		let response = await services.addSupportTicket(description, museumId, idUserToken);

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

		let response = await services.editSupportTicket(description, idUserToken, id);

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

		let response = await services.assignmentPriorityEstimatedDeadline(id,idUserToken, priority, deadline);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

//testar no final e implementar uma logica melhor
exports.removeSupportTicket = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.removeSupportTicket(id, idUserToken);

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

		let response = await services.SupportTicketSolved(id, description, type, idUserToken);

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

		let response = await services.approveSupportTicket(id, idUserToken, description, type);

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

		let response = await services.informMissingData(description, type, id, idUserToken);

		return res.status(200).send(response);
	}catch(err){
		return res.status(500).send({ error: err, message: err.message });
	}
};

//testar
exports.getSupportTicketsBySuportState = async (req, res) => {
	try {
		let state = req.params.id;
		let idUserToken = req.user.id;
		
		let response = await services.getSupportTicketsBySuportState(state,idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};


exports.redirectTicket = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.redirectTicket(id, idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};




// Fazer uma funçao para listar todos os tickets dos admins