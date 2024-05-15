const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sale_line', {
    sale_lid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    line_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sale_invoicesale_invoiceid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sale_invoice',
        key: 'sale_invoiceid'
      }
    },
    productprodid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'product',
        key: 'prodid'
      }
    }
  }, {
    sequelize,
    tableName: 'sale_line',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__sale_lin__3059D05D016CB0C8",
        unique: true,
        fields: [
          { name: "sale_lid" },
        ]
      },
    ]
  });
};
