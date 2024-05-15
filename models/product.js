const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product', {
    prodid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    product_price: {
      type: DataTypes.REAL,
      allowNull: false
    },
    product_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    museummid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'museum',
        key: 'mid'
      }
    },
    product_typeptid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'product_type',
        key: 'ptid'
      }
    }
  }, {
    sequelize,
    tableName: 'product',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__product__31A473297A5EE19C",
        unique: true,
        fields: [
          { name: "prodid" },
        ]
      },
    ]
  });
};
