'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pengajar', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      pengajar_id: {
        type: Sequelize.UUID,
        defaultValue: uuidv4(),
        primaryKey: true,
        allowNull: false,
      },
      email_pengajar: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      password_pengajar: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      nama_pengajar: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      jenis_kelamin: {
        type: Sequelize.ENUM('L', 'P'),
        allowNull: false,
      },
      profile_image: {
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
    return queryInterface.dropTable('pengajar');
  },
};
