const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('museum', {
    mid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    museum_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    museum_address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    premium: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    zip_ext: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    museum_categorymcid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'museum_category',
        key: 'mcid'
      }
    },
    zip_codezipid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'zip_code',
        key: 'zipid'
      }
    }
  }, {
    sequelize,
    tableName: 'museum',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__museum__DF5032EC0512418D",
        unique: true,
        fields: [
          { name: "mid" },
        ]
      },
    ]
  });
};
