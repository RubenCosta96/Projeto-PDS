const db = require('../config/mysql');
const utils = require("../utils/index");

exports.addPieces = async (name, artistId, collectionId, categoryId, museumId) => {
	try {
		
        if(!name || !artistId || !collectionId || !categoryId){
            throw new Error("Dados em falta");
        }
		
		let artist = await db.artist.findByPk(artistId);
		
		if(!artist){
            throw new Error("Artista Inexistente!");
        }
		
        let collection = await db.collection.findByPk(collectionId);
		
		if(!collection){
            throw new Error("Coleção Inexistente!");
        }
		
        let category = await db.piece_category.findByPk(categoryId);

		if(!category){
            throw new Error("Categoria Inexistente!");
        }
		
		let newPiece = await db.piece.create({
			piece_name: name,
			artistaid: artistId,
			collectioncid: collectionId,
			piece_categorypcid: categoryId,
			museummid: museumId
		});

		let response = {
			success: 1,
			message: "Peça criada com sucesso",
		};

		return response;
	} catch (err) {
		throw new Error(err);
	}
};

exports.getPieceById = async (id) => {
    try{
        let piece = await db.piece.findOne({
			where:{
				pid:id
		},
		include: [
			{
				model: db.artist,
				as: 'artistum',
				attributes: ['artist_name'],
			},
			{
				model: db.collection,
				as: 'collectionc',
				attributes: ['collection_name'],
			},
			{
				model: db.piece_category,
				as: 'piece_categorypc',
				attributes: ['pc_description'],
			}
		]
	});

		if (!piece) {
			throw new Error("Peça inexistente");
		}

		let response = {
			success: 1,
			length: 1,
			results: [{
				id: piece.pid,
				name: piece.piece_name,
                artistid: piece.artistaid,
				artistdescription: piece.artistum.artist_name,
                collectionid: piece.collectioncid,
				collectiondescription: piece.collectionc.collection_name,
                categoryid: piece.piece_categorypcid,
				categorydescription: piece.piece_categorypc.pc_description,
			}],
		};
        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getPieces = async (id) => {
    try{
        let pieces = await db.piece.findAll({
			include: [
                {
                    model: db.artist,
                    as: 'artistum',
                    attributes: ['artist_name'],
                },
                {
                    model: db.collection,
                    as: 'collectionc',
                    attributes: ['collection_name'],
                },
                {
                    model: db.piece_category,
                    as: 'piece_categorypc',
                    attributes: ['pc_description'],
                }
            ]
	});

		if (pieces.length === 0) throw new Error("Não existem peças");

		let response = {
			success: 1,
			length: pieces.length,
			results: pieces.map((piece) => {
				return {
					id: piece.pid,
					name: piece.piece_name,
					artistid: piece.artistaid,
					artistdescription: piece.artistum.artist_name,
					collectionid: piece.collectioncid,
					collectiondescription: piece.collectionc.collection_name,
					categoryid: piece.piece_categorypcid,
					categorydescription: piece.piece_categorypc.pc_description,
				};
			}),
		};
        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getPieceByName = async (name) => {
    try{

        let pieces = await db.piece.findAll({
            where: { piece_name: name  },
            include: [
                {
                    model: db.artist,
                    as: 'artistum',
                    attributes: ['artist_name'],
                },
                {
                    model: db.collection,
                    as: 'collectionc',
                    attributes: ['collection_name'],
                },
                {
                    model: db.piece_category,
                    as: 'piece_categorypc',
                    attributes: ['pc_description'],
                }
            ]
        });

		if (!pieces) {
			throw new Error("Peça inexistente");
		}

		let response = {
			success: 1,
			length: pieces.length,
			results: pieces.map((piece) => {
				return {
					id: piece.pid,
					name: piece.piece_name,
					artistid: piece.artistaid,
					artistdescription: piece.artistum.artist_name,
					collectionid: piece.collectioncid,
					collectiondescription: piece.collectionc.collection_name,
					categoryid: piece.piece_categorypcid,
					categorydescription: piece.piece_categorypc.pc_description,
				};
			}),
		};
        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getPieceByCategory = async (categoryName) => {
    try{
        let category = await db.piece_category.findAll({ where: { pc_description: categoryName } });

        if (!category) {
			throw new Error("Categoria Inexistente!");
        }

        let pieces = await db.piece.findAll({ where: { 
			piece_categorypcid: category.pcid 
		},
		include: [
			{
				model: db.artist,
				as: 'artistum',
				attributes: ['artist_name'],
			},
			{
				model: db.collection,
				as: 'collectionc',
				attributes: ['collection_name'],
			},
			{
				model: db.piece_category,
				as: 'piece_categorypc',
				attributes: ['pc_description'],
			}
		]
	});

        if (!pieces) {
            throw new Error("Não há peças para esta categoria");
        }

        let response = {
			success: 1,
			length: pieces.length,
			results: pieces.map((piece) => {
				return {
					id: piece.pid,
					name: piece.piece_name,
					artistid: piece.artistaid,
					artistdescription: piece.artistum.artist_name,
					collectionid: piece.collectioncid,
					collectiondescription: piece.collectionc.collection_name,
					categoryid: piece.piece_categorypcid,
					categorydescription: piece.piece_categorypc.pc_description,
				};
			}),
		};
        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getPieceByCollection = async (collectionName) => {
    try{
        let collection = await db.collection.findAll({ where: { collection_name: collectionName } });

        if (!collection) {
            throw new Error("Coleção Inexistente!");
        }

        let pieces = await db.piece.findAll({
            where: {  collectioncid: collection.cid },
            include: [
                {
                    model: db.artist,
                    as: 'artistum',
                    attributes: ['artist_name'],
                },
                {
                    model: db.collection,
                    as: 'collectionc',
                    attributes: ['collection_name'],
                },
                {
                    model: db.piece_category,
                    as: 'piece_categorypc',
                    attributes: ['pc_description'],
                }
            ]
        });

        if (!pieces) {
            throw new Error("Não há peças para esta coleção");
        }

        let response = {
			success: 1,
			length: pieces.length,
			results: pieces.map((piece) => {
				return {
					id: piece.pid,
					name: piece.piece_name,
					artistid: piece.artistaid,
					artistdescription: piece.artistum.artist_name,
					collectionid: piece.collectioncid,
					collectiondescription: piece.collectionc.collection_name,
					categoryid: piece.piece_categorypcid,
					categorydescription: piece.piece_categorypc.pc_description,
				};
			}),
		};
        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getPieceByMuseum = async (id) => {
    try{
        let museum = await db.museum.findByPk(id);

        if (!museum) {
            throw new Error("Museu Inexistente!");
        }

        let pieces = await db.piece.findAll({
            where: { museummid: museum.mid },
            include: [
                {
                    model: db.artist,
                    as: 'artistum',
                    attributes: ['artist_name'],
                },
                {
                    model: db.collection,
                    as: 'collectionc',
                    attributes: ['collection_name'],
                },
                {
                    model: db.piece_category,
                    as: 'piece_categorypc',
                    attributes: ['pc_description'],
                }
            ]
        });

        if (pieces.length === 0) {
            throw new Error("Não há peças para este museu");
        }

        if (!pieces) {
            throw new Error("Não há peças para este museu");
        }

        let response = {
			success: 1,
			length: pieces.length,
			results: pieces.map((piece) => {
				return {
					id: piece.pid,
					name: piece.piece_name,
					artistid: piece.artistaid,
					artistdescription: piece.artistum.artist_name,
					collectionid: piece.collectioncid,
					collectiondescription: piece.collectionc.collection_name,
					categoryid: piece.piece_categorypcid,
					categorydescription: piece.piece_categorypc.pc_description,
				};
			}),
		};
        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.removePiece = async (pieceId, idUserToken) => {
    let user = await utils.userType(idUserToken);

    switch(user){
        case 1:
            try{
                let piece = await db.piece.findByPk(pieceId);

		        if (!piece) {
			        throw new Error("Peça inexistente");
		        }

                await piece.destroy();

		        let response = {
			        success: 1,
			        message: "Peça removida com sucesso",
		        };

                return response;
            }catch(err){
                throw new Error(err);
            }
            break;
        default:
            throw new Error("Utilizador nao reconhecido!");    
    }
};
