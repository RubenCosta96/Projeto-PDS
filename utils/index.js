const db = require("../config/mysql");
const user_type = require("../models/user_type");
const usermuseum = require("../models/usermuseum");

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

//Verifica o utilizador e retorna de uma ver o seu tipo, assumindo que na bd os usertypes esta definidos como 1-admin 2-manager 3-user
//Retorna 0 se o utilizador nao existir, 1 se admin, 2 se manager e 3 se user
exports.userType = async (id) => {
	try {
		const user = await db.user.findByPk(id, {
      include: [
        {
          model: db.user_type,
          as: "user_typeut",
        },
        {
          model: db.usermuseum,
          as: "usermuseums",
        }
      ],
    });

		if (!user) return 0;

    let code = user.user_typeut.utid;

    switch(code){
      case 1:
        //Adicionar verificaçoes se necessario
        break;
      case 2:
        let museum = user.usermuseums[0];
        if(!museum || museum.useruid != id)
          code = 0;
        break;
      case 3:
        //Adicionar verificaçoes se necessario
        break;
      default:
        code = 0;
        break;
    }

		return code;
	} catch (err) {
		console.error("Error checking user Type:", err);
		return 0;
	}
};