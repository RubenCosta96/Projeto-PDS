const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proposal_state', {
    psid: {
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
    tableName: 'proposal_state',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__proposal__46A5AF86088145FA",
        unique: true,
        fields: [
          { name: "psid" },
        ]
      },
    ]
  });
};
