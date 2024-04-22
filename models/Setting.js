"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");

const Setting = sequelize.define(
  "Setting",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    default_profile_image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    default_image_batch: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image_home_user: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    link_drive_cv: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    link_drive_certi: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image_logo_admin: { // Tambah kolom image_logo_admin
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image_logo_user: { // Tambah kolom image_logo_user
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    default_password: { // Tambah kolom default_password
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "setting",
  }
);

module.exports = Setting;
