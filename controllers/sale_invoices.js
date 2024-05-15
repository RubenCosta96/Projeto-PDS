const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllSales = async (req, res) => {
  try {
      let sales = await db.sale_invoice.findAll();

      if (sales.length === 0)
        return res.status(404).send({ success: 0, message: "Não existem vendas registadas" });

      let response = {
        success: 1,
        length: sales.length,
        results: sales.map((sale_invoice) => {
          return {
            id: sale_invoice.sale_invoiceid,
            date: sale_invoice.invoice_departure_date,
            user_id: sale_invoice.useruid,
            invoiceStatus: sale_invoice.Invoice_statusinvoicestatusid,
          };
        }),
      };
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.getSalesByUser = async (req, res) => {
    try {
        let id = req.params.id;
        let sales = await db.sale_invoice.findAll({
            where:{
                useruid: id,
            },
        });
  
        if (sales.length === 0)
            return res.status(404).send({ success: 0, message: "Não existem vendas registadas relativas e esse utilizador" });
  
        let response = {
            success: 1,
            length: sales.length,
            results: sales.map((sale_invoice) => {
            return {
                id: sale_invoice.sale_invoiceid,
                date: sale_invoice.invoice_departure_date,
                user_id: sale_invoice.useruid,
                invoiceStatus: sale_invoice.Invoice_statusinvoicestatusid,
            };
            }),
        };
        return res.status(200).send(response);
        } catch (err) {
        return res.status(500).send({ error: err, message: err.message });
        }
};

exports.getSalesByInvoiceStatus = async (req, res) => {
  try {
      let id = req.params.id;
      let status = await db.Invoice_status.findByPk(id);

      if(!status){
        return res.status(404).send({ success: 0, message: "O estado de faturaçao é invalido" });
      }

      let sales = await db.sale_invoice.findAll({
          where:{
            Invoice_statusinvoicestatusid: id,
          },
      });

      if (sales.length === 0)
          return res.status(404).send({ success: 0, message: "Não existem vendas registadas relativas e esse estado de faturação" });

      let response = {
          success: 1,
          length: sales.length,
          results: sales.map((sale_invoice) => {
          return {
              id: sale_invoice.sale_invoiceid,
              date: sale_invoice.invoice_departure_date,
              user_id: sale_invoice.useruid,
              invoiceStatus: sale_invoice.Invoice_statusinvoicestatusid,
          };
          }),
      };
      return res.status(200).send(response);
      } catch (err) {
      return res.status(500).send({ error: err, message: err.message });
      }
};


exports.getSale = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await db.sale_invoice.findByPk(id);

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "Registos de venda inexistente" });
    }

    let response = {    
      success: 1,
      results: {
        id: result.sale_invoiceid,
        date: result.invoice_departure_date,
        user_id: result.useruid,
        invoiceStatus: result.Invoice_statusinvoicestatusid,
      },
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addSale = async (req, res) => {
  try {
    let date = req.body.date;
    let userid = req.body.user_id;
    let invoiceStatus = req.body.invoice_status;
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

    let newSaleInvoice = await db.sale_invoice.create({
        invoice_departure_date: date,
        useruid: userid,
        Invoice_statusinvoicestatusid: invoiceStatus,
    });

    let response = {
      success: 1,
      message: "Venda registada com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding sale Invoice:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editSale = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let sale = await db.sale_invoice.findByPk(id);

    if (!sale) {
      return res
        .status(404)
        .send({ success: 0, message: "Registo de venda inexistente" });
    }

    let isManager = await utils.isManager(idUserToken); //Verificar
    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isManager && !isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let { date , user_id, invoiceStatus } = req.body;

    if (date) sale.invoice_departure_date = date;
    if (user_id) sale.useruid = user_id;
    if (invoiceStatus) sale.Invoice_statusinvoicestatusid = invoiceStatus;
    

    await sale.save();

    let response = {
      success: 1,
      message: "Registo de venda editado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing sale invoice:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeSale = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    const sale = await db.sale_invoice.findByPk(id);

    if (!sale) {
      return res
        .status(404)
        .send({ success: 0, message: "Registo de venda inexistente" });
    }

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    //Antes verificar se esta atribuido a algum produto, se sim nao permitir

    await sale.destroy();

    let response = {
      success: 1,
      message: "Registo de venda removido com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing sale invoice:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
