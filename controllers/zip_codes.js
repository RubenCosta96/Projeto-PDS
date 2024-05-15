const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllZipCodes = async (req, res) => {
  try {
    let result = await db.zip_code.findAll();

    if (result.length === 0)
      return res
        .status(404)
        .send({ success: 0, message: "Não existem codigos postais" });

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
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getZipCode = async (req, res) => {
  try {
    let code = req.params.id;

    let result = await db.zip_code.findByPk(code);

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "Codigo postal inexistente" });
    }

    let response = {
      success: 1,
      results: {
        zipCode: result.zipid,
        location: result.location,
      },
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addZipCode = async (req, res) => {
  try {
    let code = req.body.zipCode;
    let local = req.body.userId;
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

    let newzip = await db.zip_code.create({
        zipCode: code,
        location: local,
    });

    let response = {
      success: 1,
      message: "Codigo criado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding record:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeZipCode = async (req, res) => {
  try {
    let code = req.body.zipCode;
    let idUserToken = req.user.id;

    const result = await db.zip_code.findByPk(code);

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