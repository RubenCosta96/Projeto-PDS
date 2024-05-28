const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getNotificationTypes = async () =>{
    try{
        let notificationTypes = await db.notification_type.findAll();

        if (notificationTypes.length === 0) {
            throw new Error("Não existem tipos de notificação!");
        }

        let response = {
        success: 1,
        length: notificationTypes.length,
        results: notificationTypes.map((notificationType) => {
            return {
            description: notificationType.nt_description,
            };
        }),
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getNotificationType = async (id) =>{
    try{
        let notificationType = await db.notification_type.findByPk(id);

        if (!notificationType) {
            throw new Error("Não existem tipos de notificação!");
        }
    
        let response = {
          success: 1,
          length: 1,
          results: [
            {
              description: notificationType.nt_description,
            },
          ],
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.addNotificationType = async (idUserToken,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let newNotificationType = await db.notification_type.create({
                        nt_description: description,
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
            message: "Tipo de notificação criado com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.editNotificationType = async (idUserToken,id,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {

                    let notificationType = await db.notification_type.findByPk(id);

                    if (!notificationType) {
                        throw new Error("Tipo de notificação inexistente!");
                    }

                    notificationType.nt_description = description;
                    await notificationType.save();
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
            message: "Tipo de notificação editado com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.removeNotificationType = async (idUserToken,id) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let notificationType = await db.notification_type.findByPk(id);

                    if (!notificationType) {
                        throw new Error("Tipo de notificação inexistente!");
                    }

                    await notificationType.destroy();
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
            message: "Tipo de notificação removido com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};