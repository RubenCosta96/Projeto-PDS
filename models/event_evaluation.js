const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('event_evaluation', {
    ee_description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ee_evaluation: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    useruid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    eventeid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'event',
        key: 'eid'
      }
    }
  }, {
    sequelize,
    tableName: 'event_evaluation',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__event_ev__A84F48926F3196E3",
        unique: true,
        fields: [
          { name: "useruid" },
          { name: "eventeid" },
        ]
      },
    ]
  });
};
