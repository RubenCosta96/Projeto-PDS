const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllSaleLines = async () => {
	try {
		let saleLines = await db.sale_line.findAll();

		if (saleLines.length === 0) throw new Error("Não existe nenhuma linha registada");

		let response = {
			success: 1,
			length: saleLines.length,
			results: saleLines.map((sale_line) => {
				return {
					id: sale_line.sale_lid,
					quantity: sale_line.line_quantity,
					saleInvoiceId: sale_line.sale_invoicesale_invoiceid,
					productId: sale_line.productprodid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getLinesBySale = async (id) => {
	try {
		let lines = await db.sale_line.findAll({
			where: {
				sale_invoicesale_invoiceid: id,
			},
		});

		if (lines.length === 0) throw new Error("Não existem linhas registadas relativas e essa venda");

		let response = {
			success: 1,
			length: lines.length,
			results: lines.map((sale_line) => {
				return {
					id: sale_line.sale_lid,
					quantity: sale_line.line_quantity,
					saleInvoiceId: sale_line.sale_invoicesale_invoiceid,
					productId: sale_line.productprodid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getSaleLine = async (id) => {
	try {
		let result = await db.sale_line.findByPk(id);

		if (!result) throw new Error("Linha de venda inexistente");

		let response = {
			success: 1,
			results: {
				id: result.sale_lid,
				quantity: result.line_quantity,
				saleInvoiceId: result.sale_invoicesale_invoiceid,
				productId: result.productprodid,
			},
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.addSaleLine = async (quantity, saleId, prodId, idUserToken) => {
	try {
		let newSaleLine;
		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				newSaleLine = await db.sale_line.create({
					line_quantity: quantity,
					sale_invoicesale_invoiceid: saleId,
					productprodid: prodId,
				});
				break;
			case 2: //Manager
				newSaleLine = await db.sale_line.create({
					line_quantity: quantity,
					sale_invoicesale_invoiceid: saleId,
					productprodid: prodId,
				});
				break;
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "linha de venda registada com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.editSaleLine = async (id, idUserToken, quantity, saleId, prodId) => {
	try {
		let saleLine = await db.sale_line.findByPk(id);

		if (!saleLine) throw new Error("Linha de venda inexistente");

		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				if (quantity) saleLine.line_quantity = quantity;
				if (saleId) saleLine.sale_invoicesale_invoiceid = saleId;
				if (prodId) saleLine.productprodid = prodId;

				await saleLine.save();

				break;
			case 2: //Manager
				if (quantity) saleLine.line_quantity = quantity;
				if (saleId) saleLine.sale_invoicesale_invoiceid = saleId;
				if (prodId) saleLine.productprodid = prodId;

				await saleLine.save();

				break;
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "Linha de venda editada com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.removeSaleLine = async (id, idUserToken) => {
	try {
		const saleLine = await db.sale_line.findByPk(id);

		if (!saleLine) throw new Error("Linha de venda inexistente");

		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				await saleLine.destroy();
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
			message: "Linha de venda removida com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};
