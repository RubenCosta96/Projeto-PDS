const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('event', {
    eid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    event_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    event_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    event_typeetid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'event_type',
        key: 'etid'
      }
    },
    museummid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'museum',
        key: 'mid'
      }
    },
    event_statuses_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'event_status',
        key: 'es_id'
      }
    },
    Price: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'event',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__event__D9509F6D85A11790",
        unique: true,
        fields: [
          { name: "eid" },
        ]
      },
    ]
  });
};
