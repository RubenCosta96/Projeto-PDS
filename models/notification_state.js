const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notification_state', {
    nsid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ns_description: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'notification_state',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__notifica__6E6190013326D4CE",
        unique: true,
        fields: [
          { name: "nsid" },
        ]
      },
    ]
  });
};
