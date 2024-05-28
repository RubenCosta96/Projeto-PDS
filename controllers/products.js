const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllProducts = async (req, res) => {
  try {
    let products = await db.product.findAll();

    if (products.length === 0)
      return res
        .status(404)
        .send({ success: 0, message: "Não existem produtos" });

    let response = {
      success: 1,
      length: products.length,
      results: products.map((product) => {
        return {
          id: product.prodid,
          name: product.product_name,
          price: product.product_price,
          quantity: product.product_quantity,
          museum: product.museummid,
          type: product.product_typeptid,
        };
      }),
    };
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getProductsByMuseum = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await db.museum.findOne({
      where: {
        mid: id,
      },
    });

    if (!result) {
      return res.status(404).send({ success: 0, message: "Museu inexistente" });
    }

    let products = await db.product.findAll({
      where: {
        museummid: id,
      },
    });

    if (products.length === 0)
      return res.status(404).send({
        success: 0,
        message: "Não existem produtos associados a este museu",
      });

    let response = {
      success: 1,
      length: products.length,
      results: products.map((product) => {
        return {
          id: product.prodid,
          name: product.product_name,
          price: product.product_price,
          quantity: product.product_quantity,
          museum: product.museummid,
          type: product.product_typeptid,
        };
      }),
    };
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await db.product_type.findOne({
      where: {
        ptid: id,
      },
    });

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "Categoria inexistente" });
    }

    let products = await db.product.findAll({
      where: {
        product_typeptid: id,
      },
    });

    if (products.length === 0)
      return res.status(404).send({
        success: 0,
        message: "Não existem produtos associados a esta categoria",
      });

    let response = {
      success: 1,
      length: products.length,
      results: products.map((product) => {
        return {
          id: product.prodid,
          name: product.product_name,
          price: product.product_price,
          quantity: product.product_quantity,
          museum: product.museummid,
          type: product.product_typeptid,
        };
      }),
    };
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await db.product.findByPk(id);

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "Produto inexistente" });
    }

    let response = {
      success: 1,
      results: {
        id: result.prodid,
        name: result.product_name,
        price: result.product_price,
        quantity: result.product_quantity,
        museum: result.museummid,
        type: result.product_typeptid,
      },
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    let name = req.body.name;
    let price = req.body.price;
    let mid = req.body.museummid;
    let type = req.body.type;
    let idUserToken = req.user.id;

    let isManager = await utils.isManager(idUserToken); 
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

    let newProduct = await db.product.create({
      product_name: name,
      product_price: price,
      product_quantity: 0,
      museummid: mid,
      product_typeptid: type,
    });

    let response = {
      success: 1,
      message: "Produto criado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding Product:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editProduct = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let product = await db.product.findByPk(id);

    if (!product) {
      return res
        .status(404)
        .send({ success: 0, message: "Produto inexistente" });
    }

    let isManager = await utils.isManager(idUserToken); //Verificar
    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isManager && !isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let { name, price, museummid, type } = req.body;

    if (name) product.product_name = name;
    if (price) product.product_price = price;
    if (museummid) product.museummid = museummid;
    if (type) product.product_typeptid = type;
    //Colocar verificações

    await product.save();

    let response = {
      success: 1,
      message: "Produto editado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing Product:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeProduct = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    const product = await db.product.findByPk(id);

    if (!product) {
      return res
        .status(404)
        .send({ success: 0, message: "Produto inexistente" });
    }

    //let idOwner = artist.id_user; //ver se faz sentido

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    await product.destroy();

    let response = {
      success: 1,
      message: "Produto removido com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing Product:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
