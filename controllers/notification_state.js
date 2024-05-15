const db = require("../config/mysql");
const utils = require('../utils/index');

exports.getNotificationStates = async (req, res) => {
  try {
    let notificationStates = await db.notification_state.findAll();

    if (notificationStates.length === 0) {
      return res.status(404).send({ success: 0, message: "Não existem estados de notificação" });
    }

    let response = {
      success: 1,
      length: notificationStates.length,
      results: notificationStates.map((notificationState) => {
        return {
          description: notificationState.ns_description,
        };
      }),
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getNotificationState = async (req, res) => {
  try {
    let id = req.params.id;

    let notificationState = await db.notification_state.findByPk(id);

    if (!notificationState) {
      return res.status(404).send({ success: 0, message: "Estado de notificação inexistente" });
    }

    let response = {
      success: 1,
      length: 1,
      results: [
        {
          description: notificationState.ns_description,
        },
      ],
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addNotificationState = async (req, res) => {
  try {
    let { description } = req.body;

    let newNotificationState = await db.notification_state.create({
      ns_description: description,
    });

    let response = {
      success: 1,
      message: "Estado de notificação criado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding notification state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editNotificationState = async (req, res) => {
  try {
    let id = req.params.id;
    let { description } = req.body;

    let notificationState = await db.notification_state.findByPk(id);

    if (!notificationState) {
      return res.status(404).send({ success: 0, message: "Estado de notificação inexistente" });
    }

    if (description) {
      notificationState.ns_description = description;
      await notificationState.save();
    }

    let response = {
      success: 1,
      message: "Estado de notificação editado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing notification state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeNotificationState = async (req, res) => {
  try {
    let id = req.params.id;

    const notificationState = await db.notification_state.findByPk(id);

    if (!notificationState) {
      return res.status(404).send({ success: 0, message: "Estado de notificação inexistente" });
    }

    await notificationState.destroy();

    let response = {
      success: 1,
      message: "Estado de notificação removido com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing notification state:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
