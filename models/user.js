const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    uid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    user_email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    user_password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    user_statusus_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_status',
        key: 'us_id'
      }
    },
    user_typeutid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_type',
        key: 'utid'
      }
    }
  }, {
    sequelize,
    tableName: 'user',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__user__DD7012647E8F4BFA",
        unique: true,
        fields: [
          { name: "uid" },
        ]
      },
    ]
  });
};
