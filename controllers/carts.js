const { where } = require("sequelize");
const db = require("../config/mysql");
const user = require("../models/user");
const utils = require("../utils/index");

exports.getAllCarts = async (req, res) => {
  try {
    let result = await db.cart.findAll();

    if (result.length === 0)
      return res
        .status(404)
        .send({ success: 0, message: "Não existem entradas no carrinho" });

    let response = {
      success: 1,
      length: result.length,
      results: result.map((cart) => {
        return {
            quantity: cart.quantity,
            useruid: cart.useruid,
            productprodid: cart.productprodid,
        };
      }),
    };
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getCartByProduct = async (req, res) => {
    try {
      let prodId = req.params.id;

      let result = await db.product.findByPk(prodId);
  
      if (!result) {
        return res.status(404).send({ success: 0, message: "Produto invalido" });
      }
  
      let lines = await db.cart.findAll({
        where: {
            productprodid: prodId,
        },
      });
  
      if (lines.length === 0)
        return res.status(404).send({
          success: 0,
          message: "Não existem entradas deste produto em nenhum carrinho",
        });
  
      let response = {
        success: 1,
        length: lines.length,
        results: lines.map((cart) => {
          return {
            quantity: cart.quantity,
            useruid: cart.useruid,
            productprodid: cart.productprodid,
          };
        }),
      };
      return res.status(200).send(response);
    } catch (err) {
      return res.status(500).send({ error: err, message: err.message });
    }
};


exports.getCartByUsers = async (req, res) => {
    try {
      let userId = req.params.id;

      let result = await db.user.findByPk(userId);
  
      if (!result) {
        return res.status(404).send({ success: 0, message: "Utilizador invalido" });
      }
  
      let lines = await db.cart.findAll({
        where: {
            useruid: userId,
        },
      });
  
      if (lines.length === 0)
        return res.status(404).send({
          success: 0,
          message: "O carrinho deste utilizador esta vazio",
        });
  
      let response = {
        success: 1,
        length: lines.length,
        results: lines.map((cart) => {
          return {
            quantity: cart.quantity,
            useruid: cart.useruid,
            productprodid: cart.productprodid,
          };
        }),
      };
      return res.status(200).send(response);
    } catch (err) {
      return res.status(500).send({ error: err, message: err.message });
    }
};



exports.getCart = async (req, res) => {
  try {
    let userId = req.body.userId;
    let prodId = req.body.productId;

    let result = await db.cart.findOne({
        where:{
            useruid: userId,
            productprodid: prodId,
        }
    });

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "Esta entrada não inexistente" });
    }

    let response = {
      success: 1,
      results: {
        quantity: result.quantity,
        useruid: result.useruid,
        productprodid: result.productprodid,
      },
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addCart = async (req, res) => {
  try {
    let quantity = req.body.quantity;
    let prodId = req.body.productId;
    let idUserToken = req.user.id;

    let user = await db.user.findByPk(idUserToken);
    if (!user) {
      return res
        .status(404)
        .send({ success: 0, message: "Utilizador inexistente" });
    }

    //Verificaçao para entradas repetidas nas BD
    let newCart = await db.cart.create({
        quantity: quantity,
        useruid: idUserToken,
        productprodid: prodId,
    });

    let response = {
      success: 1,
      message: "Produto adicionado ao carrinho com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding record:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeCart = async (req, res) => {
  try {
    let prodId = req.body.productId;
    let idUserToken = req.user.id;

    const result = await db.cart.findOne({
        where:{
            useruid: idUserToken,
            productprodid: prodId,
        }
    });

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "Registo inexistente" });
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