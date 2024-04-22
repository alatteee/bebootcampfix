"use strict";
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("certificate", {
      id: {
        type: Sequelize.UUID,
        defaultValue: uuidv4(),
        primaryKey: true,
        allowNull: false,
      },
      peserta_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "user", // Gantilah "user" dengan nama tabel yang benar
          key: "user_id",
        },
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("certificate");
  },
};
