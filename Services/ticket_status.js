const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllTicketStatus = async () => {
    try {
        let status = await db.ticket_status.findAll();

        if (status.length === 0)
            return res
                .status(404)
                .send({ success: 0, message: "Não existem status de tickets" });

        let response = {
            success: 1,
            length: status.length,
            results: status.map((ticket_status) => {
                return {
                    id: ticket_status.ts_id,
                    description: ticket_status.desc_ticket_status,
                };
            }),
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.getTicketStatus = async (id) => {
    try {
        let status = await db.ticket_status.findByPk(id);

        if (!status)
            return res
                .status(404)
                .send({ success: 0, message: "Status inexistente" });

        let response = {
            success: 1,
            length: 1,
            results: [
                {
                    id: ticket_status.ts_id,
                    description: ticket_status.desc_ticket_status,
                },
            ],
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.addTicketStatus = async (idUserToken, description) => {
    try {
        let user = await utils.userType(idUserToken);

        switch (user) {
            case 1: //Admin
                try {
                    let new_ticket_status = await db.ticket_status.create({
                        desc_ticket_status: description,
                    });
                } catch (err) {
                    throw new Error(err);
                }
                break;
            case 2: //Manager
                throw new Error("Sem permissao!");
                break;
            case 3: //User
                throw new Error("Sem permissao!");
            default:
                throw new Error("Utilizador nao reconhecido!");
        }

        let response = {
            success: 1,
            message: "Status de ticket adicionado com sucesso",
        };
        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.removeTicketStatus = async (idUserToken, id) => {
    try {
        let user = await utils.userType(idUserToken);

        switch (user) {
            case 1: //Admin
                try {
                    const status = await db.ticket_status.findByPk(id);

                    if (!status) {
                        return { success: 0, message: "Status inexistente" };
                    }
                    await status.destroy();
                } catch (err) {
                    throw new Error(err);
                }
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
            message: "Status removido com sucesso",
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.editTicketStatus = async (idUserToken, id, description) => {
    try {
        let user = await utils.userType(idUserToken);

        switch (user) {
            case 1: //Admin
                try {
                    let status = await db.ticket_status.findByPk(id);

                    if (!status)
                        throw new Error("Status inexistente"); 

                    status.desc_ticket_status = description;

                    await status.save();
                } catch (err) {
                    throw new Error(err);
                }
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
            message: "Status editado com sucesso",
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};
