const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sale_invoice', {
    sale_invoiceid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    invoice_departure_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    useruid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    Invoice_statusinvoicestatusid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Invoice_status',
        key: 'invoicestatusid'
      }
    }
  }, {
    sequelize,
    tableName: 'sale_invoice',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__sale_inv__F67992D09F8555CB",
        unique: true,
        fields: [
          { name: "sale_invoiceid" },
        ]
      },
    ]
  });
};
