const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getUsersType = async () =>{
    try{
        let type = await db.user_type.findAll();

        if (type.length === 0)
            return res.status(404).send({ success: 0, message: "Não existe nenhum tipo de utilizador" });

        let response = {
            success: 1,
            length: type.length,
            results: type.map((user_type) => {
            return {
                id: user_type.utid,
                description: user_status.ut_description,
            };
            }),
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getUserType = async (id) =>{
    try{
        let result = await db.user_type.findByPk(id);

        if (!result) {
          return res
            .status(404)
            .send({ success: 0, message: "Tipo de utilizador inexistente" });
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

exports.addUserType = async (idUserToken,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let newUserType = await db.user_type.create({
                        ut_description: description,
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
            message: "Tipo de utilizador registado com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.editUserType = async (idUserToken,id,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let type = await db.user_type.findByPk(id);

                    if (!type) {
                    return res
                        .status(404)
                        .send({ success: 0, message: "Tipo de utilizador inexistente" });
                    }

                    type.ut_description = description;

                    await type.save();
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
            message: "Tipo de utilizador editado com sucesso",
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
                    let type = await db.user_type.findByPk(id);

                    if (!type) {
                      return res
                        .status(404)
                        .send({ success: 0, message: "Tipo de utilizador inexistente" });
                    }
                
                    await type.destroy();
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
            message: "Tipo de utilizador removido com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};