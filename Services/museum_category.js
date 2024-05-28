const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getMuseumCategories = async () =>{
    try{
        let museum_category = await db.museum_category.findAll();

        if (museum_category.length === 0) 
            throw new Error("Não existem categorias de museu!");

        let response = {
        success: 1,
        length: museum_category.length,
        results: museum_category.map((museum_category) => {
            return {
            description: museum_category.mc_description,
            };
        }),
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getMuseumCategory = async (id) =>{
    try{
        let museum_category = await db.museum_category.findByPk(id);

        if (!museum_category)
            throw new Error("Categoria inexistente!");

        let response = {
        success: 1,
        length: 1,
        results: [
            {
            id: museum_category.mcid,
            description: museum_category.mc_description,
            },
        ],
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.addMuseumCategory = async (idUserToken,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let newMuseumCategory = await db.museum_category.create({
                        mc_description: description,
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
            message: "Categoria criada com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.editMuseumCategory = async (idUserToken,id,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let museum_category = await db.museum_category.findByPk(id);

                    if (!museum_category) {
                        throw new Error("Categoria inexistente!");
                    }
                
                    museum_category.mc_description = description;
                
                    await museum_category.save();
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
            message: "Categoria editada com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.removeMuseumCategory = async (idUserToken,id) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let museum_category = await db.museum_category.findByPk(id);

                    if (!museum_category) {
                        throw new Error("Categoria inexistente!");
                    }

                    await museum_category.destroy();
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
            message: "Categoria removido com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};