'use strict';

const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/connection.js');

const Batch = sequelize.define(
  'Batch',
  {
    batch_id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false,
    },
    kategori_batch: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    materi_batch: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    deskripsi_batch: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status_batch: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    image_batch: {
      type: DataTypes.STRING(255),
      allowNull: true, // Allow NULL for image_batch
      defaultValue: 'defaultProfile.jpg', // Default image file name
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'batch',
    paranoid: true
  }
);

module.exports = Batch;
