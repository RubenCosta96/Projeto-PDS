const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getCollections = async () =>{
    try{
        let collection = await db.collection.findAll();

        if (collection.length === 0) throw new Error("Não existem coleções");
    
        let response = {
          success: 1,
          length: collection.length,
          results: collection.map((collection) => {
            return {
              id: collection.cid,
              name: collection.collection_name,
            };
          }),
        };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.getCollection = async (id) =>{
    try{
        let collection = await db.collection.findByPk(id);

        if (!collection) throw new Error("Coleção inexistente");

        let response = {
        success: 1,
        length: 1,
        results: [
            {
            id: collection.cid,
            collection: collection.collection_name,
            },
        ],
        };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.addCollection = async (idUserToken,name) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let newCollection = await db.collection.create({
                        collection_name: name,
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
            message: "Coleção criada com sucesso",
        };

          return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.editCollection = async (idUserToken,name) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let collection = await db.collection.findByPk(id);

                    if (!collection) {
                        throw new Error("Coleção inexistente!");
                    }
                
                    collection.collection_name = name;
                
                    await collection.save();
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
            message: "Coleção editado com sucesso",
        };

          return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.removeCollection = async (idUserToken,id) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let collection = await db.collection.findByPk(id);

                    if (!collection) {
                        throw new Error("Coleção inexistente!");
                    }
                
                    await collection.destroy();
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
            message: "Coleção removido com sucesso",
        };

          return response;
    }catch (err) {
        throw new Error(err);
    }
};