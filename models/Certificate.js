const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/connection.js');
const User = require("../models/User.js");

const Certificate = sequelize.define(
  'Certificate',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false,
    },
    peserta_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'certificate',
    paranoid: true,
  }
);

module.exports = Certificate;
