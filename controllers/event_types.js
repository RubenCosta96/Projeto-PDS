const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getEventTypes = async (req, res) => {
  try {
    let event_type = await db.event_type.findAll();

    if (event_type.length === 0) return res.status(404).send({ success: 0, message: "Não existem tipos de evento." });

    let response = {
      success: 1,
      length: event_type.length,
      results: event_type.map((event_type) => {
        return {
          id: event_type.etid,
          description: event_type.et_description,
        };
      }),
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getEventType = async (req, res) => {
  try {
    let id = req.params.id;
    /*
        let idUserToken = req.user.id;
    
        let isAdmin = await utils.isAdmin(idUserToken);
        if (!isAdmin && id != idUserToken) return res.status(403).send({ success: 0, message: "Sem permissão" });
        */

    let event_type = await db.event_type.findByPk(id);

    if (!event_type) return res.status(404).send({ success: 0, message: "Tipo de evento inexistente" });

    let response = {
      success: 1,
      length: 1,
      results: [
        {
          id: event_type.etid,
          description: event_type.et_description,
        },
      ],
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addEventType = async (req, res) => {
  try {
    let { description } = req.body;

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
    let newEventType = await db.event_type.create({
      et_description: description,
    });

    let response = {
      success: 1,
      message: "Tipo de evento criado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding event type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editEventType = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;
    let { description } = req.body;

    let event_type = await db.event_type.findByPk(id);

    if (!event_type) {
      return res.status(404).send({ success: 0, message: "Tipo de evento inexistente" });
    }

    /*
        let idOwner = artist.id_user;
    
        let isAdmin = await utils.isAdmin(idUserToken); //Verificar
        if (!isAdmin && idOwner != idUserToken) {
          return res.status(403).send({ success: 0, message: "Sem permissão" });
        }
        */

    let { etid } = req.body;

    if (id) event_type.etid = id;
    if (description) event_type.et_description = description;

    await event_type.save();

    let response = {
      success: 1,
      message: "Tipo de evento editado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing event type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeEventType = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    const event_type = await db.event_type.findByPk(id);

    if (!event_type) {
      return res.status(404).send({ success: 0, message: "Tipo de evento inexistente" });
    }

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar
    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    await event_type.destroy();

    let response = {
      success: 1,
      message: "Tipo de evento removido com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing event type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
