const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_type', {
    ptid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pt_description: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'product_type',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__product___46E3A57FFBF36342",
        unique: true,
        fields: [
          { name: "ptid" },
        ]
      },
    ]
  });
};
