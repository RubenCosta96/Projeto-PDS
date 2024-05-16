const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('support_state', {
    ssid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'support_state',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__support___366F2DDC03B8EBBC",
        unique: true,
        fields: [
          { name: "ssid" },
        ]
      },
    ]
  });
};
