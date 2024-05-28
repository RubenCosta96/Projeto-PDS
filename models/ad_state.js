const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ad_state', {
    adstid: {
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
    tableName: 'ad_state',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__ad_state__E9529D23CC43BA89",
        unique: true,
        fields: [
          { name: "adstid" },
        ]
      },
    ]
  });
};
