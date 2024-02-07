"use strict";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
    }
  },
  {
    timestamps: true,
    tableName: "user",
    paranoid: true,
  }
);

module.exports = User;
