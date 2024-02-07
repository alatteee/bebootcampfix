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
    text_home_user: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image_home_user: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    link_gdrive: {
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