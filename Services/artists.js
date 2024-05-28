const db = require('../config/mysql');
const utils = require("../utils/index");

exports.getArtists = async () =>{
    try{
        let artists = await db.artist.findAll();

		if (artists.length === 0)
			throw new Error("Não existem artistas");

        let response = {
			success: 1,
			length: artists.length,
			results: artists.map((artist) => {
				return {
					id: artist.aid,
                    name: artist.artist_name,
                    birthday: artist.artist_birthdate,
				};
			}),
		};

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getArtist = async (id) =>{
    try{
        let artist = await db.artist.findByPk(id);

		if (!artist) {
			throw new Error("Artista inexistente");
		}

		let response = {
			success: 1,
			results: {
				id: artist.aid,
				name: artist.artist_name,
				birthday: artist.artist_birthdate,
			}
		};

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.addArtist = async (idUserToken, name, birthday) =>{
    try{
        let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				try{
                    let newArtist = await db.artist.create({
                        artist_name: name,
                        artist_birthday: birthday,
                    });
                }catch (err) {
		            throw new Error(err);
	            }
                break;
			case 2: //Manager, nao tem acesso a esta funçao
                throw new Error("Sem permissao!");
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

        let response = {
			success: 1,
			message: "Artista criado com sucesso",
		};

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.editArtist = async (idUserToken, id, name, birthday) =>{
    try{
        let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				try{
                    let artist = await db.artist.findByPk(id);

		            if (!artist) {
			            throw new Error("Artista inexistente");
		            }

                    artist.name = name;
		            artist.birthday = birthday; //Colocar verificações

		            await artist.save();
                }catch (err) {
		            throw new Error(err);
	            }
                break;
			case 2: //Manager, nao tem acesso a esta funçao
                throw new Error("Sem permissao!");
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

        let response = {
			success: 1,
			message: "Artista editado com sucesso",
		};

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.removeArtist = async (idUserToken, id) =>{
    try{
        let user = await utils.userType(idUserToken);

		switch (user) {
			case 1: //Admin
				try{
                    let artist = await db.artist.findByPk(id);

                    if (!artist) {
                        throw new Error("Artista inexistente");
                    }
                    await artist.destroy();
                }catch (err) {
		            throw new Error(err);
	            }
                break;
			case 2: //Manager, nao tem acesso a esta funçao
                throw new Error("Sem permissao!");
			case 3: //User, nao tem acesso a esta funçao
				throw new Error("Sem permissao!");
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

        let response = {
			success: 1,
			message: "Artista removido com sucesso",
		};

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

