const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllSales = async () => {
	try {
		let sales = await db.sale_invoice.findAll();

		if (sales.length === 0) throw new Error("Não existem vendas registadas");

		let response = {
			success: 1,
			length: sales.length,
			results: sales.map((sale_invoice) => {
				return {
					id: sale_invoice.sale_invoiceid,
					date: sale_invoice.invoice_departure_date,
					user_id: sale_invoice.useruid,
					invoiceStatus: sale_invoice.Invoice_statusinvoicestatusid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getSalesByUser = async (id) => {
	try {
		let sales = await db.sale_invoice.findAll({
			where: {
				useruid: id,
			},
		});

		if (sales.length === 0) throw new Error("Não existem vendas registadas relativas e esse utilizador");

		let response = {
			success: 1,
			length: sales.length,
			results: sales.map((sale_invoice) => {
				return {
					id: sale_invoice.sale_invoiceid,
					date: sale_invoice.invoice_departure_date,
					user_id: sale_invoice.useruid,
					invoiceStatus: sale_invoice.Invoice_statusinvoicestatusid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getSalesByInvoiceStatus = async (id) => {
	try {
		let status = await db.Invoice_status.findByPk(id);

		if (!status) throw new Error("O estado de faturaçao é invalido");

		let sales = await db.sale_invoice.findAll({
			where: {
				Invoice_statusinvoicestatusid: id,
			},
		});

		if (sales.length === 0) throw new Error("Não existem vendas registadas relativas e esse estado de faturação");

		let response = {
			success: 1,
			length: sales.length,
			results: sales.map((sale_invoice) => {
				return {
					id: sale_invoice.sale_invoiceid,
					date: sale_invoice.invoice_departure_date,
					user_id: sale_invoice.useruid,
					invoiceStatus: sale_invoice.Invoice_statusinvoicestatusid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getSale = async (id) => {
	try {
		let result = await db.sale_invoice.findByPk(id);

		if (!result) throw new Error("Registos de venda inexistente");

		let response = {
			success: 1,
			results: {
				id: result.sale_invoiceid,
				date: result.invoice_departure_date,
				user_id: result.useruid,
				invoiceStatus: result.Invoice_statusinvoicestatusid,
			},
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.addSale = async (date, userid, invoiceStatus, idUserToken) => {
	try {
		let newSaleInvoice;
		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				newSaleInvoice = await db.sale_invoice.create({
					invoice_departure_date: date,
					useruid: userid,
					Invoice_statusinvoicestatusid: invoiceStatus,
				});

				break;
			case 2: //Manager
				newSaleInvoice = await db.sale_invoice.create({
					invoice_departure_date: date,
					useruid: userid,
					Invoice_statusinvoicestatusid: invoiceStatus,
				});

				break;
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "Venda registada com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.editSale = async (id, idUserToken, date, user_id, invoiceStatus) => {
	try {
		let sale = await db.sale_invoice.findByPk(id);

		if (!sale) throw new Error("Registo de venda inexistente");

		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				if (date) sale.invoice_departure_date = date;
				if (user_id) sale.useruid = user_id;
				if (invoiceStatus) sale.Invoice_statusinvoicestatusid = invoiceStatus;

				await sale.save();

				break;
			case 2: //Manager
				if (date) sale.invoice_departure_date = date;
				if (user_id) sale.useruid = user_id;
				if (invoiceStatus) sale.Invoice_statusinvoicestatusid = invoiceStatus;

				await sale.save();

				break;
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "Registo de venda editado com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.removeSale = async (id, idUserToken) => {
	try {
		let sale = await db.sale_invoice.findByPk(id);

		if (!sale) throw new Error("Registo de venda inexistente");

		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				await sale.destroy();
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
			message: "Registo de venda removido com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};
