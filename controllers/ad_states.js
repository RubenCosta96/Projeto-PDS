const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAdStates = async (req, res) => {
  try {
    const ad_state = await db.ad_state.findAll();

    if (ad_state.length === 0) return res.status(404).send({ success: 0, message: "Não existem estados de anúncio" });

    let response = {
      success: 1,
      length: ad_state.length,
      results: ad_state.map((ad_state) => {
        return {
          id: ad_state.adstid,
          description: ad_state.description,
          adid: ad_state.adsadid,
        };
      }),
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getAdState = async (req, res) => {
  try {
    let id = req.params.id;
    /*
    let idUserToken = req.user.id;

    let isAdmin = await utils.isAdmin(idUserToken);
    if (!isAdmin && id != idUserToken) return res.status(403).send({ success: 0, message: "Sem permissão" });
    */

    let ad_state = await db.ad_state.findByPk(id);

    if (!ad_state) return res.status(404).send({ success: 0, message: "Estado de anúncio inexistente" });
    let response = {
      success: 1,
      length: 1,
      results: [
        {
          id: ad_state.adstid,
          description: ad_state.description,
          adid: ad_state.adsadid,
        },
      ],
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addAdState = async (req, res) => {
  try {
    let { description, adid } = req.body;

    /*
    let isAdmin = await utils.isAdmin(idUserToken); //Verificar
    if (!isAdmin && idOwner != idUserToken) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }
    */

    let ad_id = await db.ad.findByPk(adid);
    if (!ad) {
      return res.status(404).send({ success: 0, message: "O anúncio que está tentar associar não existe inexistente" });
    }
    

    

    let newAdState = await db.ad_state.create({
      description: description,
      adsadid: adid,
    });

    let response = {
      success: 1,
      message: "Estado de anúncio criado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding ad state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editAdState = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;
    let { description, adid } = req.body;

    let ad_state = await db.ad_state.findByPk(id);

    if (!ad_state) {
      return res.status(404).send({ success: 0, message: "Estado de anúncio inexistente" });
    }

    /*
      let idOwner = artist.id_user;
  
      let isAdmin = await utils.isAdmin(idUserToken); //Verificar
      if (!isAdmin && idOwner != idUserToken) {
        return res.status(403).send({ success: 0, message: "Sem permissão" });
      }
      */
    if (description) ad_state.description = description;
    if (adid) ad_state.adsadid = adid;

    await ad_state.save();

    let response = {
      success: 1,
      message: "Estado de anúncio editado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing ad state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeAdState = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    const ad_state = await db.ad_state.findByPk(id);

    if (!ad_state) {
      return res.status(404).send({ success: 0, message: "Estado de anúncio inexistente" });
    }

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar
    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    await ad_state.destroy();

    let response = {
      success: 1,
      message: "Estado de anúncio removido com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing ad state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
