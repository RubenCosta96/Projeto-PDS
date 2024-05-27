const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/tickets");

exports.getAllTickets = async (req, res) => {
	try {
		let idUserToken = req.user.id;

		let response = await services.getTickets(idUserToken);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getAllTicketsByEvent = async (req, res) => {
	try {
		let idUserToken = req.user.id;
		let id = req.params.id;

		let response = await services.getTicketsByEvent(idUserToken, id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addTickets = async (req, res) => {
	try {
		let idUserToken = req.user.id;
		let purchase_date = req.body.purchase_date;
		let eventId = req.params.event;
		let quantity = req.body.quantity;

		let response = await services.addTickets(idUserToken, purchase_date, eventId, quantity);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editPriceCategory = async (req, res) => {
	try {
		let idUserToken = req.user.id;
		let price = req.body.price;
		let eventId = req.params.id;
		let ticketCategory = req.body.id;

		let isManager = await utils.isManager(idUserToken);
		if (!isAdmin) return res.status(403).send({ success: 0, message: "Sem permissão" });

		let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });

		let event = await db.event.findByPk(eventId);

		if (!event) {
			return res.status(404).send({ success: 0, message: "Evento inexistente" });
		}

		if (event.museummid !== manager.museummid) {
			return res.status(403).send({ success: 0, message: "Ticket não pertence ao seu museu" });
		}

		event.event_price = price;
		await event.save();

		let response = {
			success: 1,
			message: "Preço editado com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};
