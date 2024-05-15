const db = require("../config/mysql");
const utils = require("../utils/index");

exports.getEventsStatus = async (req, res) => {
  try {
    let event_status = await db.event_status.findAll();

    if (event_status.length === 0) return res.status(404).send({ success: 0, message: "Não existem estados de evento." });

    let response = {
      success: 1,
      length: event_status.length,
      results: event_status.map((event_status) => {
        return {
          id: event_status.es_id,
          description: event_status.es_description,
        };
      }),
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getEventStatus = async (req, res) => {
  try {
    let id = req.params.id;
    /*
        let idUserToken = req.user.id;
    
        let isAdmin = await utils.isAdmin(idUserToken);
        if (!isAdmin && id != idUserToken) return res.status(403).send({ success: 0, message: "Sem permissão" });
        */

    let event_status = await db.event_status.findByPk(id);

    if (!event_status) return res.status(404).send({ success: 0, message: "Estado de evento inexistente" });

    let response = {
      success: 1,
      length: 1,
      results: [
        {
          id: event_status.es_id,
          description: event_status.es_description,
        },
      ],
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addEventStatus = async (req, res) => {
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
    let newEventStatus = await db.event_status.create({
      es_description: description,
    });

    let response = {
      success: 1,
      message: "Estado de evento criado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding event state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editEventStatus = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;
    let { description } = req.body;

    let event_status = await db.event_status.findByPk(id);

    if (!event_status) {
      return res.status(404).send({ success: 0, message: "Estado de evento inexistente" });
    }

    /*
        let idOwner = artist.id_user;
    
        let isAdmin = await utils.isAdmin(idUserToken); //Verificar
        if (!isAdmin && idOwner != idUserToken) {
          return res.status(403).send({ success: 0, message: "Sem permissão" });
        }
        */

    let { es_id } = req.body;

    if (id) event_status.es_id = id;
    if (description) event_status.es_description = description;

    await event_status.save();

    let response = {
      success: 1,
      message: "Estado de evento editado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing event state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeEventStatus = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    const event_status = await db.event_status.findByPk(id);
    if (!event_status) {
      return res.status(404).send({ success: 0, message: "Estado de evento inexistente" });
    }

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar
    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    await event_status.destroy();

    let response = {
      success: 1,
      message: "Estado de evento removido com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing event state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
