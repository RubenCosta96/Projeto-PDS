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

exports.getPurchase = async (id) => {
	try {
		let result = await db.purchase_invoice.findByPk(id);

		if (!result) {
			throw new Error("Registos de compras inexistente");
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

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.addPurchase = async (date, museumid, idUserToken) => {
	try {
		let user = await utils.userType(idUserToken);
		let newPurchaseInvoice;

		switch (user) {
			case 1: // admin
				newPurchaseInvoice = await db.purchase_invoice.create({
					purchase_entry_date: date,
					museummid: museumid,
					Invoice_statusinvoicestatusid: 1,
				});
				break;
			case 2: // manager
				newPurchaseInvoice = await db.purchase_invoice.create({
					purchase_entry_date: date,
					museummid: museumid,
					Invoice_statusinvoicestatusid: 1,
				});
				break;
			case 3: // User
				throw new Error("Sem permissao");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "Compra registada com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.editPurchase = async (id, idUserToken, date, museum_id, invoiceStatus) => {
	try {
		let user = await utils.userType(idUserToken);
		let purchase = await db.purchase_invoice.findByPk(id);

		if (!purchase) {
			throw new Error("Registo de compra inexistente");
		}

		switch (user) {
			case 1: // admin
				if (date) purchase.purchase_entry_date = date;
				if (museum_id) purchase.museummid = museum_id;
				if (invoiceStatus) purchase.Invoice_statusinvoicestatusid = invoiceStatus;

				await purchase.save();
				break;
			case 2: // manager
				if (date) purchase.purchase_entry_date = date;
				if (museum_id) purchase.museummid = museum_id;
				if (invoiceStatus) purchase.Invoice_statusinvoicestatusid = invoiceStatus;

				await purchase.save();
				break;
			case 3: // User
				throw new Error("Sem permissao");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "Registo de compra editado com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.removePurchase = async (id, idUserToken) => {
	try {
		let user = await utils.userType(idUserToken);
		let purchase = await db.purchase_invoice.findByPk(id);

		if (!purchase) {
			throw new Error("Registo de compra inexistente");
		}

		switch (user) {
			case 1: // admin
				await purchase.destroy();
				break;
			case 2: // manager
				throw new Error("Sem permissao");
			case 3: // User
				throw new Error("Sem permissao");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "Registo de compra removido com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
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
