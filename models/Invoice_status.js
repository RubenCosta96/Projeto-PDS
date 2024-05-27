const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Invoice_status', {
    invoicestatusid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Invoice_status',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__Invoice___E6145C770C795D51",
        unique: true,
        fields: [
          { name: "invoicestatusid" },
        ]
      },
    ]
  });
};
