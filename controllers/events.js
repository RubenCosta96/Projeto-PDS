const utils = require("../utils/index");
const db = require("../config/mysql");

exports.getEvents = async (req, res) => {
  try {
    let event = await db.event.findAll();

    if (event.length === 0) return res.status(404).send({ success: 0, message: "Não existem eventos" });

    let response = {
      success: 1,
      length: event.length,
      results: event.map((event) => {
        return {
          id: event.eid,
          start_date: event.event_start_date,
          end_date: event.event_end_date,
          type: event.event_typeeid,
          museum: event.museummid,
          status: event.event_statuses_id,
        };
      }),
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    let id = req.params.id;
    /*
      let idUserToken = req.user.id;
  
      let isAdmin = await utils.isAdmin(idUserToken);
      if (!isAdmin && id != idUserToken) return res.status(403).send({ success: 0, message: "Sem permissão" });
      */

    let event = await db.event.findByPk(id);

    if (!event) return res.status(404).send({ success: 0, message: "Evento inexistente" });

    let response = {
      success: 1,
      length: 1,
      results: [
        {
          id: event.eid,
          start_date: event.event_start_date,
          end_date: event.event_end_date,
          type: event.event_typeeid,
          museum: event.museummid,
          status: event.event_statuses_id,
        },
      ],
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.addEvent = async (req, res) => {
  try {
    let { start_date, end_date, type, museum, status } = req.body;

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
    let newEvent = await db.event.create({
      event_start_date: start_date,
      event_end_date: end_date,
      event_typeetid: type,
      museummid: museum,
      event_statuses_id: status,
    });

    let response = {
      success: 1,
      message: "Evento criado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding event:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editEvent = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;
    let { start_date, end_date, type, museum, status } = req.body;

    let event = await db.event.findByPk(id);

    if (!event) {
      return res.status(404).send({ success: 0, message: "Evento inexistente" });
    }

    /*
      let idOwner = artist.id_user;
  
      let isAdmin = await utils.isAdmin(idUserToken); //Verificar
      if (!isAdmin && idOwner != idUserToken) {
        return res.status(403).send({ success: 0, message: "Sem permissão" });
      }
      */

    let { eid } = req.body;

    if (eid) event.eid = eid;
    if (start_date) event.event_start_date = start_date;
    if (end_date) event.event_end_date = end_date;
    if (type) event.event_typeeid = type;
    if (museum) event.museummid = museum;
    if (status) event.event_statuses_id = status;

    await event.save();

    let response = {
      success: 1,
      message: "Evento editado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing event:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeEvent = async (req, res) => {
  try {
    let id = req.params.id;
    let idUserToken = req.user.id;

    const event = await db.event.findByPk(id);

    if (!event) {
      return res.status(404).send({ success: 0, message: "Evento inexistente" });
    }

    let isAdmin = await utils.isAdmin(idUserToken); //Verificar
    if (!isAdmin) {
      return res.status(403).send({ success: 0, message: "Sem permissão" });
    }

    await event.destroy();

    let response = {
      success: 1,
      message: "Evento removido com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing event:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
