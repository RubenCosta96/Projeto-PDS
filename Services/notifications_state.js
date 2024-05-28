const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getNotificationStates = async () =>{
    try{
        let notificationStates = await db.notification_state.findAll();

        if (notificationStates.length === 0) {
            throw new Error("Não existem estados de notificação!");
        }

        let response = {
        success: 1,
        length: notificationStates.length,
        results: notificationStates.map((notificationState) => {
            return {
            description: notificationState.ns_description,
            };
        }),
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getNotificationState = async (id) =>{
    try{

        let notificationState = await db.notification_state.findByPk(id);

        if (!notificationState) {
            throw new Error("Estado de notificação inexistente!");
        }

        let response = {
        success: 1,
        length: 1,
        results: [
            {
            description: notificationState.ns_description,
            },
        ],
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.addNotificationState = async (idUserToken,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let newNotificationState = await db.notification_state.create({
                        ns_description: description,
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
            message: "Estado de notificação criado com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.editNotificationState = async (idUserToken,id,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let notificationState = await db.notification_state.findByPk(id);

                    if (!notificationState) {
                        throw new Error("Estado de notificação inexistente!");
                    }

                    notificationState.ns_description = description;
                    await notificationState.save();
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
            message: "Estado de notificação editado com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.removeNotificationState = async (idUserToken,id) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let notificationState = await db.notification_state.findByPk(id);

                    if (!notificationState) {
                        throw new Error("Estado de notificação inexistente!");
                    }

                    await notificationState.destroy();
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
            message: "Estado de notificação removido com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};