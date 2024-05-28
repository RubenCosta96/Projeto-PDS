const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllZipCodes = async () => {
    try {
        let result = await db.zip_code.findAll();

        if (result.length === 0) {
            return { success: 0, message: "Não existem codigos postais" };
        }

        let response = {
            success: 1,
            length: result.length,
            results: result.map((zip_code) => {
                return {
                    zipCode: zip_code.zipid,
                    location: zip_code.location,
                };
            }),
        };
        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.getZipCode = async (code) => {
    try {
        let result = await db.zip_code.findByPk(code);

        if (!result) {
            return { success: 0, message: "Codigo postal inexistente" };
        }

        let response = {
            success: 1,
            results: {
                zipCode: result.zipid,
                location: result.location,
            },
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.addZipCode = async (idUserToken, code, location) => {
    try {
        let user = await utils.userType(idUserToken);

        switch (user) {
            case 1: // Admin
                try {
                    let newzip = await db.zip_code.create({
                        zipid: code,
                        location: location,
                    });
                } catch (err) {
                    throw new Error(err);
                }
                break;
            case 2: // Manager (verificar o museu associado ao manager???)
                try {
                    let newzip = await db.zip_code.create({
                        zipid: code,
                        location: location,
                    });
                } catch (err) {
                    throw new Error(err);
                }
                break;
            case 3: // User, nao tem acesso a esta funçao
                throw new Error("Sem permissao!");
            default:
                throw new Error("Utilizador não reconhecido!");
        }
        let response = {
            success: 1,
            message: "Codigo criado com sucesso",
        };
        return response;
    } catch (err) {
        throw new Error(err);
    }
};

exports.removeZipCode = async (idUserToken, code) => {
    try {
        let user = await utils.userType(idUserToken);

        switch (user) {
            case 1: // Admin
                try {
                    const zip = await db.zip_code.findByPk(code);

                    if (!zip) {
                        return { success: 0, message: "Registo inexistente" };
                    }
                    await zip.destroy();
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
            message: "Codigo eliminado com sucesso",
        };

        return response;
    } catch (err) {
        throw new Error(err);
    }
};
