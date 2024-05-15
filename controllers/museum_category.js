const utils = require("../utils/index");
const db = require("../config/mysql");

exports.getMuseumCategories = async (req, res) => {
  try {
    let museum_category = await db.museum_category.findAll();

    if (museum_category.length === 0) return res.status(404).send({ success: 0, message: "Não existem categorias de museu" });

    let response = {
      success: 1,
      length: museum_category.length,
      results: museum_category.map((museum_category) => {
        return {
          description: museum_category.mc_description,
        };
      }),
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getMuseumCategory = async (req, res) => {
  try {
    let id = req.params.id;
    /*
      let idUserToken = req.user.id;
  
      let isAdmin = await utils.isAdmin(idUserToken);
      if (!isAdmin && id != idUserToken) return res.status(403).send({ success: 0, message: "Sem permissão" });
      */

    let museum_category = await db.museum_category.findByPk(id);

    if (!museum_category) return res.status(404).send({ success: 0, message: "Categoria inexistente" });

    let response = {
      success: 1,
      length: 1,
      results: [
        {
          id: museum_category.mcid,
          description: museum_category.mc_description,
        },
      ],
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addMuseumCategory = async (req, res) => {
  try {
    let { description } = req.body;

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
    let newMuseumCategory = await db.museum_category.create({
      mc_description: description,
    });

    let response = {
      success: 1,
      message: "Categoria criada com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding category:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editMuseumCategory = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;
    let { description } = req.body;

    let museum_category = await db.museum_category.findByPk(id);

    if (!museum_category) {
      return res.status(404).send({ success: 0, message: "Categoria inexistente" });
    }

    /*
      let idOwner = artist.id_user;
  
      let isAdmin = await utils.isAdmin(idUserToken); //Verificar
      if (!isAdmin && idOwner != idUserToken) {
        return res.status(403).send({ success: 0, message: "Sem permissão" });
      }
      */
    if (description) museum_category.mc_description = description;


    await museum_category.save();

    let response = {
      success: 1,
      message: "Categoria editada com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing category:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeMuseumCategory = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    const museum_category = await db.museum_category.findByPk(id);

    if (!museum_category) {
      return res.status(404).send({ success: 0, message: "Categoria inexistente" });
    }

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar
    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    await museum_category.destroy();

    let response = {
      success: 1,
      message: "Categoria removido com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing category:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
