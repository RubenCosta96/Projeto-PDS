const { where } = require("sequelize");
const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getAllEvaluations = async (req, res) => {
  try {
      let evaluations = await db.product_evaluation.findAll();

      if (evaluations.length === 0)
        return res.status(404).send({ success: 0, message: "Não existe nenhuma avaliaçao" });

      let response = {
        success: 1,
        length: evaluations.length,
        results: evaluations.map((product_evaluation) => {
          return {
            description: product_evaluation.pe_description,
            evaluation: product_evaluation.pe_evaluation,
            userId: product_evaluation.useruid,
            productId: product_evaluation.productprodid,
          };
        }),
      };
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.getEvaluationsByUser = async (req, res) => {
    try {
        let id = req.params.id;
        let evaluations = await db.product_evaluation.findAll({
            where:{
                useruid: id,
            },
        });
  
        if (evaluations.length === 0)
            return res.status(404).send({ success: 0, message: "Não existem avaliaçoes realizadas por esse utilzador" });
  
        let response = {
            success: 1,
            length: evaluations.length,
            results: evaluations.map((product_evaluation) => {
            return {
                description: product_evaluation.pe_description,
                evaluation: product_evaluation.pe_evaluation,
                userId: product_evaluation.useruid,
                productId: product_evaluation.productprodid,
            };
            }),
        };
        return res.status(200).send(response);
        } catch (err) {
            return res.status(500).send({ error: err, message: err.message });
        }
};

exports.getEvaluationsByProduct = async (req, res) => {
    try {
        let id = req.params.id;
        let evaluations = await db.product_evaluation.findAll({
            where:{
                productprodid: id,
            },
        });
    
        if (evaluations.length === 0)
            return res.status(404).send({ success: 0, message: "Não existem avaliaçoes realizadas por esse produto" });
    
        let response = {
            success: 1,
            length: evaluations.length,
            results: evaluations.map((product_evaluation) => {
            return {
                description: product_evaluation.pe_description,
                evaluation: product_evaluation.pe_evaluation,
                userId: product_evaluation.useruid,
                productId: product_evaluation.productprodid,
            };
            }),
        };
        return res.status(200).send(response);
        } catch (err) {
            return res.status(500).send({ error: err, message: err.message });
        }
};


exports.getEvaluation = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await db.product_evaluation.findByPk(id);

    if (!result) {
      return res
        .status(404)
        .send({ success: 0, message: "Avaliaçao inexistente" });
    }

    let response = {    
      success: 1,
      results: {
        description: result.pe_description,
        evaluation: result.pe_evaluation,
        userId: result.useruid,
        productId: result.productprodid,
      },
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.addEvaluation = async (req, res) => {
  try {
    let description = req.body.description;
    let evaluation = req.body.evaluation;
    let prodId = req.body.productId;
    let idOwner = req.body.userId;
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
    
    let newEvaluation = await db.product_evaluation.create({
        pe_description: description,
        pe_evaluation: evaluation,
        useruid: idOwner,
        productprodid: prodId,
    });

    let response = {
      success: 1,
      message: "Avaliação registada com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding product evaluation:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.editEvaluation = async (req, res) => {
  try {
    let id = req.params.id;
    let prodId = req.body.productId;
    let idUserToken = req.user.id;

    let evaluations = await db.product_evaluation.findOne({
        where:{
            productprodid: prodId,
            useruid: id,
        }
    });

    if (!evaluations) {
      return res
        .status(404)
        .send({ success: 0, message: "Avaliação inexistente" });
    }

    let isManager = await utils.isManager(idUserToken); //Verificar
    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isManager && !isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    let { description , evaluation, userId } = req.body;

    if (description) evaluations.pe_description = description;
    if (evaluation) evaluations.pe_evaluation = evaluation;
    if (userId) evaluations.useruid = userId;

    await evaluations.save();

    let response = {
      success: 1,
      message: "Avaliação editada com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing evaluation:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeEvaluation = async (req, res) => {
  try {
    let id = req.params.id;
    let prodId = req.body.productId;
    let idUserToken = req.user.id;

    const evaluation = await await db.product_evaluation.findOne({
        where:{
            productprodid: prodId,
            useruid: id,
        }
    });

    if (!evaluation) {
      return res
        .status(404)
        .send({ success: 0, message: "Avaliação inexistente" });
    }

    //let idOwner = artist.id_user; //ver se faz sentido

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar

    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    //Antes verificar se esta atribuido a algum produto, se sim nao permitir

    await evaluation.destroy();

    let response = {
      success: 1,
      message: "Avaliação removida com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing Evaluation:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
