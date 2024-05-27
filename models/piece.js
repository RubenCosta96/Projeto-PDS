const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('piece', {
    pid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    piece_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    artistaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'artist',
        key: 'aid'
      }
    },
    collectioncid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'collection',
        key: 'cid'
      }
    },
    piece_categorypcid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'piece_category',
        key: 'pcid'
      }
    },
    museummid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'museum',
        key: 'mid'
      }
    }
  }, {
    sequelize,
    tableName: 'piece',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__piece__DD37D91A3C0BCE01",
        unique: true,
        fields: [
          { name: "pid" },
        ]
      },
    ]
  });
};
