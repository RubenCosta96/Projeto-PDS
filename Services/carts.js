const { where } = require("sequelize");
const db = require("../config/mysql");
const user = require("../models/user");
const utils = require("../utils/index");

exports.getAllCarts = async () => {
	try {
		let result = await db.cart.findAll();

		if (result.length === 0) throw new Error("Não existem entradas no carrinho");

		let response = {
			success: 1,
			length: result.length,
			results: result.map((cart) => {
				return {
					quantity: cart.quantity,
					useruid: cart.useruid,
					productprodid: cart.productprodid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getCartByProduct = async (prodId) => {
	try {
		let result = await db.product.findByPk(prodId);

		if (!result) throw new Error("Produto invalido");

		let lines = await db.cart.findAll({
			where: {
				productprodid: prodId,
			},
		});

		if (lines.length === 0) throw new Error("Não existem entradas deste produto em nenhum carrinho");

		let response = {
			success: 1,
			length: lines.length,
			results: lines.map((cart) => {
				return {
					quantity: cart.quantity,
					useruid: cart.useruid,
					productprodid: cart.productprodid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getCartByUsers = async (userId) => {
	try {
		let result = await db.user.findByPk(userId);

		if (!result) throw new Error("Utilizador invalido");

		let lines = await db.cart.findAll({
			where: {
				useruid: userId,
			},
		});

		if (lines.length === 0) throw new Error("O carrinho deste utilizador esta vazio");

		let response = {
			success: 1,
			length: lines.length,
			results: lines.map((cart) => {
				return {
					quantity: cart.quantity,
					useruid: cart.useruid,
					productprodid: cart.productprodid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getCart = async (userId, prodId) => {
	try {
		let result = await db.cart.findOne({
			where: {
				useruid: userId,
				productprodid: prodId,
			},
		});

		if (!result) throw new Error("Esta entrada não inexistente");

		let response = {
			success: 1,
			results: {
				quantity: result.quantity,
				useruid: result.useruid,
				productprodid: result.productprodid,
			},
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.addCart = async (quantity, prodId, idUserToken) => {
	try {
		let user = await db.user.findByPk(idUserToken);

		if (!user) throw new Error("Utilizador inexistente");

		let newCart = await db.cart.create({
			quantity: quantity,
			useruid: idUserToken,
			productprodid: prodId,
		});

		let response = {
			success: 1,
			message: "Produto adicionado ao carrinho com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.removeCart = async (prodId, idUserToken) => {
	try {
		const result = await db.cart.findOne({
			where: {
				useruid: idUserToken,
				productprodid: prodId,
			},
		});

		if (!result) throw new Error("Registo inexistente");

		await result.destroy();

		let response = {
			success: 1,
			message: "Registo removido com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};
