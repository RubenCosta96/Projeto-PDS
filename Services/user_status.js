const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getUsersStatus = async () =>{
    try{
        let status = await db.user_status.findAll();

        if (status.length === 0)
            throw new Error("Não existe nenhum estado de utilizador");

        let response = {
            success: 1,
            length: status.length,
            results: status.map((user_status) => {
            return {
                id: user_status.us_id,
                description: user_status.us_description,
            };
            }),
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getUserStatus = async (id) =>{
    try{
        let result = await db.user_status.findByPk(id);

        if (!result) {
        return res
            .status(404)
            .send({ success: 0, message: "Estado inexistente" });
        }

        let response = {    
        success: 1,
        results: {
            id: result.us_id,
            description: result.us_description,
        },
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.addUserStatus = async (idUserToken,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let newUserStatus = await db.user_status.create({
                        us_description: description,
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
            message: "Estado registado com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.editUserStatus = async (idUserToken,id,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let status = await db.user_status.findByPk(id);

                    if (!status) {
                      return res
                        .status(404)
                        .send({ success: 0, message: "Estado inexistente" });
                    }
                
                
                    status.us_description = description;
                
                    await status.save();
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
            message: "Estado editado com sucesso",
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
                    let status = await db.user_status.findByPk(id);

                    if (!status) {
                    return res
                        .status(404)
                        .send({ success: 0, message: "Estado inexistente" });
                    }


                    await status.destroy();
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
            message: "Estado removido com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};