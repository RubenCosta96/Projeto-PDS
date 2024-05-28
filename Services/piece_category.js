const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getPieceCategories = async () =>{
    try{
        let pieceCategories = await db.piece_category.findAll();

        if (pieceCategories.length === 0) {
            throw new Error("Não existem categorias de peças");
        }

        let response = {
        success: 1,
        length: pieceCategories.length,
        results: pieceCategories.map((pieceCategory) => {
            return {
            description: pieceCategory.pc_description,
            };
        }),
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getPieceCategory = async (id) =>{
    try{
        let pieceCategory = await db.piece_category.findByPk(id);

        if (!pieceCategory) {
            throw new Error("Categoria de peça inexistente");
        }

        let response = {
        success: 1,
        length: 1,
        results: [
            {
            description: pieceCategory.pc_description,
            },
        ],
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.addPieceCategory = async (idUserToken,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let newPieceCategory = await db.piece_category.create({
                        pc_description: description,
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
            message: "Categoria de peça criada com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.editPieceCategory = async (idUserToken,id,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let pieceCategory = await db.piece_category.findByPk(id);

                    if (!pieceCategory) {
                        throw new Error("Categoria de peça inexistente");
                    }

                    pieceCategory.pc_description = description;
                    await pieceCategory.save();

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
            message: "Categoria de peça editada com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.removePieceCategory = async (idUserToken,id) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let pieceCategory = await db.piece_category.findByPk(id);

                    if (!pieceCategory) {
                        throw new Error("Categoria de peça inexistente");
                    }
                
                    await pieceCategory.destroy();
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
            message: "Categoria de peça removida com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};