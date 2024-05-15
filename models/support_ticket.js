const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('support_ticket', {
    stid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    support_statesssid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'support_state',
        key: 'ssid'
      }
    },
    museummid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'museum',
        key: 'mid'
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
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    admin_useruid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'uid'
      }
    }
  }, {
    sequelize,
    tableName: 'support_ticket',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__support___312D1FC7CBF6B78A",
        unique: true,
        fields: [
          { name: "stid" },
        ]
      },
    ]
  });
};
