const db = require("../config/mysql");
const utils = require("../utils/index");
const services = require("../Services/product_evaluations");

exports.getAllEvaluations = async (req, res) => {
  try {

    let response = await services.getAllEvaluations();
      
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.getEvaluationsByUser = async (req, res) => {
    try {
        let id = req.params.id;

        let response = await services.getEvaluationsByUser(id);
        
        return res.status(200).send(response);
        } catch (err) {
            return res.status(500).send({ error: err, message: err.message });
        }
};

exports.getEvaluationsByProduct = async (req, res) => {
    try {
        let id = req.params.id;

        let response = await services.getEvaluationsByProduct(id);
       
        return res.status(200).send(response);
        } catch (err) {
            return res.status(500).send({ error: err, message: err.message });
        }
};


exports.getEvaluation = async (req, res) => {
  try {
    let id = req.params.id;
    
    let response = await services.getEvaluation(id);

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.addEvaluation = async (req, res) => {
  try {
    let description = req.body.description;
    let evaluation = req.body.evaluation;
    let prodId = req.params.productId;
    let idUserToken = req.user.id;

    let response = await services.addEvaluation(idUserToken, description, evaluation, prodId);

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
    let { description , evaluation} = req.body;

    let response = await services.editEvaluation(idUserToken, description, evaluation, prodId);

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

    let response = await services.removeEvaluation(idUserToken, prodId, id);

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing Evaluation:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
