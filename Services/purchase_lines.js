const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllPurchaseLines = async () => {
	try {
		let purchaseLines = await db.purchase_line.findAll();

		if (purchaseLines.length === 0) throw new Error("Não existe nenhuma linha registada");

		let response = {
			success: 1,
			length: purchaseLines.length,
			results: purchaseLines.map((purchase_line) => {
				return {
					id: purchaseLines.purchase_lid,
					quantity: purchaseLines.purline_quantity,
					saleInvoiceId: purchaseLines.purchase_invoicepurchase_invoiceid,
					productId: purchaseLines.productprodid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getLinesByPurchase = async (id) => {
	try {
		let lines = await db.purchase_line.findAll({
			where: {
				purchase_invoicepurchase_invoiceid: id,
			},
		});

		if (lines.length === 0) throw new Error("Não existem linhas registadas relativas e essa compra");

		let response = {
			success: 1,
			length: lines.length,
			results: lines.map((purchase_line) => {
				return {
					id: purchase_line.purchase_lid,
					quantity: purchase_line.purline_quantity,
					saleInvoiceId: purchase_line.purchase_invoicepurchase_invoiceid,
					productId: purchase_line.productprodid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getPurchaseLine = async (id) => {
	try {
		let result = await db.purchase_line.findByPk(id);

		if (!result) throw new Error("Linha de compra inexistente");

		let response = {
			success: 1,
			results: {
				id: result.purchase_lid,
				quantity: result.purline_quantity,
				purchaseInvoiceId: result.purchase_invoicepurchase_invoiceid,
				productId: result.productprodid,
			},
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.addPurchaseLine = async (quantity, purchaseId, prodId, idUserToken) => {
	try {
		let user = await utils.userType(idUserToken);
		let newPurchaseLine;

		switch (user) {
			case 1: //Admin
				newPurchaseLine = await db.purchase_line.create({
					purline_quantity: quantity,
					productprodid: prodId,
					purchase_invoicepurchase_invoiceid: purchaseId,
				});
				break;
			case 2: //Manager
				newPurchaseLine = await db.purchase_line.create({
					purline_quantity: quantity,
					productprodid: prodId,
					purchase_invoicepurchase_invoiceid: purchaseId,
				});
				break;
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "linha de compra registada com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.editPurchaseLine = async (id, idUserToken, quantity, purchaseId, prodId) => {
	try {
		let purchaseLine = await db.purchase_line.findByPk(id);

		if (!purchaseLine) throw new Error("Linha de compra inexistente");

		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				if (quantity) purchaseLine.purline_quantity = quantity;
				if (purchaseId) purchaseLine.purchase_invoicepurchase_invoiceid = purchaseId;
				if (prodId) purchaseLine.productprodid = prodId;

				await purchaseLine.save();

				break;
			case 2: //Manager
				if (quantity) purchaseLine.purline_quantity = quantity;
				if (purchaseId) purchaseLine.purchase_invoicepurchase_invoiceid = purchaseId;
				if (prodId) purchaseLine.productprodid = prodId;

				await purchaseLine.save();

				break;
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "Linha de compra editada com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.removePurchaseLine = async (id, idUserToken) => {
	try {
		const purchaseLine = await db.purchase_line.findByPk(id);

		if (!purchaseLine) throw new Error("Linha de compra inexistente");

		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				await purchaseLine.destroy();
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
			message: "Linha de compra removida com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};
