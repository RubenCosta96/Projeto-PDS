const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getFavorites = async () => {
    try {
        let favorites = await db.favorites.findAll();

        if (favorites.length === 0) {
            return res
                .status(404)
                .send({ success: 0, message: "Não existem favoritos" });
        }

        let response = {
            success: 1,
            length: favorites.length,
            results: favorites.map((favorite) => {
                return {
                    user_id: favorite.useruid,
                    product_id: favorite.productprodid,
                };
            }),
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.getFavoriteById = async (id) => {
    try {
        let result = await db.favorites.findByPk(id);

        if (!favorite) {
            return res
                .status(404)
                .send({ success: 0, message: "Categoria de peça inexistente" });
        }

        let response = {
            success: 1,
            length: 1,
            results: [
                {
                    user_id: favorite.useruid,
                    product_id: favorite.productprodid,
                },
            ],
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.addFavorite = async (idUserToken, product_id) => {
    try {
        let user = await utils.UserType(idUserToken);

        switch (user) {
            case 1: //Admin
                try {
                    let newFavorite = await db.favorites.create({
                        useruid: user_id,
                        productprodid: product_id,
                    });
                } catch (err) {
                    throw new Error(err);
                }
                break;
            case 2: //Manager
                try {
                    let newFavorite = await db.favorites.create({
                        useruid: user_id,
                        productprodid: product_id,
                    });
                } catch (err) {
                    throw new Error(err);
                }
                break;
            case 3: //User
                try {
                    let newFavorite = await db.favorites.create({
                        useruid: user_id,
                        productprodid: product_id,
                    });
                } catch (err) {
                    throw new Error(err);
                }
                break;
            default:
                throw new Error("Favorito inválido");
        }

        let response = {
            success: 1,
            message: "Favorito adicionado com sucesso",
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.removeFavorite = async (idUserToken, id) => {
    try {
        let user = await utils.UserType(idUserToken);

        switch (user) {
            case 1: //Admin
                try {
                    let favorite = await db.favorites.findOne({
                        where: {
                            useruid: user_id,
                            productprodid: product_id,
                        },
                    });

                    if (!favorite) {
                        throw new Error("Favorito inexistente");
                    }

                    await favorite.destroy();
                } catch (err) {
                    throw new Error(err);
                }
                break;
            case 2: //Manager
                try {
                    let favorite = await db.favorites.findOne({
                        where: {
                            useruid: user_id,
                            productprodid: product_id,
                        },
                    });

                    if (!favorite) {
                        throw new Error("Favorito inexistente");
                    }

                    await favorite.destroy();
                } catch (err) {
                    throw new Error(err);
                }
                break;
            case 3: //User
                try {
                    let favorite = await db.favorites.findOne({
                        where: {
                            useruid: user_id,
                            productprodid: product_id,
                        },
                    });

                    if (!favorite) {
                        throw new Error("Favorito inexistente");
                    }

                    await favorite.destroy();
                } catch (err) {
                    throw new Error(err);
                }
                break;
            default:
                throw new Error("Favorito inválido");
        }

        let response = {
            success: 1,
            message: "Favorito removido com sucesso",
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};
