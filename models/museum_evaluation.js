const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('museum_evaluation', {
    me_description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    me_evaluation: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    museummid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'museum',
        key: 'mid'
      }
    },
    useruid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'uid'
      }
    }
  }, {
    sequelize,
    tableName: 'museum_evaluation',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__museum_e__1DA64CBA1968C1D4",
        unique: true,
        fields: [
          { name: "museummid" },
          { name: "useruid" },
        ]
      },
    ]
  });
};
