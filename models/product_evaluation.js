const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_evaluation', {
    pe_description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pe_evaluation: {
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
    tableName: 'product_evaluation',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__product___10E6B8F62F7B69C9",
        unique: true,
        fields: [
          { name: "useruid" },
          { name: "productprodid" },
        ]
      },
    ]
  });
};
