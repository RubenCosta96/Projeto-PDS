const db = require("../config/mysql");

exports.isAdmin = async (id) => {
  try {
    const user = await db.user.findByPk(id, {
      include: [
        {
          model: db.user_type,
          as: "user_typeut",
        },
      ],
    });
    if (!user || user.user_typeutid !== 1) return 0;

    return 1;
  } catch (err) {
    console.error("Error checking admin status:", err);
    return 0;
  }
};

exports.isManager = async (id) => {
	try {
		const userMuseum = await db.usermuseum.findOne({ where: { useruid: id }});

		if (!userMuseum) return 0;

		return 1;
	} catch (err) {
		console.error("Error checking manager:", err);
		return 0;
	}
};
