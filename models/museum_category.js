const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('museum_category', {
    mcid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    mc_description: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'museum_category',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__museum_c__7BBD3CAFC00448EF",
        unique: true,
        fields: [
          { name: "mcid" },
        ]
      },
    ]
  });
};
