const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notification_type', {
    ntid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nt_description: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'notification_type',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__notifica__718E5494D10326A6",
        unique: true,
        fields: [
          { name: "ntid" },
        ]
      },
    ]
  });
};
