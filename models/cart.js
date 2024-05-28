const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cart', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    useruid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    productprodid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'product',
        key: 'prodid'
      }
    }
  }, {
    sequelize,
    tableName: 'cart',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__cart__10E6B8F6A57DE352",
        unique: true,
        fields: [
          { name: "useruid" },
          { name: "productprodid" },
        ]
      },
    ]
  });
};
