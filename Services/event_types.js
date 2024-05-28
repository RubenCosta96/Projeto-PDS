const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getEventsType = async () =>{
    try{
        let event_type = await db.event_type.findAll();

        if (event_type.length === 0) throw new Error("Não existem tipos de evento!");
    
        let response = {
          success: 1,
          length: event_type.length,
          results: event_type.map((event_type) => {
            return {
              id: event_type.etid,
              description: event_type.et_description,
            };
          }),
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getEventType = async (id) =>{
    try{
        let event_type = await db.event_type.findByPk(id);

        if (!event_type) throw new Error("Tipo de evento inexistente!");

        let response = {
        success: 1,
        length: 1,
        results: [
            {
            id: event_type.etid,
            description: event_type.et_description,
            },
        ],
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.addEventType = async (idUserToken,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let newEventType = await db.event_type.create({
                        et_description: description,
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
            message: "Tipo de evento criado com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.editEventType = async (idUserToken,id,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let event_type = await db.event_type.findByPk(id);

                    if (!event_type) {
                        throw new Error("Tipo de evento inexistente!");
                    }
                    
                    event_type.et_description = description;

                    await event_type.save();
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
            message: "Tipo de evento editado com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.removeEventType = async (idUserToken,id) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let event_type = await db.event_type.findByPk(id);

                    if (!event_type) {
                        throw new Error("Tipo de evento inexistente!");
                    }
                    await event_type.destroy();
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
            message: "Tipo de evento removido com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};