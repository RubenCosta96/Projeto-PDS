const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllUserStatus = async (req, res) => {
  try {
      let status = await db.user_status.findAll();

      if (status.length === 0)
        return res.status(404).send({ success: 0, message: "Não existe nenhum estado de utilizador" });

      let response = {
        success: 1,
        length: status.length,
        results: status.map((user_status) => {
          return {
            id: user_status.us_id,
            description: user_status.us_description,
          };
        }),
      };
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getUserStatus = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await db.user_status.findByPk(id);

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "Estado inexistente" });
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


exports.addUserStatus = async (req, res) => {
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
    
    let newUserStatus = await db.user_status.create({
        us_description: description,
    });

    let response = {
      success: 1,
      message: "Estado registada com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding User Status", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.editUserStatus = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let status = await db.user_status.findByPk(id);

    if (!status) {
      return res
        .status(404)
        .send({ success: 0, message: "Estado inexistente" });
    }

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let description = req.body.description;

    if (description) status.us_description = description;

    await status.save();

    let response = {
      success: 1,
      message: "Estado editado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing user state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeUserState = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let status = await db.user_status.findByPk(id);

    if (!status) {
      return res
        .status(404)
        .send({ success: 0, message: "Estado inexistente" });
    }

    //let idOwner = artist.id_user; //ver se faz sentido

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    //Antes verificar se esta atribuido a algum produto, se sim nao permitir

    await status.destroy();

    let response = {
      success: 1,
      message: "Estado removido com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing User State:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
