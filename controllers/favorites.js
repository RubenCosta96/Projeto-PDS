const db = require("../config/mysql");

exports.getFavorites = async (req, res) => {
  try {
    let favorites = await db.favorites.findAll();

    if (favorites.length === 0) {
      return res.status(404).send({ success: 0, message: "Não existem favoritos" });
    }

    let response = {
      success: 1,
      length: favorites.length,
      results: favorites.map((favorite) => {
        return {
          user_id: favorite.useruid,
          product_id: favorite.productprodid,
        };
      }),
    };

    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ error: err, message: err.message });
  }
};


exports.getFavoriteById = async (req, res) => {
    try {
      let id = req.params.id;
  
      let favorite = await db.piece_category.findByPk(id);
  
      if (!favorite) {
        return res.status(404).send({ success: 0, message: "Categoria de peça inexistente" });
      }
  
      let response = {
        success: 1,
        length: 1,
        results: [
          {
            user_id: favorite.useruid,
            product_id: favorite.productprodid,
          },
        ],
      };
  
      return res.status(200).send(response);
    } catch (err) {
      return res.status(500).send({ error: err, message: err.message });
    }
  };

exports.addFavorite = async (req, res) => {
  try {
    let { user_id, product_id } = req.body;

    let newFavorite = await db.favorites.create({
      useruid: user_id,
      productprodid: product_id,
    });

    let response = {
      success: 1,
      message: "Favorito adicionado com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error adding favorite:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    let { user_id, product_id } = req.body;

    const favorite = await db.favorites.findOne({
      where: {
        useruid: user_id,
        productprodid: product_id
      }
    });

    if (!favorite) {
      return res.status(404).send({ success: 0, message: "Favorito inexistente" });
    }

    await favorite.destroy();

    let response = {
      success: 1,
      message: "Favorito removido com sucesso",
    };

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error removing favorite:", err);
    return res.status(500).send({ error: err, message: err.message });
  }
};
