"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("batch", {
      batch_id: {
        type: Sequelize.UUID,
        defaultValue: uuidv4(),
        primaryKey: true,
        allowNull: false,
      },
      kategori_batch: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      materi_batch: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      deskripsi_batch: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      deskripsi_batch_user: { // Tambah kolom deskripsi_batch_user di bawah deskripsi_batch
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status_batch: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      image_batch: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      url: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("batch");
  },
};
