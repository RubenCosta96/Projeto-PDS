const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('purchase_line', {
    purchase_lid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    purline_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    productprodid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'product',
        key: 'prodid'
      }
    },
    purchase_invoicepurchase_invoiceid: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'purchase_line',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__purchase__AD1FF6C0B01B3C76",
        unique: true,
        fields: [
          { name: "purchase_lid" },
        ]
      },
    ]
  });
};
