const db = require('../config/mysql');
const utils = require("../utils/index");

exports.getAllEvaluations = async () =>{
    try{
        let evaluations = await db.product_evaluation.findAll();

        if (evaluations.length === 0)
            throw new Error("Não existe nenhuma avaliaçao");

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

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getEvaluationsByUser = async (id) =>{
    try{
        let evaluations = await db.product_evaluation.findAll({
            where:{
                useruid: id,
            },
        });
  
        if (evaluations.length === 0)
            throw new Error("Não existem avaliaçoes realizadas por esse utilzador");
  
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

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getEvaluationsByProduct = async (id) =>{
    try{
        let evaluations = await db.product_evaluation.findAll({
            where:{
                productprodid: id,
            },
        });
    
        if (evaluations.length === 0)
            throw new Error("Não existem avaliaçoes realizadas por esse produto");
    
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

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.getEvaluation = async (id) =>{
    try{
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

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.addEvaluation = async (idUserToken,description, evaluation,prodId) =>{
    try{
        let newEvaluation = await db.product_evaluation.create({
            pe_description: description,
            pe_evaluation: evaluation,
            useruid: idUserToken,
            productprodid: prodId,
        });
    
        let response = {
          success: 1,
          message: "Avaliação registada com sucesso",
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.editEvaluation = async (idUserToken,description, evaluation,prodId) =>{
    try{
        let evaluations = await db.product_evaluation.findOne({
            where:{
                productprodid: prodId,
                useruid: idUserToken,
                
            }
        });
    
        if (!evaluations) {
          return res
            .status(404)
            .send({ success: 0, message: "Avaliação inexistente" });
        }
    
    
        evaluations.pe_description = description;
        evaluations.pe_evaluation = evaluation;
        evaluations.useruid = idUserToken;
    
        await evaluations.save();
    
        let response = {
          success: 1,
          message: "Avaliação editada com sucesso",
        };

        return response;
    }catch (err) {
		throw new Error(err);
	}
};

exports.removeEvaluation = async (idUserToken, prodId, userId) =>{
    try{
        let user = await utils.userType(idUserToken);

        switch (user) {
			case 1: //Admin
				try {
                    let evaluation = await db.product_evaluation.findOne({
                        where:{
                            productprodid: prodId,
                            useruid: userId,
                        }
                    });
                
                    if (!evaluation) {
                      return res
                        .status(404)
                        .send({ success: 0, message: "Avaliação inexistente" });
                    }
                
                    await evaluation.destroy();
				} catch (err) {
					throw new Error(err);
				}
                break;
			case 2: //Manager
                throw new Error("Sem permissao!");
			case 3: //User
            try {
                let evaluation = await db.product_evaluation.findOne({
                    where:{
                        productprodid: prodId,
                        useruid: idUserToken,
                    }
                });
            
                if (!evaluation) {
                  return res
                    .status(404)
                    .send({ success: 0, message: "Avaliação inexistente" });
                }
            
                await evaluation.destroy();
            } catch (err) {
                throw new Error(err);
            }
            break;
			default:
				throw new Error("Utilizador nao reconhecido!");
		}

        let response = {
            success: 1,
            message: "Avaliação removida com sucesso",
          };

        return response;
    }catch (err) {
        throw new Error(err);
    }
};