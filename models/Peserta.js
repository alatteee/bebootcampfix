"use strict";

const { DataTypes, BOOLEAN } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../config/connection.js");
const Batch = require("../models/Batch.js");
const User = require("../models/User.js");

const Peserta = sequelize.define(
  "Peserta",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    peserta_id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
    },
    batch_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    password_peserta: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "bootcampwgs", // Default password as 'bootcampwgs'
    },
    default_password: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    nama_peserta: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    jenis_kelamin: {
      type: DataTypes.ENUM("L", "P"),
      allowNull: true,
      defaultValue: "L", // Default value, you can change it as needed
    },
    nomor_handphone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    alamat_rumah: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tanggal_lahir: {
      type: DataTypes.DATEONLY(),
      allowNull: true,
    },
    link_github: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    cv: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    penilaian: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    hireBy: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image: {
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
    tableName: "peserta",
    paranoid: true,
  }
);

Peserta.belongsTo(Batch, { foreignKey: "batch_id" });
Peserta.belongsTo(User, { foreignKey: "peserta_id" });

module.exports = Peserta;
