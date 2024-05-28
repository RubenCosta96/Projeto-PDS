const db = require('../config/mysql');
const utils = require("../utils/index");

exports.getAds = async () => {
    try{
        let ad = await db.ad.findAll();

        if (ad.length === 0)  throw new Error("Não existem anúncios");
    
        let response = {
          success: 1,
          length: ad.length,
          results: ad.map((ad) => {
            return {
              id: ad.adid,
              userid: ad.useruid,
              pieceid: ad.pieceid,
              description: ad.description,
            };
          }),
        };
        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getAdById = async (id) => {
    try{
        let ad = await db.ad.findByPk(id);

        if (!ad) throw new Error("Anúncio inexistente");
        let response = {
          success: 1,
          length: 1,
          results: [
            {
              id: ad.adid,
              userid: ad.useruid,
              pieceid: ad.piecepid,
              description: ad.description,
            },
          ],
        };
    
        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.addAd = async (pieceId, description, userToken) => {
    try{
        let piece = await db.piece.findByPk(pieceId);
        if(!piece){
            throw new Error("Peça inexistente");
         }

        let newAd = await db.ad.create({
            useruid: userToken,
            piecepid: pieceId,
            description: description,
            ad_stateadstid: 1,
        });

        let response = {
            success: 1,
            message: "Anúncio criado com sucesso",
        };
    
        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.confirmPayment = async (id, propId) => {
    try{
        let ad = await db.ad.findByPk(id);

        if (!ad) {
            throw new Error("Anúncio inexistente");
        }

        let prop = await db.proposal.findByPk(propId);

        if(prop.proposal_statepsid != 2 || ad.adid != prop.adadid){
            throw new Error("Sem permissão");
        }

        ad.ad_stateadstid = 3;

        await ad.save();

        let response = {
            success: 1,
            message: "Pagamento confirmado com sucesso",
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.confirmReception = async (id, propId) => {
    try{
        let ad = await db.ad.findByPk(id);

        if (!ad) {
            throw new Error("Anúncio inexistente");
        }

        let prop = await db.proposal.findByPk(propId);

        if(prop.proposal_statepsid != 2 || ad.adid != prop.adadid || ad.ad_stateadstid != 3){
            throw new Error("Sem permissão");
        }

        ad.ad_stateadstid = 4;

        await ad.save();

        let response = {
            success: 1,
            message: "Receção confirmada com sucesso",
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.editAd = async (userId,pieceId, description) => {
    try{
        let ad = await db.ad.findByPk(id);

        if(ad.useruid != idUserToken){
            throw new Error("Sem permissão");
        }

        if (!ad) {
            throw new Error("Anúncio inexistente");
        }

        if (userId) ad.useruid = userId;
        if (pieceId) ad.piecepid = pieceId;
        if (description) ad.description = description;

        await ad.save();

        let response = {
            success: 1,
            message: "Anúncio editado com sucesso",
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.adRemove = async (id) => {
    try{
        let ad = await db.ad.findByPk(id);

        if (!ad) {
            throw new Error("Anúncio inexistente");
        }

        await ad.destroy();

        let response = {
            success: 1,
            message: "Anúncio removido com sucesso",
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

