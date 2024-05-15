const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllInvoiceStatus = async (req, res) => {
  try {
      let status = await db.Invoice_status.findAll();

      if (status.length === 0)
        return res.status(404).send({ success: 0, message: "Não existe nenhum estado de faturação" });

      let response = {
        success: 1,
        length: status.length,
        results: status.map((Invoice_status) => {
          return {
            id: Invoice_status.invoicestatusid,
            description: Invoice_status.description,
          };
        }),
      };
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getInvoiceStatus = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await db.Invoice_status.findByPk(id);

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "Estado de faturação inexistente" });
    }

    let response = {    
      success: 1,
      results: {
        id: result.invoicestatusid,
        description: result.description,
      },
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.addInvoiceStatus = async (req, res) => {
  try {
    let description = req.body.description;
    let idUserToken = req.user.id;

    let isAdmin = await utils.isAdmin(idUserToken);

    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let user = await db.user.findByPk(idUserToken);
    if (!user) {
      return res
        .status(404)
        .send({ success: 0, message: "Utilizador inexistente" });
    }

    //Verificaçao para entradas repetidas nas BD
    
    let NewInvoiceStatus = await db.Invoice_status.create({
        description: description,
    });

    let response = {
      success: 1,
      message: "Estado de faturação registado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding invoice Status", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.editInvoiceStatus = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let status = await db.Invoice_status.findByPk(id);

    if (!status) {
      return res
        .status(404)
        .send({ success: 0, message: "Estado de faturação inexistente" });
    }

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let description = req.body.description;

    if (description) status.description = description;

    await status.save();

    let response = {
      success: 1,
      message: "Estado de faturação editado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing Invoice State:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeUserState = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    let status = await db.Invoice_status.findByPk(id);

    if (!status) {
      return res
        .status(404)
        .send({ success: 0, message: "Estado de faturação inexistente" });
    }

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    //Antes verificar se esta atribuido a algum produto, se sim nao permitir

    await status.destroy();

    let response = {
      success: 1,
      message: "Estado de faturação removido com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing Invoice Status:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
