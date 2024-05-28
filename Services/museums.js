const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getMuseums = async () =>{
    try{
        let museums = await db.museum.findAll({
            include: [{
                model: db.museum_category,
                as: 'museum_categorymc',
                attributes: ['mc_description'],
            }],
        });

		if (museums.length === 0) throw new Error("Não existem museus!");

		let response = {
			success: 1,
			length: museums.length,
			results: museums.map((museum) => {
				return {
					id: museum.mid,
					name: museum.museum_name,
                    address: museum.museum_address,
                    categoryid: museum.museum_categorymcid,
                    categorydescription: museum.museum_categorymc.mc_description,
					zip: museum.zip_codezipid,
					zip_ext: museum.zip_ext,
				};
			}),
		};

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getMuseumById = async (id) =>{
    try{
        let museum = await db.museum.findOne({
			where:{
				mid: id
		},
		include: [{
			model: db.museum_category,
			as: 'museum_categorymc',
			attributes: ['mc_description'],
		}],
	});

		if (!museum) {
			throw new Error("Museu inexistente!");
		}

		let response = {
			success: 1,
			length: 1,
			results: [{
				id: museum.mid,
				name: museum.museum_name,
                address: museum.museum_address,
                categoryid: museum.museum_categorymcid,
                categorydescription: museum.museum_categorymc.mc_description,
				zip: museum.zip_codezipid,
				zip_ext: museum.zip_ext,
			}],
		};

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getMuseumByName = async (name) =>{
    try{
		let museums = await db.museum.findAll({ 
			where: { 
				museum_name: name 
			},
			include: [{
				model: db.museum_category,
				as: 'museum_categorymc',
				attributes: ['mc_description'],
			}],

		});

		if (museums.length === 0) {
			throw new Error("Não existem museus com este nome!");
		}

		let response = {
			success: 1,
			length: museums.length,
			results: museums.map((museum) => {
				return {
					id: museum.mid,
					name: museum.museum_name,
					address: museum.museum_address,
					categoryid: museum.museum_categorymcid,
					categorydescription: museum.museum_categorymc.mc_description,
					zip: museum.zip_codezipid,
					zip_ext: museum.zip_ext,
				};
			}),
		};

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getMuseumByCategory = async (categoryName) =>{
    try{
		let category = await db.museum_category.findOne({ where: { mc_description : categoryName } });

        if (!category) {
            throw new Error("Categoria inexistente!");
        }

        let museums = await db.museum.findAll({ where: { museum_categorymcid: category.mcid } });

        if (!museums) {
            throw new Error("Não existem museus com este nome!");
        }

        let response = {
			success: 1,
			length: museums.length,
			results: museums.map((museum) => {
				return {
					id: museum.mid,
					name: museum.museum_name,
					address: museum.museum_address,
					categoryid: category.mcid,
					categorydescription: category.mc_description,
					zip: museum.zip_codezipid,
					zip_ext: museum.zip_ext,
				};
			}),
		};

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.addMuseum = async (idUserToken,name, address,zip_ext, category, zip_code) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {	
					let newMuseum = await db.museum.create({
						museum_name: name,
						museum_address: address,
						state: 1,
						zip_ext: zip_ext,
						museum_categorymcid: category,
						zip_codezipid: zip_code,
					});
				} catch (err) {
					throw new Error(err);
				}
				break;
			case 2: //Manager
				try {	
					let newMuseum = await db.museum.create({
						museum_name: name,
						museum_address: address,
						state: 0,
						zip_ext: zip_ext,
						museum_categorymcid: category,
						zip_codezipid: zip_code,
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
			message: "Museu criado com sucesso",
		};

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.editMuseum = async (idUserToken,id,name, address, category, zip_code) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let museum = await db.museum.findByPk(id);

					if (!museum) {
						throw new Error("Museu inexistente!");
					}

					museum.museum_name = name;
					museum.museum_address = address;
					museum.museum_categorymcid = category;
					museum.zip_codezipid = zip_code;

					await museum.save();
				} catch (err) {
					throw new Error(err);
				}
                break;
			case 2: //Manager
                try{
					let museum = await db.museum.findByPk(id);

					if (!museum) {
						throw new Error("Museu inexistente!");
					}

					let usermuseum = await db.usermuseum.findOne({
						where:{
							useruid: idUserToken,
						}
					});

					if(usermuseum.useruid != idUserToken){
						throw new Error("Museu não lhe pertence");
					}

					museum.museum_name = name;
					museum.museum_address = address;
					museum.museum_categorymcid = category;
					museum.zip_codezipid = zip_code;

					await museum.save();
				}catch (err) {
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
			message: "Museu editado com sucesso",
		};

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.removeMuseum = async (idUserToken,id) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let museum = await db.museum.findByPk(id);

					if (!museum) {
						throw new Error("Museu inexistente!");
					}
					await museum.destroy();
				} catch (err) {
					throw new Error(err);
				}
                break;
			case 2: //Manager
                try{
					let museum = await db.museum.findByPk(id);

					if (!museum) {
						throw new Error("Museu inexistente!");
					}

					let usermuseum = await db.usermuseum.findOne({
						where:{
							useruid: idUserToken,
						}
					});

					if(usermuseum.useruid != idUserToken){
						throw new Error("Museu não lhe pertence");
					}
					await museum.destroy();
				}catch (err) {
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
			message: "Museu removido com sucesso",
		};

        return response;
    }catch (err) {
        throw new Error(err);
    }
};

exports.approveMuseum = async (idUserToken,id) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
					let museum = await db.museum.findByPk(id);

					if (!museum) {
						throw new Error("Museu inexistente!");
					}

					if (museum.state === 1) {
						throw new Error("Museu já aprovado!");
					}

					museum.state = 1;
					await museum.save();
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
			message: "Museu aprovado com sucesso",
		};

        return response;
    }catch (err) {
        throw new Error(err);
    }
};