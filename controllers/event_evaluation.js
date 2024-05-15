const utils = require("../utils/index");
const db = require("../config/mysql");
const event_evaluation = require("../models/event_evaluation");
const user = require("../models/user");
const event_status = require("../models/event_status");

exports.getEventsEval = async (req, res) => {
  try {
    let event_evaluation = await db.event_evaluation.findAll();

    if (event_evaluation.length === 0) return res.status(404).send({ success: 0, message: "Não existem avaliações de evento." });

    let response = {
      success: 1,
      length: event_evaluation.length,
      results: event_evaluation.map((event_evaluation) => {
        return {
          id: event_evaluation.eventeid,
          description: event_evaluation.ee_description,
          evaluation: event_evaluation.ee_evaluation,
          user_id: event_evaluation.useruid,
        };
      }),
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getEventEval = async (req, res) => {
  try {
    let id = req.params.id;
    /*
      let idUserToken = req.user.id;
  
      let isAdmin = await utils.isAdmin(idUserToken);
      if (!isAdmin && id != idUserToken) return res.status(403).send({ success: 0, message: "Sem permissão" });
      */

    let event = await db.event.findByPk(id);

    if (!event) return res.status(404).send({ success: 0, message: "Evento inexistente" });

    let event_evaluation = await db.event_evaluation.findAll({
      where:{
        eventeid:id
      }});

    let response = {
      success: 1,
      length: 1,
      results: [
        {
          id: event_evaluation.eventeid,
          description: event_evaluation.ee_description,
          evaluation: event_evaluation.ee_evaluation,
          user_id: event_evaluation.useruid,
        },
      ],
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addEventsEval = async (req, res) => {
  try {
    let { description, evaluation, user_id } = req.body;

    /*
      let isAdmin = await utils.isAdmin(idUserToken); //Verificar
      if (!isAdmin && idOwner != idUserToken) {
        return res.status(403).send({ success: 0, message: "Sem permissão" });
      }
  
      let user = await db.user.findByPk(idOwner);
      if (!user) {
        return res.status(404).send({ success: 0, message: "Utilizador inexistente" });
      }
      */
    let newEventEval = await db.event_evaluation.create({
      ee_description: description,
      ee_evaluation: evaluation,
      useruid: user_id,
    });

    let response = {
      success: 1,
      message: "Avaliação de evento criada com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding event evaluation:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editEventsEval = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;
    let { description, evaluation, user_id } = req.body;

    let event_evaluation = await db.event_evaluation.findByPk(id);

    if (!event_evaluation) {
      return res.status(404).send({ success: 0, message: "Avaliação de evento inexistente" });
    }

    let user = await db.user.findByPk(idUserToken);
    if (!user) {
      return res.status(404).send({ success: 0, message: "Utilizador inexistente" });
    }

    /*
      let idOwner = artist.id_user;
  
      let isAdmin = await utils.isAdmin(idUserToken); //Verificar
      if (!isAdmin && idOwner != idUserToken) {
        return res.status(403).send({ success: 0, message: "Sem permissão" });
      }
      */

    if (id) event_evaluation.eventeeid = id;
    if (description) event_evaluation.ee_description = description;
    if (evaluation) event_evaluation.ee_evaluation = evaluation;
    if (user_id) event_evaluation.useruid = user_id;

    await event_evaluation.save();

    let response = {
      success: 1,
      message: "Avaliação de evento editada com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing event evaluation:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeEventsEval = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;
    const event_evaluation = await db.event_evaluation.findByPk(id);

    if (!event_evaluation) {
      return res.status(404).send({ success: 0, message: "Avaliação inexistente" });
    }

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar
    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    await event_evaluation.destroy();

    let response = {
      success: 1,
      message: "Avaliação de evento removida com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing event evaluation:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
