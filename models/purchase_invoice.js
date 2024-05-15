const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('purchase_invoice', {
    purchase_invoiceid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    purchase_entry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    museummid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'museum',
        key: 'mid'
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
    tableName: 'purchase_invoice',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "purchase_invoice_purchase_invoiceid",
        unique: true,
        fields: [
          { name: "purchase_invoiceid" },
        ]
      },
      {
        name: "purid",
        unique: true,
        fields: [
          { name: "purchase_invoiceid" },
        ]
      },
    ]
  });
};
