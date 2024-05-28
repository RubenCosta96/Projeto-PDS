const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/purchase_invoices");

exports.getAllPurchases = async (req, res) => {
	try {
		let response = await services.getAllPurchases();

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getPurchasesByMuseum = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getPurchasesByMuseum(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getPurchasesByInvoiceStatus = async (req, res) => {
	try {
		let id = req.params.id;

		let response = await services.getPurchasesByInvoiceStatus(id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.getPurchase = async (req, res) => {
	try {
		let id = req.params.id;
		let result = await db.purchase_invoice.findByPk(id);

		if (!result) {
			return res.status(404).send({ success: 0, message: "Registos de compras inexistente" });
		}

		let response = {
			success: 1,
			results: {
				id: result.purchase_invoiceid,
				date: result.purchase_entry_date,
				museum_id: result.museummid,
				invoiceStatus: result.Invoice_statusinvoicestatusid,
			},
		};

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.addPurchase = async (req, res) => {
	try {
		let date = req.body.date;
		let museumid = req.body.museum_id;
		let idUserToken = req.user.id;

		let isManager = await utils.isManager(idUserToken);
		let isAdmin = await utils.isAdmin(idUserToken);

		if (!isManager && !isAdmin) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		let user = await db.user.findByPk(idUserToken);
		if (!user) {
			return res.status(404).send({ success: 0, message: "Utilizador inexistente" });
		}

		//Verificaçao para entradas repetidas nas BD

		let newPurchaseInvoice = await db.purchase_invoice.create({
			purchase_entry_date: date,
			museummid: museumid,
			Invoice_statusinvoicestatusid: 1,
		});

		let response = {
			success: 1,
			message: "Compra registada com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error adding Purchase Invoice:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.editPurchase = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let purchase = await db.purchase_invoice.findByPk(id);

		if (!purchase) {
			return res.status(404).send({ success: 0, message: "Registo de compra inexistente" });
		}

		let isManager = await utils.isManager(idUserToken); //Verificar
		let isAdmin = await utils.isAdmin(idUserToken); //Verificar

		if (!isManager && !isAdmin) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		let { date, museum_id, invoiceStatus } = req.body;

		if (date) purchase.purchase_entry_date = date;
		if (museum_id) purchase.museummid = museum_id;
		if (invoiceStatus) purchase.Invoice_statusinvoicestatusid = invoiceStatus;

		await purchase.save();

		let response = {
			success: 1,
			message: "Registo de compra editado com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error editing purchase invoice:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.removePurchase = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		const purchase = await db.purchase_invoice.findByPk(id);

		if (!purchase) {
			return res.status(404).send({ success: 0, message: "Registo de compra inexistente" });
		}

		//let idOwner = artist.id_user; //ver se faz sentido

		let isAdmin = await utils.isAdmin(idUserToken); //Verificar

		if (!isAdmin) {
			return res.status(403).send({ success: 0, message: "Sem permissão" });
		}

		//Antes verificar se esta atribuido a algum produto, se sim nao permitir

		await purchase.destroy();

		let response = {
			success: 1,
			message: "Registo de compra removido com sucesso",
		};

		return res.status(200).send(response);
	} catch (err) {
		console.error("Error removing purchase invoice:", err);
		return res.status(500).send({ error: err, message: err.message });
	}
};

exports.emitePurchase = async (req, res) => {
	try {
		let id = req.params.id;
		let idUserToken = req.user.id;

		let response = await services.emitePurchase(idUserToken, id);

		return res.status(200).send(response);
	} catch (err) {
		return res.status(500).send({ error: err, message: err.message });
	}
};
