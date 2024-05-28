const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getUnreadNotifications = async (idUserToken) =>{
    try{
        let notifications = await db.notification.findAll({ where: { useruid: idUserToken, notification_statensid: 1 }});

        if (notifications.lenght === 0) {
            throw new Error("Não existem notificações por ler!");
		}

        let response = {
			success: 1,
			length: notifications.length,
			results: notifications.map((notification) => {
				return {
                    type: notification.notification_typentid,
					id: notification.nid,
					description: notification.n_description,
                    state : notification.notification_statensid
				};
			}),
		};
        
        return response;
    }catch (err) {
        throw new Error(err);
    }
}

exports.getReadNotifications = async (idUserToken) =>{
    try{
        let notifications = await db.notification.findAll({ where: { useruid: idUserToken, notification_statensid: 2 }});

        if (notifications.length === 0) {
            throw new Error("Não existem notificações!");
		}

        let response = {
			success: 1,
			length: notifications.length,
			results: notifications.map((notification) => {
				return {
                    type: notification.notification_typentid,
					id: notification.nid,
					description: notification.n_description,
                    state : notification.notification_statensid
				};
			}),
		};
        
        return response;
    }catch (err) {
        throw new Error(err);
    }
}

exports.getAllNotifications = async (idUserToken) =>{
    try{

        let notifications = await db.notification.findAll({ where: { useruid: idUserToken }});

        if (notifications.lenght === 0) {
            throw new Error("Não existem notificações!");
		}

        let response = {
			success: 1,
			length: notifications.length,
			results: notifications.map((notification) => {
				return {
                    type: notification.notification_typentid,
					id: notification.nid,
					description: notification.n_description,
                    state : notification.notification_statensid
				};
			}),
		};
        
        return response;
    }catch (err) {
        throw new Error(err);
    }
}

exports.addNotifications = async (idUserToken,description, type, userId) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let newNotification = await db.notification.create({
                        n_description: description,
                        notification_typentid: type,
                        useruid: userId,
                        notification_statensid: 1
                    });
				} catch (err) {
					throw new Error(err);
				}
                break;
			case 2: //Manager
                try {
                    let newNotification = await db.notification.create({
                        n_description: description,
                        notification_typentid: type,
                        useruid: userId,
                        notification_statensid: 1
                    });
                } catch (err) {
                    throw new Error(err);
                }
                break;
			case 3: //User, nao tem acesso a esta funçao
                throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

        let response = {
			success: 1,
			message: "Notificação enviada com sucesso",
		};

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.informImproperConduct = async (idUserToken,userId,description,type) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let user = await db.user.findByPk(id);
                    if (!user) throw new Error("Não existem notificações!");

                    let newNotification = await db.notification.create({
                        n_description: description,
                        notification_typentid: type,
                        useruid: userId,
                        notification_statensid: 1
                    });
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
			message: "Notificação enviada com sucesso",
		};

        return response;
    }catch (err) {
        throw new Error(err);
    }
};