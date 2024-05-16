const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ticket_status', {
    ts_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    desc_ticket_status: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ticket_status',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__ticket_s__F310C15B2AC4FC29",
        unique: true,
        fields: [
          { name: "ts_id" },
        ]
      },
    ]
  });
};
