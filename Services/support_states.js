const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllSupportStates = async () => {
    try {
        let states = await db.support_state.findAll();

        if (states.length === 0)
            throw new Error("Não existem estados de suporte",);

        let response = {
            success: 1,
            length: states.length,
            results: states.map((support_state) => {
                return {
                    id: support_state.ssid,
                    description: support_state.description,
                };
            }),
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.getSupportState = async (id) => {
    try {
        let state = await db.support_state.findByPk(id);

        if (!state)
            return res
                .status(404)
                .send({ success: 0, message: "Estado inexistente" });

        let response = {
            success: 1,
            length: 1,
            results: [
                {
                    id: support_state.ssid,
                    description: support_state.description,
                },
            ],
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.addSupportState = async (idUserToken, description) => {
    try {
        let user = await utils.userType(idUserToken);

        switch (user) {
            case 1: //Admin
                try {
                    let new_Support_state = await db.support_state.create({
                        description: ss_description,
                    });
                } catch (err) {
                    throw new Error(err);
                }
                break;
            case 2: //Manager
                throw new Error("Sem permissão");
            case 3: //User
                throw new Error("Sem permissão");
            default:
                throw new Error("Utilizador não encontrado");
        }

        let response = {
            success: 1,
            message: "Estado de suporte adicionado com sucesso",
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.removeSupportState = async (idUserToken, id) => {
    try {
        let user = await utils.userType(idUserToken);

        switch (user) {
            case 1: //Admin
                try {
                    let state = await db.support_state.findByPk(id);

                    if (!state) {
                        throw new Error("Estado inexistente");
                    }

                    await state.destroy();
                } catch (err) {
                    throw new Error(err);
                }
                break;
            case 2: //Manager
                throw new Error("Sem permissão");
            case 3: //User
                throw new Error("Sem permissão");
            default:
                throw new Error("Utilizador não encontrado");
        }

        let response = {
            success: 1,
            message: "Estado removido com sucesso",
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.editSupportState = async (idUserToken, id, description) => {
    try {
        let user = await utils.userType(idUserToken);

        switch (user) {
            case 1: //Admin
                try {
                    let state = await db.support_state.findByPk(id);
                    if (!state) {
                        throw new Error("Estado inexistente");
                    }
                    state.description = description;
                    await state.save();
                } catch (err) {
                    throw new Error(err);
                }
                break;
            case 2: //Manager
                throw new Error("Sem permissão");
            case 3: //User
                throw new Error("Sem permissão");
            default:
                throw new Error("Utilizador não encontrado");
        }

        let response = {
            success: 1,
            message: "Estado editado com sucesso",
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};
