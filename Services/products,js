const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllProducts = async () => {
	try {
		let products = await db.product.findAll();

		if (products.length === 0) throw new Error("Não existem produtos");

		let response = {
			success: 1,
			length: products.length,
			results: products.map((product) => {
				return {
					id: product.prodid,
					name: product.product_name,
					price: product.product_price,
					quantity: product.product_quantity,
					museum: product.museummid,
					type: product.product_typeptid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getProductsByMuseum = async (id) => {
	try {
		let result = await db.museum.findOne({
			where: {
				mid: id,
			},
		});

		if (!result) throw new Error("Museu inexistente");

		let products = await db.product.findAll({
			where: {
				museummid: id,
			},
		});

		if (products.length === 0) throw new Error("Não existem produtos associados a este museu");

		let response = {
			success: 1,
			length: products.length,
			results: products.map((product) => {
				return {
					id: product.prodid,
					name: product.product_name,
					price: product.product_price,
					quantity: product.product_quantity,
					museum: product.museummid,
					type: product.product_typeptid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getProductsByCategory = async (id) => {
	try {
		let result = await db.product_type.findOne({
			where: {
				ptid: id,
			},
		});

		if (!result) throw new Error("Categoria inexistente");

		let products = await db.product.findAll({
			where: {
				product_typeptid: id,
			},
		});

		if (products.length === 0) throw new Error("Não existem produtos associados a esta categoria");

		let response = {
			success: 1,
			length: products.length,
			results: products.map((product) => {
				return {
					id: product.prodid,
					name: product.product_name,
					price: product.product_price,
					quantity: product.product_quantity,
					museum: product.museummid,
					type: product.product_typeptid,
				};
			}),
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getProduct = async (id) => {
	try {
		let result = await db.product.findByPk(id);

		if (!result) throw new Error("Produto inexistente");

		let response = {
			success: 1,
			results: {
				id: result.prodid,
				name: result.product_name,
				price: result.product_price,
				quantity: result.product_quantity,
				museum: result.museummid,
				type: result.product_typeptid,
			},
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.addProduct = async (name, price, mid, type, idUserToken) => {
	try {
		let user = await utils.userType(idUserToken);
		let newProduct;

		switch (user) {
			case 1: //Admin
				newProduct = await db.product.create({
					product_name: name,
					product_price: price,
					product_quantity: 0,
					museummid: mid,
					product_typeptid: type,
				});
				break;
			case 2: //Manager
				newProduct = await db.product.create({
					product_name: name,
					product_price: price,
					product_quantity: 0,
					museummid: mid,
					product_typeptid: type,
				});
				break;
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "Produto criado com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.editProduct = async (id, idUserToken, name, price, museummid, type) => {
	try {
		let product = await db.product.findByPk(id);

		if (!product) throw new Error("Produto inexistente");

		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				if (name) product.product_name = name;
				if (price) product.product_price = price;
				if (museummid) product.museummid = museummid;
				if (type) product.product_typeptid = type;

				await product.save();

				break;
			case 2: //Manager
				if (name) product.product_name = name;
				if (price) product.product_price = price;
				if (museummid) product.museummid = museummid;
				if (type) product.product_typeptid = type;

				await product.save();

				break;
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

		let response = {
			success: 1,
			message: "Produto editado com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.removeProduct = async (id, idUserToken) => {
	try {
		const product = await db.product.findByPk(id);

		if (!product) throw new Error("Produto inexistente");

		let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				await product.destroy();
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
			message: "Produto removido com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};
