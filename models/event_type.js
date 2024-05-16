const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('event_type', {
    etid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    et_description: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'event_type',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__event_ty__C4F2083136A5DFA1",
        unique: true,
        fields: [
          { name: "etid" },
        ]
      },
    ]
  });
};
