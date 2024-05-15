const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getCollections = async (req, res) => {
  try {
    //Verificar se é utilizador senão dar erro!

    let collection = await db.collection.findAll();

    if (collection.length === 0) return res.status(404).send({ success: 0, message: "Não existem coleções" });

    let response = {
      success: 1,
      length: collection.length,
      results: collection.map((collection) => {
        return {
          id: collection.cid,
          name: collection.collection_name,
        };
      }),
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getCollection = async (req, res) => {
  try {
    let id = req.params.id;
    /*
    let idUserToken = req.user.id;

    let isAdmin = await utils.isAdmin(idUserToken);
    if (!isAdmin && id != idUserToken) return res.status(403).send({ success: 0, message: "Sem permissão" });
    */

    let collection = await db.collection.findByPk(id);

    if (!collection) return res.status(404).send({ success: 0, message: "Coleção inexistente" });

    let response = {
      success: 1,
      length: 1,
      results: [
        {
          id: collection.cid,
          collection: collection.collection_name,
        },
      ],
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addCollection = async (req, res) => {
  try {
    let name = req.body.name;

    /*
    let isAdmin = await utils.isAdmin(idUserToken); //Verificar
    if (!isAdmin && idOwner != idUserToken) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let user = await db.user.findByPk(idOwner);
    if (!user) {
      return res.status(404).send({ success: 0, message: "Utilizador inexistente" });
    }
    */

    let newCollection = await db.collection.create({
      collection_name: name,
    });

    let response = {
      success: 1,
      message: "Coleção criada com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding collection:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editCollection = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let collection = await db.collection.findByPk(id);

    console.log(collection);

    if (!collection) {
      return res.status(404).send({ success: 0, message: "Coleção inexistente" });
    }

    /*
    let idOwner = artist.id_user;

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar
    if (!isAdmin && idOwner != idUserToken) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }
    */

    let { name } = req.body;

    if (name) collection.collection_name = name;

    await collection.save();

    let response = {
      success: 1,
      message: "Coleção editado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing collection:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeCollection = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    const collection = await db.collection.findByPk(id);

    if (!collection) {
      return res.status(404).send({ success: 0, message: "Coleção inexistente" });
    }

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar
    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    await collection.destroy();

    let response = {
      success: 1,
      message: "Coleção removido com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing collection:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
