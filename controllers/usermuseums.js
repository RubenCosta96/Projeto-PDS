const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllUserMuseum = async (req, res) => {
  try {
    let relations = await db.usermuseum.findAll();

    if (relations.length === 0)
      return res
        .status(404)
        .send({ success: 0, message: "Não existem registos" });

    let response = {
      success: 1,
      length: relations.length,
      results: relations.map((usermuseum) => {
        return {
          museumId: usermuseum.museummid,
          userId: usermuseum.useruid,
        };
      }),
    };
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getUserMuseum = async (req, res) => {
  try {
    let museumId = req.body.museumId;
    let userId = req.body.userId;

    let result = await db.usermuseum.findOne({
        where:{
            museummid: museumId,
            useruid: userId,
        }
    });

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "Registo inexistente" });
    }

    let response = {
      success: 1,
      results: {
        museumId: result.museummid,
        userId: result.useruid,
      },
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addUserMuseum = async (req, res) => {
  try {
    let museumId = req.body.museumId;
    let userId = req.body.userId;
    let idUserToken = req.user.id;

    let isManager = await utils.isManager(idUserToken); //Verificar, pode ser assim mas acho que fazia sentido ver se o utilizador esta ligado ao museu em questao
    let isAdmin = await utils.isAdmin(idUserToken);

    if (!isManager && !isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let user = await db.user.findByPk(idUserToken);
    if (!user) {
      return res
        .status(404)
        .send({ success: 0, message: "Utilizador inexistente" });
    }

    //Verificaçao para entradas repetidas nas BD

    let newuserMuseum = await db.usermuseum.create({
        museummid: museumId,
        useruid: userId,
    });

    let response = {
      success: 1,
      message: "Registo criado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding record:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeUserMuseum = async (req, res) => {
  try {
    let museumId = req.body.museumId;
    let userId = req.body.userId;
    let idUserToken = req.user.id;

    const result = await db.usermuseum.findOne({
        where:{
            museummid: museumId,
            useruid: userId,
        }
    });

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "Registo inexistente" });
    }

    //let idOwner = artist.id_user; //ver se faz sentido

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    await result.destroy();

    let response = {
      success: 1,
      message: "Registo removido com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing record:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
