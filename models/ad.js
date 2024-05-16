const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ad', {
    adid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    useruid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    piecepid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'piece',
        key: 'pid'
      }
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ad_stateadstid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ad_state',
        key: 'adstid'
      }
    }
  }, {
    sequelize,
    tableName: 'ad',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__ad__56B503F08CACD90D",
        unique: true,
        fields: [
          { name: "adid" },
        ]
      },
    ]
  });
};
