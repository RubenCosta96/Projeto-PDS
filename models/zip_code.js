const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('zip_code', {
    zipid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'zip_code',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__zip_code__240C764D7F21E1F6",
        unique: true,
        fields: [
          { name: "zipid" },
        ]
      },
    ]
  });
};
