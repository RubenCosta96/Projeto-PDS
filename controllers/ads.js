const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAds = async (req, res) => {
  try {
    const ad = await db.ad.findAll();

    if (ad.length === 0) return res.status(404).send({ success: 0, message: "Não existem anúncios" });

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

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getAd = async (req, res) => {
  try {
    let id = req.params.id;
    /*
    let idUserToken = req.user.id;

    let isAdmin = await utils.isAdmin(idUserToken);
    if (!isAdmin && id != idUserToken) return res.status(403).send({ success: 0, message: "Sem permissão" });
    */

    let ad = await db.ad.findByPk(id);

    if (!ad) return res.status(404).send({ success: 0, message: "Anúncio inexistente" });
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

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addAd = async (req, res) => {
  try {
    let { user_id, piece_id, description } = req.body;

    /*
    let isAdmin = await utils.isAdmin(idUserToken); //Verificar
    if (!isAdmin && idOwner != idUserToken) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }
    */
    let user = await db.user.findByPk(user_id);
    if (!user) {
      return res.status(404).send({ success: 0, message: "Utilizador inexistente" });
    }

    let piece = await db.piece.findByPk(piece_id);
    if(!piece){
      return res.status(404).send({ success: 0, message: "Peça inexistente" });
    }

    let newAd = await db.ad.create({
      useruid: user_id,
      piecepid: piece_id,
      description: description,
    });

    let response = {
      success: 1,
      message: "Anúncio criado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding ad:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editAd = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;
    let { user_id, piece_id, description } = req.body;

    let ad = await db.ad.findByPk(id);

    if (!ad) {
      return res.status(404).send({ success: 0, message: "Anúncio inexistente" });
    }

    /*
      let idOwner = artist.id_user;
  
      let isAdmin = await utils.isAdmin(idUserToken); //Verificar
      if (!isAdmin && idOwner != idUserToken) {
        return res.status(403).send({ success: 0, message: "Sem permissão" });
      }
      */

    if (user_id) ad.useruid = user_id;
    if (piece_id) ad.piecepid = piece_id;
    if (description) ad.description = description;

    await ad.save();

    let response = {
      success: 1,
      message: "Anúncio editado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing ad:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeAd = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    const ad = await db.ad.findByPk(id);

    if (!ad) {
      return res.status(404).send({ success: 0, message: "Anúncio inexistente" });
    }

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar
    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    await ad.destroy();

    let response = {
      success: 1,
      message: "Anúncio removido com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing ad:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
