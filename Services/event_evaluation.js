const utils = require("../utils/index");
const db = require("../config/mysql");
const event_evaluation = require("../models/event_evaluation");
const user = require("../models/user");
const event_status = require("../models/event_status");

exports.getEventsEval = async () => {
	try {
		let event_evaluation = await db.event_evaluation.findAll();

		if (event_evaluation.length === 0) throw new Error("Não existem avaliações de evento.");

		let response = {
			success: 1,
			length: event_evaluation.length,
			results: event_evaluation.map((event_evaluation) => {
				return {
					id: event_evaluation.eventeid,
					description: event_evaluation.ee_description,
					evaluation: event_evaluation.ee_evaluation,
					user_id: event_evaluation.useruid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getEventEval = async (id) => {
	try {
		let event = await db.event.findByPk(id);

		if (!event) throw new Error("Evento inexistente");

		let event_evaluation = await db.event_evaluation.findAll({
			where: {
				eventeid: id,
			},
		});

		let response = {
			success: 1,
			length: 1,
			results: [
				{
					id: event_evaluation.eventeid,
					description: event_evaluation.ee_description,
					evaluation: event_evaluation.ee_evaluation,
					user_id: event_evaluation.useruid,
				},
			],
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.addEventsEval = async (description, evaluation, user_id) => {
	try {
		let newEventEval = await db.event_evaluation.create({
			ee_description: description,
			ee_evaluation: evaluation,
			useruid: user_id,
		});

		let response = {
			success: 1,
			message: "Avaliação de evento criada com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.editEventsEval = async (id, idUserToken, description, evaluation, user_id) => {
	try {
		let event_evaluation = await db.event_evaluation.findByPk(id);

		if (!event_evaluation) {
			throw new Error("Avaliação de evento inexistente");
		}

		let user = await db.user.findByPk(idUserToken);
		if (!user) {
			throw new Error("Utilizador inexistente");
		}

		event_evaluation.eventeeid = id;
		event_evaluation.ee_description = description;
		event_evaluation.ee_evaluation = evaluation;
		event_evaluation.useruid = user_id;

		await event_evaluation.save();

		let response = {
			success: 1,
			message: "Avaliação de evento editada com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.removeEventsEval = async (id, idUserToken) => {
	try {
		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				const event_evaluation = await db.event_evaluation.findByPk(id);

				if (!event_evaluation) {
					throw new Error("Avaliação inexistente");
				}

				await event_evaluation.destroy();

				break;
			case 2: //Manager
				throw new Error("Sem permissao!");
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "Avaliação de evento removida com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};
