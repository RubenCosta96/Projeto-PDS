const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");
const user = require("../models/user");
const museum = require("../models/museum");

exports.getAllProposals = async (idUserToken) => {
	try {
		let user = await utils.userType(idUserToken);
		let result;

		switch (user) {
			case 1: //Admin, nao tem acesso a esta funçao
				result = await db.proposal.findAll();

				if (result.length === 0) throw new Error("Não existem propostas!");

				break;
			case 2: //Manager, tem acesso as tickets do seu museu
				let museum = await db.usermuseum.findOne({
					where: {
						useruid: idUserToken,
					},
				});
				result = await db.proposal.findAll({
					where: {
						museummid: museum.museummid,
					},
				});

				if (result.length === 0) throw new Error("Não existem propostas para o seu museu!");

				break;
			case 3:
				result = await db.proposal.findAll({
					include: [
						{
							model: db.ad,
							as: "adad",
							attributes: ["useruid"],
						},
					],
					where: {
						"$adad.useruid$": idUserToken,
					},
				});

				if (result.length === 0) {
					throw new Error("Não existem propostas!");
				}
				break;
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			length: result.length,
			results: result.map((proposal) => {
				return {
					proposalid: proposal.proposalid,
					price: proposal.price,
					adId: proposal.adadid,
					museumId: proposal.museummid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getAllProposalsByMuseum = async (id) => {
	try {
		let museum = await db.museum.findByPk(id);

		if (!museum) {
			throw new Error("O museu indicado nao existe");
		}

		let result = await db.proposal.findAll({
			where: {
				museummid: id,
			},
		});

		if (result.length === 0) throw new Error("Não existem propostas relativas ao museu indicado");

		let response = {
			success: 1,
			length: result.length,
			results: result.map((proposal) => {
				return {
					proposalid: proposal.proposalid,
					price: proposal.price,
					adId: proposal.adadid,
					museumId: proposal.museummid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getAllProposalsByAd = async (id) => {
	try {
		let museum = await db.ad.findByPk(id);

		if (!museum) {
			throw new Error("O anuncio indicado nao existe");
		}

		let result = await db.proposal.findAll({
			where: {
				adadid: id,
			},
		});

		if (result.length === 0) throw new Error("Não existem propostas relativas ao anuncio indicado");

		let response = {
			success: 1,
			length: result.length,
			results: result.map((proposal) => {
				return {
					proposalid: proposal.proposalid,
					price: proposal.price,
					adId: proposal.adadid,
					museumId: proposal.museummid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getProposal = async (id) => {
	try {
		let result = await db.proposal.findByPk(id);

		if (!result) {
			throw new Error("Proposta inexistente");
		}

		let response = {
			success: 1,
			results: {
				proposalid: result.proposalid,
				price: result.price,
				adId: result.adadid,
				museumId: result.museummid,
			},
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.addProposal = async (price, adId, idUserToken) => {
	try {
		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				throw new Error("Sem permissao!");
			case 2: //Manager
				let manager = await db.usermuseum.findOne({ where: { useruid: idUserToken } });

				let newProposal = await db.proposal.create({
					price: price,
					adadid: adId,
					museummid: manager.museummid,
					proposal_statepsid: 1,
				});
				break;
			case 3: //User
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "Proposta criada com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.removeProposal = async (id, idUserToken) => {
	try {
		const result = await db.proposal.findByPk(id);

		if (!result) {
			throw new Error("proposta inexistente");
		}

		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				await result.destroy();
				break;
			case 2: //Manager
				throw new Error("Sem permissao!");
			case 3: //User
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "Proposta removida com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.acceptProposal = async (id) => {
	try {
		const result = await db.proposal.findByPk(id, {
			include: [
				{
					model: db.ad,
					as: "adad",
					attributes: ["adid"],
				},
			],
		});

		if (!result) {
			throw new Error("proposta inexistente");
		}

		const ad = await db.ad.findByPk(result.adad.adid);

		if (!ad) {
			throw new Error("Não existe anuncio");
		}

		ad.ad_stateadstid = 2;
		result.proposal_statepsid = 2;

		await ad.save();
		await result.save();

		let response = {
			success: 1,
			message: "Proposta aceite",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.rejectProposal = async (id) => {
	try {
		const result = await db.proposal.findByPk(id, {
			include: [
				{
					model: db.ad,
					as: "adad",
					attributes: ["adid"],
				},
			],
		});

		if (!result) {
			throw new Error("proposta inexistente");
		}

		const ad = await db.ad.findByPk(result.adad.adid);

		if (!ad) {
			throw new Error("Não existe anuncio");
		}

		ad.ad_stateadstid = 1;
		result.proposal_statepsid = 3;

		await ad.save();
		await result.save();

		let response = {
			success: 1,
			message: "Proposta recusada",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};
