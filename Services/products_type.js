const db = require('../config/mysql');
const utils = require("../utils/index");

exports.getAllProductTypes = async () =>{
    try{
        let productTypes = await db.product_type.findAll();

        if (productTypes.length === 0)
            throw new Error("Não existem tipos de produtos!");

        let response = {
        success: 1,
        length: productTypes.length,
        results: productTypes.map((product_type) => {
            return {
            id: productTypes.ptid,
            description: productTypes.pt_c,
            };
        }),
    };
        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.getProductType = async (id) =>{
    try{

        let result = await db.product.findByPk(id);

        if (!result) throw new Error("Tipo de produto inexistente!");

        let response = {
        success: 1,
        results: {
            id: productTypes.ptid,
            description: productTypes.pt_c,
        },
        };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.addProductType = async (idUserToken,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let newProductType = await db.product_type.create({
                        pt_description: description,
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
            message: "Tipo de produto criado com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.editProductType = async (id,idUserToken,description) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let productType = await db.product_type.findByPk(id);

                    if (!productType) {
                        throw new Error("Tipo de produto inexistente!");
                    }

                    if (description) productType.pt_description = description;

                    await productType.save();
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
            message: "Tipo de produto editado com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.removeProductType = async (id,idUserToken) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let productType = await db.product_type.findByPk(id);

                    if (!productType) {
                        throw new Error("Tipo de produto inexistente!");
                    }
                
                    await productType.destroy();
                
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
            message: "Tipo de produto removido com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};