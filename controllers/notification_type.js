const db = require("../config/mysql");
const utils = require('../utils/index');

exports.getNotificationTypes = async (req, res) => {
  try {
    let notificationTypes = await db.notification_type.findAll();

    if (notificationTypes.length === 0) {
      return res.status(404).send({ success: 0, message: "Não existem tipos de notificação" });
    }

    let response = {
      success: 1,
      length: notificationTypes.length,
      results: notificationTypes.map((notificationType) => {
        return {
          description: notificationType.nt_description,
        };
      }),
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.getNotificationType = async (req, res) => {
  try {
    let id = req.params.id;

    let notificationType = await db.notification_type.findByPk(id);

    if (!notificationType) {
      return res.status(404).send({ success: 0, message: "Tipo de notificação inexistente" });
    }

    let response = {
      success: 1,
      length: 1,
      results: [
        {
          description: notificationType.nt_description,
        },
      ],
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.addNotificationType = async (req, res) => {
  try {
    let { description } = req.body;

    let newNotificationType = await db.notification_type.create({
      nt_description: description,
    });

    let response = {
      success: 1,
      message: "Tipo de notificação criado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding notification type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.editNotificationType = async (req, res) => {
  try {
    let id = req.params.id;
    let { description } = req.body;

    let notificationType = await db.notification_type.findByPk(id);

    if (!notificationType) {
      return res.status(404).send({ success: 0, message: "Tipo de notificação inexistente" });
    }

    if (description) {
      notificationType.nt_description = description;
      await notificationType.save();
    }

    let response = {
      success: 1,
      message: "Tipo de notificação editado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error editing notification type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeNotificationType = async (req, res) => {
  try {
    let id = req.params.id;

    const notificationType = await db.notification_type.findByPk(id);

    if (!notificationType) {
      return res.status(404).send({ success: 0, message: "Tipo de notificação inexistente" });
    }

    await notificationType.destroy();

    let response = {
      success: 1,
      message: "Tipo de notificação removido com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing notification type:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
