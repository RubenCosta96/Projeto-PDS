const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('collection', {
    cid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    collection_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'collection',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__collecti__D837D05FF6E45973",
        unique: true,
        fields: [
          { name: "cid" },
        ]
      },
    ]
  });
};
