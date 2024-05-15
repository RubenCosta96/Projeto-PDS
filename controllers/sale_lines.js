const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllSaleLines = async (req, res) => {
  try {
      let saleLines = await db.sale_line.findAll();

      if (saleLines.length === 0)
        return res.status(404).send({ success: 0, message: "Não existe nenhuma linha registada" });

      let response = {
        success: 1,
        length: saleLines.length,
        results: saleLines.map((sale_line) => {
          return {
            id: sale_line.sale_lid,
            quantity: sale_line.line_quantity,
            saleInvoiceId: sale_line.sale_invoicesale_invoiceid,
            productId: sale_line.productprodid,
          };
        }),
      };
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.getLinesBySale = async (req, res) => {
    try {
        let id = req.params.id;
        let lines = await db.sale_line.findAll({
            where:{
                sale_invoicesale_invoiceid: id,
            },
        });
  
        if (lines.length === 0)
            return res.status(404).send({ success: 0, message: "Não existem linhas registadas relativas e essa venda" });
  
        let response = {
            success: 1,
            length: lines.length,
            results: lines.map((sale_line) => {
            return {
                id: sale_line.sale_lid,
                quantity: sale_line.line_quantity,
                saleInvoiceId: sale_line.sale_invoicesale_invoiceid,
                productId: sale_line.productprodid,
            };
            }),
        };
        return res.status(200).send(response);
        } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
        }
    };


exports.getSaleLine = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await db.sale_line.findByPk(id);

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "Linha de venda inexistente" });
    }

    let response = {    
      success: 1,
      results: {
        id: result.sale_lid,
        quantity: result.line_quantity,
        saleInvoiceId: result.sale_invoicesale_invoiceid,
        productId: result.productprodid,
      },
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addSaleLine = async (req, res) => {
  try {
    let quantity = req.body.quantity;
    let saleId = req.body.saleInvoiceId;
    let prodId = req.body.productId;
    let idOwner = req.body.id;
    let idUserToken = req.user.id;

    let isManager = await utils.isManager(idUserToken);
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
    
    let newSaleLine = await db.sale_line.create({
        line_quantity: quantity,
        sale_invoicesale_invoiceid: saleId,
        productprodid: prodId,
    });

    let response = {
      success: 1,
      message: "linha de venda registada com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding sale Line:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.editSaleLine = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let saleLine = await db.sale_line.findByPk(id);

    if (!saleLine) {
      return res
        .status(404)
        .send({ success: 0, message: "Linha de venda inexistente" });
    }

    let isManager = await utils.isManager(idUserToken); //Verificar
    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isManager && !isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let { quantity , saleId, prodId } = req.body;

    if (quantity) saleLine.line_quantity = quantity;
    if (saleId) saleLine.sale_invoicesale_invoiceid = saleId;
    if (prodId) saleLine.productprodid = prodId;
    

    await saleLine.save();

    let response = {
      success: 1,
      message: "Linha de venda editada com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing sale line:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeSaleLine = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    const saleLine = await db.sale_line.findByPk(id);

    if (!saleLine) {
      return res
        .status(404)
        .send({ success: 0, message: "Linha de venda inexistente" });
    }

    //let idOwner = artist.id_user; //ver se faz sentido

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    //Antes verificar se esta atribuido a algum produto, se sim nao permitir

    await saleLine.destroy();

    let response = {
      success: 1,
      message: "Linha de venda removida com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing sale line:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
