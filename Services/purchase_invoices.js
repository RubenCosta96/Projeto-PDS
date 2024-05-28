const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllPurchases = async () => {
	try {
		let purchases = await db.purchase_invoice.findAll();

		if (purchases.length === 0) throw new Error("Não existem compras registadas");

		let response = {
			success: 1,
			length: purchases.length,
			results: purchases.map((purchase_invoice) => {
				return {
					id: purchase_invoice.purchase_invoiceid,
					date: purchase_invoice.purchase_entry_date,
					museum_id: purchase_invoice.museummid,
					invoiceStatus: purchase_invoice.Invoice_statusinvoicestatusid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getPurchasesByMuseum = async (id) => {
	try {
		let purchases = await db.purchase_invoice.findAll({
			where: {
				museummid: id,
			},
		});

		if (purchases.length === 0) throw new Error("Não existem compras registadas relativas e esse museu");

		let response = {
			success: 1,
			length: purchases.length,
			results: purchases.map((purchase_invoice) => {
				return {
					id: purchase_invoice.purchase_invoiceid,
					date: purchase_invoice.purchase_entry_date,
					museum_id: purchase_invoice.museummid,
					invoiceStatus: purchase_invoice.Invoice_statusinvoicestatusid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getPurchasesByInvoiceStatus = async (id) => {
	try {
		let status = await db.Invoice_status.findByPk(id);

		if (!status) {
			throw new Error("O estado de faturaçao é invalido");
		}

		let purchases = await db.purchase_invoice.findAll({
			where: {
				Invoice_statusinvoicestatusid: id,
			},
		});

		if (purchases.length === 0) throw new Error("Não existem compras registadas relativas e esse estado de faturação");

		let response = {
			success: 1,
			length: purchases.length,
			results: purchases.map((purchase_invoice) => {
				return {
					id: purchase_invoice.purchase_invoiceid,
					date: purchase_invoice.purchase_entry_date,
					museum_id: purchase_invoice.museummid,
					invoiceStatus: purchase_invoice.Invoice_statusinvoicestatusid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
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

exports.emitePurchase = async (idUserToken, purchaseId) => {
	try {
		let user = await utils.userType(idUserToken);
		let purchase;
		let lines;

		switch (user) {
			case 1: //Admin
				purchase = await db.purchase_invoice.findByPk(purchaseId);

				if (!purchase) throw new Error("Compra nao encontrada!");

				lines = await db.purchase_line.findAll({
					where: {
						purchase_invoicepurchase_invoiceid: purchase.purchase_invoiceid,
					},
				});

				for (let line of lines) {
					this.productQuantity(idUserToken, line.productprodid, line.purline_quantity);
				}

				purchase.Invoice_statusinvoicestatusid = 2;

				purchase.save();
				break;
			case 2: //Manager
				purchase = await db.purchase_invoice.findByPk(purchaseId);

				if (!purchase) throw new Error("Compra nao encontrada!");

				lines = await db.purchase_line.findAll({
					where: {
						purchase_invoicepurchase_invoiceid: purchase.purchase_invoiceid,
					},
				});

				for (let line of lines) {
					await this.productQuantity(idUserToken, line.productprodid, line.purline_quantity);
				}

				purchase.Invoice_statusinvoicestatusid = 2;

				purchase.save();
				break;
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "Compra emitida com sucesso!",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.productQuantity = async (idUserToken, idProduct, quantity) => {
	try {
		let user = await utils.userType(idUserToken);
		let product;

		switch (user) {
			case 1: //Admin
				product = await db.product.findByPk(idProduct);

				if (!product) throw new Error("Produto nao encontrada!");

				product.product_quantity += quantity;

				await product.save();
				break;
			case 2: //Manager
				product = await db.product.findByPk(idProduct);

				if (!product) throw new Error("Produto nao encontrada!");

				product.product_quantity += quantity;

				await product.save();
				break;
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "Quantidade do produto atualizada com sucesso!",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};
