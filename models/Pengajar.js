"use strict";

const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../config/connection.js");
const User = require("../models/User.js");

const Pengajar = sequelize.define(
  "Pengajar",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    pengajar_id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
    },
    email_pengajar: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password_pengajar: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "wgsgws", // Default password as 'wgsgws'
    },
    nama_pengajar: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    jenis_kelamin: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    profile_image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "pengajar",
    paranoid: true,
  }
);


Pengajar.belongsTo(User, { foreignKey: "pengajar_id" });

module.exports = Pengajar;
