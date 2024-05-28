const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllPurchaseLines = async (req, res) => {
  try {
      let purchaseLines = await db.purchase_line.findAll();

      if (purchaseLines.length === 0)
        return res.status(404).send({ success: 0, message: "Não existe nenhuma linha registada" });

      let response = {
        success: 1,
        length: purchaseLines.length,
        results: purchaseLines.map((purchase_line) => {
          return {
            id: purchaseLines.purchase_lid,
            quantity: purchaseLines.purline_quantity,
            saleInvoiceId: purchaseLines.purchase_invoicepurchase_invoiceid,
            productId: purchaseLines.productprodid,
          };
        }),
      };
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.getLinesByPurchase = async (req, res) => {
    try {
        let id = req.params.id;
        let lines = await db.purchase_line.findAll({
            where:{
                purchase_invoicepurchase_invoiceid: id,
            },
        });
  
        if (lines.length === 0)
            return res.status(404).send({ success: 0, message: "Não existem linhas registadas relativas e essa compra" });
  
        let response = {
            success: 1,
            length: lines.length,
            results: lines.map((purchase_line) => {
            return {
                id: purchase_line.purchase_lid,
                quantity: purchase_line.purline_quantity,
                saleInvoiceId: purchase_line.purchase_invoicepurchase_invoiceid,
                productId: purchase_line.productprodid,
            };
            }),
        };
        return res.status(200).send(response);
        } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
        }
    };


exports.getPurchaseLine = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await db.purchase_line.findByPk(id);

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "Linha de compra inexistente" });
    }

    let response = {    
      success: 1,
      results: {
        id: result.purchase_lid,
        quantity: result.purline_quantity,
        purchaseInvoiceId: result.purchase_invoicepurchase_invoiceid,
        productId: result.productprodid,
      },
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addPurchaseLine = async (req, res) => {
  try {
    let quantity = req.body.quantity;
    let purchaseId = req.body.PurchaseInvoiceId;
    let prodId = req.body.productId;
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
    
    let newPurchaseLine = await db.purchase_line.create({
        purline_quantity: quantity,
        productprodid: prodId,
        purchase_invoicepurchase_invoiceid: purchaseId,
    });

    let response = {
      success: 1,
      message: "linha de compra registada com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding purchase Line:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.editPurchaseLine = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let purchaseLine = await db.purchase_line.findByPk(id);

    if (!purchaseLine) {
      return res
        .status(404)
        .send({ success: 0, message: "Linha de compra inexistente" });
    }

    let isManager = await utils.isManager(idUserToken); //Verificar
    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isManager && !isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let { quantity , purchaseId, prodId } = req.body;

    if (quantity) purchaseLine.purline_quantity = quantity;
    if (purchaseId) purchaseLine.purchase_invoicepurchase_invoiceid = purchaseId;
    if (prodId) purchaseLine.productprodid = prodId;
    

    await purchaseLine.save();

    let response = {
      success: 1,
      message: "Linha de compra editada com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing purchase line:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removePurchaseLine = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    const purchaseLine = await db.purchase_line.findByPk(id);

    if (!purchaseLine) {
      return res
        .status(404)
        .send({ success: 0, message: "Linha de compra inexistente" });
    }

    //let idOwner = artist.id_user; //ver se faz sentido

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    //Antes verificar se esta atribuido a algum produto, se sim nao permitir

    await purchaseLine.destroy();

    let response = {
      success: 1,
      message: "Linha de compra removida com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing purchase line:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
