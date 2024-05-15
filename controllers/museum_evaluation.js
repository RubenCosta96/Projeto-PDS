const utils = require("../utils/index");
const db = require("../config/mysql");

exports.getMuseumEvaluations = async (req, res) => {
  try {
    let museum_evaluations = await db.museum_evaluation.findAll();

    if (museum_evaluations.length === 0) return res.status(404).send({ success: 0, message: "Não existem avaliações de museu" });

    let response = {
      success: 1,
      length: museum_evaluations.length,
      results: museum_evaluations.map((museum_evaluation) => {
        return {
          description: museum_evaluation.me_description,
          evaluation: museum_evaluation.me_evaluation,
        };
      }),
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getMuseumEvaluation = async (req, res) => {
  try {
    let id = req.params.id;

    let museum_evaluation = await db.museum_evaluation.findByPk(id);

    if (!museum_evaluation) return res.status(404).send({ success: 0, message: "Avaliação inexistente" });

    let response = {
      success: 1,
      length: 1,
      results: [
        {
          description: museum_evaluation.me_description,
          evaluation: museum_evaluation.me_evaluation,
        },
      ],
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addMuseumEvaluation = async (req, res) => {
  try {
    let { description, evaluation, museumId, userId } = req.body;

    let newMuseum_Evaluation = await db.museum_evaluation.create({
      me_description: description,
      me_evaluation: evaluation,
      museummid: museumId,
      useruid: userId,
    });

    let response = {
      success: 1,
      message: "Avaliação criada com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding evaluation:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editMuseumEvaluation = async (req, res) => {
  try {
    let id = req.params.id;
    let { description, evaluation } = req.body;

    let museum_evaluation = await db.museum_evaluation.findByPk(id);

    if (!museum_evaluation) {
      return res.status(404).send({ success: 0, message: "Avaliação inexistente" });
    }

    if (description) museum_evaluation.me_description = description;
    if (evaluation) museum_evaluation.me_evaluation = evaluation;

    await museum_evaluation.save();

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

exports.removeMuseumEvaluation = async (req, res) => {
  try {
    let id = req.params.id;

    const museum_evaluation = await db.museum_evaluation.findByPk(id);

    if (!museum_evaluation) {
      return res.status(404).send({ success: 0, message: "Avaliação inexistente" });
    }

    await museum_evaluation.destroy();

    let response = {
      success: 1,
      message: "Avaliação removida com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing evaluation:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
