const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllUserTypes = async (req, res) => {
  try {
      let type = await db.user_type.findAll();

      if (type.length === 0)
        return res.status(404).send({ success: 0, message: "Não existe nenhum tipo de utilizador" });

      let response = {
        success: 1,
        length: type.length,
        results: type.map((user_type) => {
          return {
            id: user_type.utid,
            description: user_status.ut_description,
          };
        }),
      };
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getUserType = async (req, res) => {
  try {
    let id = req.params.id;

    let result = await db.user_type.findByPk(id);

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "Tipo de utilizador inexistente" });
    }

    let response = {    
      success: 1,
      results: {
        id: result.us_id,
        description: result.us_description,
      },
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.addUserType = async (req, res) => {
  try {
    let description = req.body.description;
    let idOwner = req.body.userId;
    let idUserToken = req.user.id;

    let isAdmin = await utils.isAdmin(idUserToken);

    if (idOwner != idUserToken && isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let user = await db.user.findByPk(idOwner);
    if (!user) {
      return res
        .status(404)
        .send({ success: 0, message: "Utilizador inexistente" });
    }

    //Verificaçao para entradas repetidas nas BD
    
    let newUserType = await db.user_type.create({
        ut_description: description,
    });

    let response = {
      success: 1,
      message: "Tipo de utilizador registado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding User type", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.editUserType = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let type = await db.user_type.findByPk(id);

    if (!type) {
      return res
        .status(404)
        .send({ success: 0, message: "Tipo de utilizador inexistente" });
    }

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let description = req.body.description;

    if (description) type.ut_description = description;

    await type.save();

    let response = {
      success: 1,
      message: "Tipo de utilizador editado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing user type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeUserState = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let type = await db.user_type.findByPk(id);

    if (!type) {
      return res
        .status(404)
        .send({ success: 0, message: "Tipo de utilizador inexistente" });
    }

    //let idOwner = artist.id_user; //ver se faz sentido

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    //Antes verificar se esta atribuido a algum produto, se sim nao permitir

    await type.destroy();

    let response = {
      success: 1,
      message: "Tipo de utilizador removido com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing User Type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
