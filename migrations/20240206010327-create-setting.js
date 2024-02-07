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
      text_home_user: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      image_home_user: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      link_gdrive: {
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
