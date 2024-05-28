const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notification', {
    nid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    n_description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    notification_typentid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'notification_type',
        key: 'ntid'
      }
    },
    useruid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    notification_statensid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'notification_state',
        key: 'nsid'
      }
    }
  }, {
    sequelize,
    tableName: 'notification',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__notifica__DF97D0F5656EE6C5",
        unique: true,
        fields: [
          { name: "nid" },
        ]
      },
    ]
  });
};
