const db = require('../config/mysql');
const utils = require("../utils/index");

exports.getAdStates = async () =>{
    try{
        const ad_state = await db.ad_state.findAll();

        if (ad_state.length === 0) throw new Error("Não existem estados de anúncio");

        let response = {
        success: 1,
        length: ad_state.length,
        results: ad_state.map((ad_state) => {
            return {
            id: ad_state.adstid,
            description: ad_state.description,
            adid: ad_state.adsadid,
            };
        }),
        };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.getAdState = async (id) =>{
    try{

        let ad_state = await db.ad_state.findByPk(id);
    
        if (!ad_state) throw new Error("Estado de anúncio inexistente");
        let response = {
          success: 1,
          length: 1,
          results: [
            {
              id: ad_state.adstid,
              description: ad_state.description,
              adid: ad_state.adsadid,
            },
          ],
        };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.addAdState = async (idUserToken,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let newAdState = await db.ad_state.create({
                        description: description,
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
            message: "Estado de anúncio criado com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.editAdState = async (id,idUserToken,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let ad_state = await db.ad_state.findByPk(id);

                    if (!ad_state) {
                        throw new Error("Estado de anúncio inexistente");
                    }

                    if (description) ad_state.description = description;

                     await ad_state.save();
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
            message: "Estado de anúncio criado com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.removeAdState = async (id,idUserToken) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let ad_state = await db.ad_state.findByPk(id);

                    if (!ad_state) {
                        throw new Error("Estado de anúncio inexistente");
                    }

                    await ad_state.destroy();
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
            message: "Estado de anúncio removido com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};