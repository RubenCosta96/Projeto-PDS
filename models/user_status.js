const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_status', {
    us_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    us_description: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user_status',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__user_sta__2E701A67435B5EE6",
        unique: true,
        fields: [
          { name: "us_id" },
        ]
      },
    ]
  });
};
