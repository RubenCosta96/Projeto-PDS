const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('favorites', {
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
    tableName: 'favorites',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__favorite__10E6B8F639B0B038",
        unique: true,
        fields: [
          { name: "useruid" },
          { name: "productprodid" },
        ]
      },
    ]
  });
};
