const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllProductTypes = async (req, res) => {
  try {
    let productTypes = await db.product_type.findAll();

    if (productTypes.length === 0)
      return res
        .status(404)
        .send({ success: 0, message: "Não existem tipos de produtos" });

    let response = {
      success: 1,
      length: productTypes.length,
      results: productTypes.map((product_type) => {
        return {
          id: productTypes.ptid,
          description: productTypes.pt_c,
        };
      }),
    };
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getProductType = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await db.product.findByPk(id);

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "Tipo de Produto inexistente" });
    }

    let response = {
      success: 1,
      results: {
        id: productTypes.ptid,
        description: productTypes.pt_c,
      },
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addProductType = async (req, res) => {
  try {
    let name = req.body.description;
    let idOwner = req.body.idOwner;
    let idUserToken = req.user.id;

    let isManager = await utils.isManager(idUserToken); //Verificar, pode ser assim mas acho que fazia sentido ver se o utilizador esta ligado ao museu em questao
    let isAdmin = await utils.isAdmin(idUserToken);

    if (!isManager && idOwner != idUserToken && isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let user = await db.user.findByPk(idOwner);
    if (!user) {
      return res
        .status(404)
        .send({ success: 0, message: "Utilizador inexistente" });
    }

    //Verificaçao para entradas repetidas nas BD

    let newProductType = await db.product_type.create({
      pt_description: description,
    });

    let response = {
      success: 1,
      message: "Tipo de produto criado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding Product type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editProductType = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let productType = await db.product_type.findByPk(id);

    if (!productType) {
      return res
        .status(404)
        .send({ success: 0, message: "Tipo de produto inexistente" });
    }

    let isManager = await utils.isManager(idUserToken); //Verificar
    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isManager && !isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let description = req.body.description;

    if (description) productType.pt_description = description;
    //Colocar verificações

    await productType.save();

    let response = {
      success: 1,
      message: "Tipo de produto editado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing Product:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeProductType = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    const productType = await db.product_type.findByPk(id);

    if (!productType) {
      return res
        .status(404)
        .send({ success: 0, message: "Tipo de produto inexistente" });
    }

    //let idOwner = artist.id_user; //ver se faz sentido

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    //Antes verificar se esta atribuido a algum produto, se sim nao permitir

    await productType.destroy();

    let response = {
      success: 1,
      message: "Tipo de produto removido com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing Product Type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
