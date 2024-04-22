"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("setting", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      default_profile_image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      default_image_batch: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      image_home_user: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      link_drive_cv: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      link_drive_certi: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      image_logo_admin: { // Tambah kolom image_logo_admin
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      image_logo_user: { // Tambah kolom image_logo_user
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      default_password: { // Tambah kolom default_password
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("setting");
  },
};
