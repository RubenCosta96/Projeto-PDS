const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getEventsStatus = async () =>{
    try{
        let event_status = await db.event_status.findAll();

        if (event_status.length === 0) return res.status(404).send({ success: 0, message: "Não existem estados de evento." });

        let response = {
        success: 1,
        length: event_status.length,
        results: event_status.map((event_status) => {
            return {
            id: event_status.es_id,
            description: event_status.es_description,
            };
        }),
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getEventStatus = async (id) =>{
    try{
        let event_status = await db.event_status.findByPk(id);

        if (!event_status) return res.status(404).send({ success: 0, message: "Estado de evento inexistente" });

        let response = {
        success: 1,
        length: 1,
        results: [
            {
            id: event_status.es_id,
            description: event_status.es_description,
            },
        ],
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.addEventStatus = async (idUserToken,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let newEventStatus = await db.event_status.create({
                        es_description: description,
                      });
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
            message: "Estado de evento criado com sucesso",
        };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.editEventStatus = async (idUserToken,id,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let event_status = await db.event_status.findByPk(id);

                    if (!event_status) {
                    return res.status(404).send({ success: 0, message: "Estado de evento inexistente" });
                    }

                    event_status.es_description = description;

                    await event_status.save();
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
            message: "Estado de evento editado com sucesso",
        };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.removeEventStatus = async (idUserToken,id) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let event_status = await db.event_status.findByPk(id);

                    if (!event_status) {
                        return res.status(404).send({ success: 0, message: "Estado de evento inexistente" });
                    }

                    await event_status.destroy();
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
            message: "Estado de evento removido com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};