const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getEvents = async () => {
	try {
		let event = await db.event.findAll();

		if (event.length === 0) throw new Error("Não existem eventos");

		let response = {
			success: 1,
			length: event.length,
			results: event.map((event) => {
				return {
					id: event.eid,
					start_date: event.event_start_date,
					end_date: event.event_end_date,
					type: event.event_typeeid,
					museum: event.museummid,
					status: event.event_statuses_id,
					price: event.price,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getEvent = async (id) => {
	try {
		let event = await db.event.findByPk(id);

		if (!event) throw new Error("Evento inexistente");

		let response = {
			success: 1,
			length: 1,
			results: [
				{
					id: event.eid,
					start_date: event.event_start_date,
					end_date: event.event_end_date,
					type: event.event_typeeid,
					museum: event.museummid,
					status: event.event_statuses_id,
				},
			],
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getEventByMuseum = async (id) => {
	try {
		let event = await db.event.findAll({ where: { museummid: id } });

		if (event.length === 0) throw new Error("Não existem eventos para este museu.");

		let response = {
			success: 1,
			length: 1,
			results: [
				{
					id: event.eid,
					start_date: event.event_start_date,
					end_date: event.event_end_date,
					type: event.event_typeeid,
					museum: event.museummid,
					status: event.event_statuses_id,
				},
			],
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.editEvent = async (id, idUserToken, start_date, end_date, type,status, price) => {
	try {
		let event = await db.event.findByPk(id);

		switch (user) {
			case 1: //Admin
				throw new Error("Sem permissao!");
			case 2: //Manager
				try {
					if (!event) {
						throw new Error("Evento inexistente!");
					}

					let museum = await db.usermuseum.findOne({
						where: {
							useruid: idUserToken,
						},
					});

					if (event.museummid != museum.museummid) {
						throw new Error("Sem permissão!");
					}

					event.event_start_date = start_date;
					event.event_end_date = end_date;
					event.event_typeeid = type;
					event.museummid = event.museummid;
					event.event_statuses_id = status;
					event.price = price;

					await event.save();
				} catch (err) {
					throw new Error(err);
				}
				break;
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "Evento editado com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.removeEvent = async (id, idUserToken) => {
	try {
		let user = await utils.userType(idUserToken);
		let event = await db.event.findByPk(id);

		switch (user) {
			case 1: //Admin
				try {
					if (!event) {
						throw new Error("Evento inexistente!");
					}

					await event.destroy();
				} catch (err) {
					throw new Error(err);
				}
				break;
			case 2: //Manager
				try {
					if (!event) {
						throw new Error("Evento inexistente!");
					}

					let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });

					if (event.museummid !== manager.museummid) throw new Error("Evento não pertence ao seu museu");

					await event.destroy();
				} catch (err) {
					throw new Error(err);
				}
				break;
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "Evento removido com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.addEvent = async (idUserToken, start_date, end_date, type, museum, status) => {
	try {
		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			case 2: //Manager, tem acesso as tickets do seu museu
				try {
					let newEvent = await db.event.create({
						event_start_date: start_date,
						event_end_date: end_date,
						event_typeetid: type,
						museummid: museum,
						event_statuses_id: status,
					});
				} catch (err) {
					throw new Error(err);
				}
				break;
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}
	} catch (err) {
		throw new Error(err);
	}
};

exports.editPriceEvent = async (idUserToken, EventId, price) => {
	try{
		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			case 2: //Manager, tem acesso as tickets do seu museu
				try {
					let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });

					let event = await db.event.findByPk(eventId);

					if (!event) {
						throw new Error("Evento inexistente!");
					}

					if (event.museummid !== manager.museummid) {
						throw new Error("Ticket não pertence ao seu museu!");
					}

					event.event_price = price;
					await event.save();

				} catch (err) {
					throw new Error(err);
				}
				break;
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "Preço editado com sucesso",
		};

		return response;
	}catch (err) {
		throw new Error(err);
	}
};