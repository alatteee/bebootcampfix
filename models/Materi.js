'use strict';

const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/connection.js');

const Materi = sequelize.define(
  'Materi',
  {
    materi_id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false,
    },
    nama_materi: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'materi',
    paranoid: true
  }
);

module.exports = Materi;
