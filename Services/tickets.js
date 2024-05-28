const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getTickets = async (idUserToken) => {
	try {
		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				try {
					let tickets = await db.ticket.findAll();
					if (tickets.length === 0) throw new Error("Não existem tickets");
				} catch (err) {
					throw new Error(err);
				}
			case 2: //Manager
				try {
					let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });
					tickets = await db.ticket.findAll({
						include: [
							{
								model: db.event,
								where: { museummid: manager.museummid },
							},
						],
					});
					if (tickets.length === 0) throw new Error("Não existem tickets");
				} catch (err) {
					throw new Error(err);
				}
				break;
			case 3: //User, nao tem acesso a esta funçao
				try {
					tickets = await db.ticket.findAll({ where: { useruid: idUserToken } });
					if (tickets.length === 0) throw new Error("Não existem tickets");
				} catch (err) {
					throw new Error(err);
				}
			default:
				throw new Error("Utilizador nao reconhecido!");
		}
		let response = {
			success: 1,
			length: tickets.length,
			results: tickets.map((ticket) => {
				return {
					id: ticket.tid,
					purchase_date: ticket.ticket_purchase_date,
					event: ticket.eventeid,
					user: ticket.useruid,
					status: ticket.ticket_statusts_id,
				};
			}),
		};
		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getTicketsByEvent = async (idUserToken, id) => {
	try {
		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				try {
					let tickets = await db.ticket.findAll({ where: { eventeid: eventId } });
					if (tickets.length === 0) throw new Error("Não existem tickets");
				} catch (err) {
					throw new Error(err);
				}
			case 2: //Manager
				try {
					let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });
					tickets = await db.ticket.findAll({
						include: [
							{
								model: db.event,
								where: { museummid: manager.museummid, eventeid: id },
							},
						],
					});
					if (tickets.length === 0) throw new Error("Não existem tickets");
				} catch (err) {
					throw new Error(err);
				}
				break;
			case 3: //User, nao tem acesso a esta funçao
				try {
					tickets = await db.ticket.findAll({ where: { useruid: idUserToken, eventeid: id } });
					if (tickets.length === 0) throw new Error("Não existem tickets");
				} catch (err) {
					throw new Error(err);
				}
			default:
				throw new Error("Utilizador nao reconhecido!");
		}
		let response = {
			success: 1,
			length: tickets.length,
			results: tickets.map((ticket) => {
				return {
					id: ticket.tid,
					purchase_date: ticket.ticket_purchase_date,
					event: ticket.eventeid,
					user: ticket.useruid,
					status: ticket.ticket_statusts_id,
				};
			}),
		};
		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.addTickets = async (idUserToken, purchase_date, eventId, quantity) => {
	try {
		let event = await db.event.findByPk(eventId);
		if (!event) throw new Error("Evento inexistente");

		if (quantity <= 0) throw new Error("Quantidade Inválida");

		for (let i = 0; i < quantity; i++) {
			let new_Ticket = await db.ticket.create({
				ticket_purchase_date: purchase_date,
				ticket_price: price,
				eventeid: eventId,
				ticket_statusts_id: 1,
				useruid: idUserToken,
			});
		}

		let response = {
			success: 1,
			message: "Ticket comprado com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};