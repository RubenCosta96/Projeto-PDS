const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllInvoiceStatus = async () => {
	try {
		let status = await db.Invoice_status.findAll();

		if (status.length === 0) throw new Error("Não existe nenhum estado de faturação");

		let response = {
			success: 1,
			length: status.length,
			results: status.map((Invoice_status) => {
				return {
					id: Invoice_status.invoicestatusid,
					description: Invoice_status.description,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getInvoiceStatus = async (id) => {
	try {
		let result = await db.Invoice_status.findByPk(id);

		if (!result) throw new Error("Estado de faturação inexistente");

		let response = {
			success: 1,
			results: {
				id: result.invoicestatusid,
				description: result.description,
			},
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.addInvoiceStatus = async (description, idUserToken) => {
	try {
		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				let NewInvoiceStatus = await db.Invoice_status.create({
					description: description,
				});
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
			message: "Estado de faturação registado com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.editInvoiceStatus = async (id, idUserToken, description) => {
	try {
		let status = await db.Invoice_status.findByPk(id);

		if (!status) throw new Error("Estado de faturação inexistente");

		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				if (description) status.description = description;

				await status.save();
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
			message: "Estado de faturação editado com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.removeUserState = async (id, idUserToken) => {
	try {
		let status = await db.Invoice_status.findByPk(id);

		if (!status) throw new Error("Estado de faturação inexistente");

		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				await status.destroy();
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
			message: "Estado de faturação removido com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};
