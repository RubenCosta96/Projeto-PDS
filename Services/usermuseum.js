const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllUserMuseum = async () => {
	try {
		let relations = await db.usermuseum.findAll();

		if (relations.length === 0) throw new Error("Não existem registos");

		let response = {
			success: 1,
			length: relations.length,
			results: relations.map((usermuseum) => {
				return {
					museumId: usermuseum.museummid,
					userId: usermuseum.useruid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getUserMuseum = async (museumId, userId) => {
	try {
		let result = await db.usermuseum.findOne({
			where: {
				museummid: museumId,
				useruid: userId,
			},
		});

		if (!result) {
			throw new Error("Registo inexistente");
		}

		let response = {
			success: 1,
			results: {
				museumId: result.museummid,
				userId: result.useruid,
			},
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.addUserMuseum = async (museumId, userId, idUserToken) => {
	try {
		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				try {
					let newuserMuseum = await db.usermuseum.create({
						museummid: museumId,
						useruid: userId,
					});
				} catch (err) {
					throw new Error(err);
				}
				break;
			case 2: //Manager
				try {
					let newuserMuseum = await db.usermuseum.create({
						museummid: museumId,
						useruid: userId,
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

		let response = {
			success: 1,
			message: "Registo criado com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.removeUserMuseum = async (museumId, userId, idUserToken) => {
	try {
		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				try {
					const result = await db.usermuseum.findOne({
						where: {
							museummid: museumId,
							useruid: userId,
						},
					});

					if (!result) {
						throw new Error("Registo inexistente");
					}

					await result.destroy();
				} catch (err) {
					throw new Error(err);
				}
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
			message: "Registo removido com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};
